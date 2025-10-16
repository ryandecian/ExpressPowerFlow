import fs from "fs";                                     /* Import du module Node.js pour lire des fichiers (config JSON) */
import path from "path";                                 /* Import utilitaire pour gérer les chemins de fichiers de manière portable */
import net, { Server as NetServer } from "net";          /* Import du module réseau TCP bas-niveau + typage du serveur TCP */
import aedes, { Aedes, Client } from "aedes";            /* Import du broker MQTT Aedes (fonction + types principaux) */

type User = {                                            /* Type TypeScript représentant un utilisateur MQTT */
    username: string;                                    /* Identifiant de connexion MQTT */
    password: string;                                    /* Mot de passe MQTT (en clair ici, plus tard on chiffrera) */
};

type AclRule = {                                         /* Type TS pour une règle d’ACL (droits par utilisateur) */
    username: string;                                    /* L’utilisateur concerné par la règle */
    publish?: string[];                                  /* Liste des topics autorisés en publication (whitelist) */
    subscribe?: string[];                                /* Liste des topics autorisés en abonnement (whitelist) */
};

type MqttConfig = {                                      /* Type TS pour la configuration complète du broker */
    enabled: boolean;                                    /* Active/désactive le broker intégré */
    port: number;                                        /* Port TCP d’écoute (1883 = MQTT non TLS) */
    clientsMax?: number;                                 /* Limite max de clients connectés simultanément */
    users: User[];                                       /* Tableau d’utilisateurs autorisés à se connecter */
    acl: AclRule[];                                      /* Tableau des règles ACL (publish/subscribe par user) */
};

export class MqttBroker {                                 /* Déclaration de la classe du broker embarqué */
    private static instance: MqttBroker | null = null;    /* Stockage statique pour implémenter le pattern Singleton */

    private broker: Aedes | null = null;                  /* Référence à l’instance Aedes (le broker MQTT en mémoire) */
    private tcpServer: NetServer | null = null;           /* Référence au serveur TCP (écoute du port MQTT) */
    private config: MqttConfig | null = null;             /* Dernière configuration chargée et active */
    private readonly configPath: string;                  /* Chemin du fichier/ressource de configuration */

    private constructor(configPath: string) {             /* Constructeur privé (empêche new MqttBroker depuis l’extérieur) */
        this.configPath = configPath;                     /* Sauvegarde du chemin de config pour rechargements ultérieurs */
    }

    public static getInstance(configPath: string) {       /* Méthode statique d’accès (Singleton) */
        if (!MqttBroker.instance) {                       /* Si aucune instance n’existe encore… */
            MqttBroker.instance = new MqttBroker(configPath); /* …on en crée une avec le chemin de config fourni */
        }
        return MqttBroker.instance;                       /* On retourne toujours la même instance unique */
    }

    public loadConfig(): MqttConfig {                     /* Lecture + parsing de la configuration du broker */
        const p = path.resolve(this.configPath);          /* Résout le chemin absolu depuis configPath */
        const raw = fs.readFileSync(p, "utf-8");          /* Lit le fichier de config en texte (UTF-8) */
        const json: MqttConfig = JSON.parse(raw);         /* Convertit le JSON en objet typé MqttConfig */
        /* Valeurs par défaut */
        json.clientsMax = json.clientsMax ?? 50;          /* Définit clientsMax à 50 si absent dans la config */
        return json;                                      /* Retourne l’objet de configuration */
    }

    public status() {                                     /* Donne un état synthétique du broker (pour /health par ex.) */
        return {
            running: !!this.broker && !!this.tcpServer,   /* true si l’instance Aedes et le serveur TCP sont actifs */
            port: this.config?.port ?? null,              /* Port d’écoute en cours, sinon null si pas démarré */
            clients: this.broker?.connectedClients ?? 0,  /* Nombre de clients MQTT actuellement connectés */
            enabled: this.config?.enabled ?? false        /* Flag enabled issu de la config courante */
        };
    }

