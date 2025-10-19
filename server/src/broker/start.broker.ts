/* Import des Composants */
import { loadConfig_Broker } from "./loadConfig.broker.js";

/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { AclRuleBroker_Type } from "../types/broker/aclRuleBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { UserBroker_Type } from "../types/broker/userBroker.type.js";

function start_Broker(
    broker: AedesInstanceBroker_Type | null, 
    tcpServer: NetServer | null = null, 
    config: MqttConfigBrocker_Type | null,
    configPath: string): void {

        if (broker || tcpServer) return; // déjà lancé

        config = loadConfig_Broker(configPath);
        if (!config.enabled) {
            console.info("[MQTT] Broker désactivé par la config.");
            return;
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

        /* Logs utiles (dev) */
        b.on("client", (c: AedesClient) => {
            console.log(`[MQTT] client connecté: ${c?.id ?? "unknown"}`);
        });
        b.on("clientDisconnect", (c: AedesClient) => {
            console.log(`[MQTT] client déconnecté: ${c?.id ?? "unknown"}`);
        });
        // b.on("publish", (packet: IPublishPacket, c: AedesClient | null) => {
        //     console.log(`[MQTT] publish ${packet.topic} (${Buffer.isBuffer(packet.payload) ? packet.payload.length : 0}B) from ${c?.id ?? "server"}`);
        // });

        /* Serveur TCP */
        const s = createServer(b.handle);
        s.listen(config.port, () => {
            console.log(`[MQTT] Broker embarqué en écoute sur :${config?.port}`);
        });

        broker = b;
        tcpServer = s;
    }