/* mqttBroker.functional.ts
   Broker MQTT embarqué pour ExpressPowerFlow (Aedes + TCP) en style fonctionnel
   - Factory createMqttBroker(configPath)
   - Authentification simple (JSON) en attendant la DB
   - ACL Publish/Subscribe par username
   - start / stop / reload / status
*/

/* Import des Composants */
import { loadConfig_Broker } from "./loadConfig.broker.js";
import { status_Broker } from "./status.broker.js";

/* Import des dépendances : */
import { createRequire } from "node:module";
import { createServer, Server as NetServer } from "node:net";

/* Import des Types : */
import type { AclRuleBroker_Type } from "../types/broker/aclRuleBroker.type.js";
import type { AedesFactoryBroker_Type } from "../types/broker/aedesFactoryBroker.type.js";
import type { AugmentedClientBroker_Type } from "../types/broker/augmentedClientBroker.type.js";
import type { UserBroker_Type } from "../types/broker/userBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";

import type { Client as AedesClient, Subscription } from "aedes";
import type { IPublishPacket } from "mqtt-packet";

/* Import des Utils */
import { require_Utils } from "../utils/import/require.utils.js";
import { topicMatchesBroker_Utils } from "../utils/broker/topicMatchesBroker.utils.js";

const aedesFactory: AedesFactoryBroker_Type = require_Utils("aedes");

export function createMqttBroker(configPath: string) {

    let broker: AedesInstanceBroker_Type | null = null;   // Instance Aedes
    let tcpServer: NetServer | null = null;    // Serveur TCP
    let config: MqttConfigBrocker_Type | null = null;      // Config courante

    /* Lecture + parsing de la configuration */
    loadConfig_Broker(configPath);

    /* État synthétique (pour /health par ex.) */
    status_Broker(broker, tcpServer, config);

    /* Démarrage */
    function start(): void {
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

    /* Arrêt propre */
    function stop(): void {
        if (!broker && !tcpServer) return;

        console.log("[MQTT] Arrêt du broker…");
        const tasks: Array<Promise<void>> = [];

        if (tcpServer) {
            const s = tcpServer;
            tasks.push(new Promise<void>((resolve) => s.close(() => resolve())));
        }

        if (broker) {
            const b = broker;
            tasks.push(new Promise<void>((resolve) => b.close(() => resolve())));
        }

        void Promise.all(tasks).finally((): void => {
            broker = null;
            tcpServer = null;
            console.log("[MQTT] Broker arrêté.");
        });
    }

    /* Reload (arrêt + redémarrage) */
    function reload(): void {
        stop();
        setTimeout(() => start(), 250);
    }

    /* API publique de la factory */
    return {
        start,
        stop,
        reload,
        status_Broker
    };
}


/* ---------- Exemple d’utilisation ----------

import { createMqttBroker } from "./mqttBroker.functional";

const mqtt = createMqttBroker("./config/mqtt.config.json");
mqtt.start();

// plus tard...
// console.log(mqtt.status());
// mqtt.reload();
// mqtt.stop();

---------------------------------------------- */

/* ---------- Rappel TypeScript ----------

Dans tsconfig.json, activer pour supporter le default import (CommonJS):
{
    "compilerOptions": {
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
    }
}

----------------------------------------- */