    public start(): void {                                /* Démarre le broker si pas déjà lancé */
        if (this.broker || this.tcpServer) return;        /* Sécurité: si déjà lancé, on ne fait rien */

        this.config = this.loadConfig();                  /* Charge la config depuis le disque */
        if (!this.config.enabled) {                       /* Si la config dit "disabled"… */
            console.log("[MQTT] Broker désactivé par la config."); /* …on log et on s’arrête ici */
            return;
        }

        const users = this.config.users || [];            /* Extrait la liste d’utilisateurs autorisés */
        const acl = this.config.acl || [];                /* Extrait les règles d’ACL (publish/subscribe) */
        const clientsMax = this.config.clientsMax || 50;  /* Limite de connexions (fallback 50) */

        const broker = aedes({                            /* Crée l’instance Aedes (le moteur MQTT) */
            concurrency: 100,                             /* Nombre max de messages traités en parallèle */
            maxClientsIdLength: 128                       /* Taille max autorisée pour les IDs clients MQTT */
        });

        /* Authentification basique (plaintext pour la phase JSON sans DB) */
        broker.authenticate = (client: Client, username, password, done) => {  /* Hook d’authentification client */
            if (!username || !password) return done(null, false);              /* Refuse si credentials manquants */
            const passText = password.toString();                              /* Convertit le Buffer mot de passe en string */

            const ok = users.some(                                             /* Vérifie si (username+password) est dans la liste */
                (u) => u.username === username && u.password === passText
            );

            if (!ok) {                                                         /* Si aucun utilisateur ne correspond… */
                return done(null, false);                                      /* …authentification refusée */
            }

            /* Limite de clients (simple) */
            if (broker.connectedClients >= clientsMax) {                       /* Si la limite de connexions simultanées est atteinte… */
                return done(new Error("Trop de clients connectés"), false);    /* …refuse la connexion */
            }

            /* Marquer le username sur le client pour ACL */
            (client as any).__username = username;                             /* Stocke le username sur l’objet client (pour ACL) */
            done(null, true);                                                  /* Authentification acceptée */
        };

        /* ACL Publish */
        broker.authorizePublish = (client: Client, packet, done) => {          /* Hook d’autorisation de publication */
            try {
                const username = (client as any)?.__username as string | undefined; /* Récupère le username attaché au client */
                const topic = packet?.topic || "";                                  /* Topic ciblé par la publication */
                if (!username) return done(null);                                   /* Par précaution, si pas de username, on laisse la logique par défaut */

                const rule = acl.find((r) => r.username === username);              /* Cherche la règle ACL correspondant à ce user */
                if (!rule || !rule.publish || rule.publish.length === 0) {          /* Si pas de droits publish… */
                    return done(new Error("Publish non autorisé"));                 /* …on refuse */
                }
                const allowed = rule.publish.some((pattern) =>                      /* Vérifie si le topic matche un des patterns autorisés */
                    this.topicMatches(pattern, topic)
                );
                if (!allowed) {                                                     /* Si aucun pattern ne matche… */
                    return done(new Error("Topic publish refusé"));                 /* …on refuse */
                }
                done(null);                                                         /* Sinon on autorise la publication */
            } catch (e) {
                done(e as Error);                                                   /* En cas d’exception, on signale l’erreur */
            }
        };

        /* ACL Subscribe */
        broker.authorizeSubscribe = (client: Client, sub, done) => {                /* Hook d’autorisation d’abonnement */
            try {
                const username = (client as any)?.__username as string | undefined; /* Username du client demandeur */
                const topic = sub?.topic || "";                                     /* Topic auquel il veut s’abonner */
                if (!username) return done(null, null);                             /* Sans username, on refuse l’abonnement */

                const rule = acl.find((r) => r.username === username);              /* Règle ACL du user */
                const list = rule?.subscribe || [];                                 /* Liste des topics autorisés en subscribe */
                if (list.length === 0) {                                            /* Si liste vide… */
                    /* Aucun subscribe autorisé par défaut pour un Shelly publisher */
                    return done(null, null);                                        /* …on interdit l’abonnement (null = non autorisé) */
                }
                const allowed = list.some((pattern) =>                              /* Vérifie les patterns d’abonnement */
                    this.topicMatches(pattern, topic)
                );
                if (!allowed) return done(null, null);                              /* Si non autorisé, on refuse */
                done(null, sub);                                                    /* Sinon on autorise et on passe la souscription */
            } catch {
                return done(null, null);                                            /* En cas d’erreur, prudence: on refuse */
            }
        };

        /* Logs utiles */
        broker.on("client", (c) => {                                                /* Événement: un client MQTT vient de se connecter */
            console.log(`[MQTT] client connecté: ${c ? c.id : "unknown"}`);
        });
        broker.on("clientDisconnect", (c) => {                                      /* Événement: un client se déconnecte */
            console.log(`[MQTT] client déconnecté: ${c ? c.id : "unknown"}`);
        });
        broker.on("publish", (packet, c) => {                                       /* Événement: un message est publié (dev debug) */
            /* Laisse tranquille en prod; utile en dev */
            /* console.log(`[MQTT] publish ${packet.topic} (${packet.payload?.length || 0}B) from ${c?.id || "server"}`); */
        });

        const server = net.createServer(broker.handle);                              /* Crée un serveur TCP qui délègue le protocole MQTT à Aedes */
        server.listen(this.config.port, () => {                                      /* Lance l’écoute sur le port défini dans la config */
            console.log(`[MQTT] Broker embarqué en écoute sur :${this.config?.port}`);
        });

        this.broker = broker;                                                        /* Mémorise l’instance Aedes pour usage futur (stop/status…) */
        this.tcpServer = server;                                                     /* Mémorise le serveur TCP (pour pouvoir le fermer proprement) */
    }

