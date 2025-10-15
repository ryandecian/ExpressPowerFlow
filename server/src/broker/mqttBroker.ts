import fs from "fs";
import path from "path";
import net, { Server as NetServer } from "net";
import aedes, { Aedes, Client } from "aedes";

type User = {
    username: string;
    password: string;
};

type AclRule = {
    username: string;
    publish?: string[];
    subscribe?: string[];
};

type MqttConfig = {
    enabled: boolean;
    port: number;
    clientsMax?: number;
    users: User[];
    acl: AclRule[];
};

export class MqttBroker {
    private static instance: MqttBroker | null = null;

    private broker: Aedes | null = null;
    private tcpServer: NetServer | null = null;
    private config: MqttConfig | null = null;
    private readonly configPath: string;

    private constructor(configPath: string) {
        this.configPath = configPath;
    }

    public static getInstance(configPath: string) {
        if (!MqttBroker.instance) {
            MqttBroker.instance = new MqttBroker(configPath);
        }
        return MqttBroker.instance;
    }

    public loadConfig(): MqttConfig {
        const p = path.resolve(this.configPath);
        const raw = fs.readFileSync(p, "utf-8");
        const json: MqttConfig = JSON.parse(raw);
        // Valeurs par défaut
        json.clientsMax = json.clientsMax ?? 50;
        return json;
    }

    public status() {
        return {
            running: !!this.broker && !!this.tcpServer,
            port: this.config?.port ?? null,
            clients: this.broker?.connectedClients ?? 0,
            enabled: this.config?.enabled ?? false
        };
    }

    public start(): void {
        if (this.broker || this.tcpServer) return;

        this.config = this.loadConfig();
        if (!this.config.enabled) {
            console.log("[MQTT] Broker désactivé par la config.");
            return;
        }

        const users = this.config.users || [];
        const acl = this.config.acl || [];
        const clientsMax = this.config.clientsMax || 50;

        const broker = aedes({
            concurrency: 100, // nb max de messages traités en parallèle
            maxClientsIdLength: 128
        });

        // Authentification basique (plaintext pour la phase JSON sans DB)
        broker.authenticate = (client: Client, username, password, done) => {
            if (!username || !password) return done(null, false);
            const passText = password.toString();

            const ok = users.some(
                (u) => u.username === username && u.password === passText
            );

            if (!ok) {
                return done(null, false);
            }

            // Limite de clients (simple)
            if (broker.connectedClients >= clientsMax) {
                return done(new Error("Trop de clients connectés"), false);
            }

            // Marquer le username sur le client pour ACL
            (client as any).__username = username;
            done(null, true);
        };

        // ACL Publish
        broker.authorizePublish = (client: Client, packet, done) => {
            try {
                const username = (client as any)?.__username as string | undefined;
                const topic = packet?.topic || "";
                if (!username) return done(null); // par sécurité, refuser si pas auth ? ici on laisse passer si authenticate a déjà validé

                const rule = acl.find((r) => r.username === username);
                if (!rule || !rule.publish || rule.publish.length === 0) {
                    return done(new Error("Publish non autorisé"));
                }
                const allowed = rule.publish.some((pattern) =>
                    this.topicMatches(pattern, topic)
                );
                if (!allowed) {
                    return done(new Error("Topic publish refusé"));
                }
                done(null);
            } catch (e) {
                done(e as Error);
            }
        };

        // ACL Subscribe
        broker.authorizeSubscribe = (client: Client, sub, done) => {
            try {
                const username = (client as any)?.__username as string | undefined;
                const topic = sub?.topic || "";
                if (!username) return done(null, null);

                const rule = acl.find((r) => r.username === username);
                const list = rule?.subscribe || [];
                if (list.length === 0) {
                    // Aucun subscribe autorisé par défaut pour un Shelly publisher
                    return done(null, null);
                }
                const allowed = list.some((pattern) =>
                    this.topicMatches(pattern, topic)
                );
                if (!allowed) return done(null, null);
                done(null, sub);
            } catch {
                return done(null, null);
            }
        };

        // Logs utiles
        broker.on("client", (c) => {
            console.log(`[MQTT] client connecté: ${c ? c.id : "unknown"}`);
        });
        broker.on("clientDisconnect", (c) => {
            console.log(`[MQTT] client déconnecté: ${c ? c.id : "unknown"}`);
        });
        broker.on("publish", (packet, c) => {
            // Laisse tranquille en prod; utile en dev
            // console.log(`[MQTT] publish ${packet.topic} (${packet.payload?.length || 0}B) from ${c?.id || "server"}`);
        });

        const server = net.createServer(broker.handle);
        server.listen(this.config.port, () => {
            console.log(`[MQTT] Broker embarqué en écoute sur :${this.config?.port}`);
        });

        this.broker = broker;
        this.tcpServer = server;
    }

    public stop(): void {
        if (!this.broker && !this.tcpServer) return;

        console.log("[MQTT] Arrêt du broker…");
        const tasks: Promise<void>[] = [];

        if (this.tcpServer) {
            const s = this.tcpServer;
            tasks.push(
                new Promise((resolve) => s.close(() => resolve()))
            );
        }

        if (this.broker) {
            const b = this.broker;
            tasks.push(
                new Promise((resolve) => b.close(() => resolve()))
            );
        }

        Promise.all(tasks).finally(() => {
            this.broker = null;
            this.tcpServer = null;
            console.log("[MQTT] Broker arrêté.");
        });
    }

    public reload(): void {
        // Arrêt -> relecture -> start
        this.stop();
        // petite attente pour libérer le port proprement
        setTimeout(() => this.start(), 250);
    }

    private topicMatches(pattern: string, topic: string): boolean {
        // Support simple de wildcards MQTT:
        // "+" = un niveau; "#" = plusieurs niveaux
        const patt = pattern.split("/");
        const top = topic.split("/");

        for (let i = 0; i < patt.length; i++) {
            const p = patt[i];
            const t = top[i];

            if (p === "#") return true;
            if (p === "+") {
                if (t === undefined) return false;
                continue;
            }
            if (t !== p) return false;
        }
        return patt.length === top.length;
    }
}
