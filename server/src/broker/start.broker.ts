/* Import des Composants */
import { loadConfig_Broker } from "./loadConfig.broker.js";

/* Import des dépendances : */
import { createServer, Server as NetServer } from "node:net";

/* Import des Types : */
import type { AclRuleBroker_Type } from "../types/broker/aclRuleBroker.type.js";
import type { AedesFactoryBroker_Type } from "../types/broker/aedesFactoryBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";
import type { AugmentedClientBroker_Type } from "../types/broker/augmentedClientBroker.type.js";
import type { Client as AedesClient, Subscription } from "aedes";
import type { IPublishPacket } from "mqtt-packet";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { UserBroker_Type } from "../types/broker/userBroker.type.js";

/* Import des Utils */
import { require_Utils } from "../utils/import/require.utils.js";
import { topicMatchesBroker_Utils } from "../utils/broker/topicMatchesBroker.utils.js";

/**
 * Factory du broker Aedes (CommonJS) chargée via un wrapper `require_Utils`.
 *
 * Contexte :
 * ----------
 * Le paquet `aedes` expose une factory CommonJS. Dans un projet ESM, on utilise
 * `createRequire(import.meta.url)` (encapsulé ici dans `require_Utils`) pour obtenir une
 * fonction `require` compatible. Cela permet d’instancier Aedes sans heurter la résolution ESM.
 *
 * Typage :
 * --------
 * `AedesFactoryBroker_Type` décrit la signature d’appel de la factory (options en entrée,
 * instance de broker en sortie), garantissant l’absence de `any` dans le flux.
 */

const aedesFactory: AedesFactoryBroker_Type = require_Utils("aedes");

function start_Broker(
    broker: AedesInstanceBroker_Type | null,
    tcpServer: NetServer | null = null,
    config: MqttConfigBrocker_Type | null,
    configPath: string
): { broker: AedesInstanceBroker_Type | null; tcpServer: NetServer | null; config?: MqttConfigBrocker_Type } {
    if (broker || tcpServer) {
        return { broker, tcpServer, ...(config ? { config } : {}) };
    }

    config = loadConfig_Broker(configPath);
    if (!config.enabled) {
        console.info("[MQTT] Broker désactivé par la config.");
        return { broker: null, tcpServer: null, config };
    }

    const users: UserBroker_Type[] = config.users ?? [];
    const acl: AclRuleBroker_Type[] = config.acl ?? [];
    const clientsMax: number = config.clientsMax ?? 50;

    const b = aedesFactory({ concurrency: 100 });

    /* Auth basique (plaintext pour la phase JSON sans DB) */
    b.authenticate = (
        client: AedesClient,
        username: string | null | undefined,
        password: Buffer | null | undefined,
        done: (err: Error | null, success: boolean) => void
    ): void => {
        if (!username || !password) {
            done(null, false);
            return;
        }
        const passText = password.toString("utf-8");

        const ok = users.some((u) => u.username === username && u.password === passText);
        if (!ok) {
            done(null, false);
            return;
        }

        if (b.connectedClients >= clientsMax) {
            done(new Error("Trop de clients connectés"), false);
            return;
        }

        (client as AugmentedClientBroker_Type).__username = username;
        done(null, true);
    };

    /* ACL Publish */
    b.authorizePublish = (
        client: AedesClient,
        packet: IPublishPacket,
        done: (error?: Error) => void
    ): void => {
        try {
            const username = (client as AugmentedClientBroker_Type).__username;
            const topic = packet.topic;

            if (!username) {
                done(new Error("Client non authentifié"));
                return;
            }

            const rule = acl.find((r) => r.username === username);
            const publishList = rule?.publish ?? [];
            if (publishList.length === 0) {
                done(new Error("Publish non autorisé"));
                return;
            }

            const allowed = publishList.some((pattern) => topicMatchesBroker_Utils(pattern, topic));
            if (!allowed) {
                done(new Error("Topic publish refusé"));
                return;
            }

            done();
        } catch (e) {
            done(e instanceof Error ? e : new Error(String(e)));
        }
    };

    /* ACL Subscribe */
    b.authorizeSubscribe = (
        client: AedesClient,
        sub: Subscription,
        done: (error: Error | null, subscription?: Subscription | null) => void
    ): void => {
        try {
            const username = (client as AugmentedClientBroker_Type).__username;
            const topic = sub.topic;

            if (!username) {
                done(null, null);
                return;
            }

            const rule = acl.find((r) => r.username === username);
            const list = rule?.subscribe ?? [];
            if (list.length === 0) {
                done(null, null);
                return;
            }

            const allowed = list.some((pattern) => topicMatchesBroker_Utils(pattern, topic));
            if (!allowed) {
                done(null, null);
                return;
            }

            done(null, sub);
        } catch {
            done(null, null);
        }
    };

    /* Serveur TCP */
    const s = createServer(b.handle);
    s.listen(config.port, () => {
        console.log(`[MQTT] Broker embarqué en écoute sur :${config?.port}`);
    });

    /* Retour des références pour que la factory les capture */
    return {
        broker: b,
        tcpServer: s,
        config
    };
}

export { start_Broker };


/**
 * Démarre le broker MQTT embarqué (Aedes + serveur TCP) si non déjà lancé.
 *
 * Objectif :
 * ----------
 * - Charger la configuration (fichier JSON) du broker via `loadConfig_Broker`.
 * - Instancier Aedes avec des paramètres runtime (ex. `concurrency`).
 * - Configurer l’authentification basique (en attendant la DB) et les ACL Publish/Subscribe.
 * - Lancer le serveur TCP et écouter sur le port défini en configuration.
 *
 * Paramètres :
 * ------------
 * @param broker     Instance actuelle du broker (ou `null` si non initialisée).
 *                   La fonction ne redémarre pas si `broker` est déjà défini.
 * @param tcpServer  Serveur TCP associé au broker (ou `null` si non initialisé).
 *                   La fonction ne redémarre pas si `tcpServer` est déjà défini.
 * @param config     Configuration courante du broker (peut être `null` avant chargement).
 * @param configPath Chemin vers le fichier JSON de configuration du broker.
 *
 * Sécurité / Bonnes pratiques :
 * -----------------------------
 * - Authentification : basique (plaintext) pour la phase JSON sans DB. À remplacer par une
 *   validation côté DB/Hash en production.
 * - ACL : filtrage par `username` avec motifs MQTT (`+`, `#`) via `topicMatchesBroker_Utils`.
 * - Robustesse : aucun `any` ; typage strict des callbacks Aedes (authenticate/authorize*).
 *
 * Effets :
 * --------
 * - Si `broker` et `tcpServer` sont déjà définis, la fonction **retourne immédiatement**.
 * - Si `config.enabled` est `false`, la fonction **log** et **retourne** sans démarrer.
 * - À l’issue, `broker` et `tcpServer` sont initialisés et à l’écoute.
 */