    public stop(): void {                                                            /* Arrête proprement le broker et libère les ressources */
        if (!this.broker && !this.tcpServer) return;                                 /* Si rien n’est lancé, on ne fait rien */

        console.log("[MQTT] Arrêt du broker…");                                     
        const tasks: Promise<void>[] = [];                                           /* On accumule des promesses de fermeture (TCP + Aedes) */

        if (this.tcpServer) {                                                        /* Si le serveur TCP existe… */
            const s = this.tcpServer;
            tasks.push(
                new Promise((resolve) => s.close(() => resolve()))                   /* …on le ferme de façon asynchrone */
            );
        }

        if (this.broker) {                                                           /* Si l’instance Aedes existe… */
            const b = this.broker;
            tasks.push(
                new Promise((resolve) => b.close(() => resolve()))                   /* …on la ferme proprement aussi */
            );
        }

        Promise.all(tasks).finally(() => {                                           /* Quand toutes les fermetures sont terminées… */
            this.broker = null;                                                      /* …on remet les références à null (état “arrêté”) */
            this.tcpServer = null;
            console.log("[MQTT] Broker arrêté.");
        });
    }

    public reload(): void {                                                          /* Recharge la config et redémarre le broker rapidement */
        /* Arrêt -> relecture -> start */
        this.stop();                                                                 /* D’abord on arrête l’instance actuelle */
        /* petite attente pour libérer le port proprement */
        setTimeout(() => this.start(), 250);                                         /* Petite pause (250ms), puis redémarrage avec la config relue */
    }

    private topicMatches(pattern: string, topic: string): boolean {                  /* Fonction utilitaire: matching wildcards MQTT */
        /* Support simple de wildcards MQTT:
           "+" = un niveau; "#" = plusieurs niveaux */
        const patt = pattern.split("/");                                             /* Découpe le pattern en segments */
        const top = topic.split("/");                                                /* Découpe le topic en segments */

        for (let i = 0; i < patt.length; i++) {                                      /* On compare segment par segment */
            const p = patt[i];
            const t = top[i];

            if (p === "#") return true;                                              /* "#" matche tous les segments restants */
            if (p === "+") {                                                         /* "+" matche exactement un segment quelconque */
                if (t === undefined) return false;                                   /* S’il manque un segment côté topic, échec */
                continue;                                                            /* OK pour ce segment, on passe au suivant */
            }
            if (t !== p) return false;                                               /* Si c’est un segment “littéral” et qu’il ne matche pas, échec */
        }
        return patt.length === top.length;                                           /* Valide seulement si le nombre de segments matche */
    }
}
