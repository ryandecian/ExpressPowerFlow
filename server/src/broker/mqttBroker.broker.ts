/* mqttBroker.functional.ts
   Broker MQTT embarqué pour ExpressPowerFlow (Aedes + TCP) en style fonctionnel
   - Factory createMqttBroker(configPath)
   - Authentification simple (JSON) en attendant la DB
   - ACL Publish/Subscribe par username
   - start / stop / reload / status
*/

/* Import des dépendances : */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createServer, Server as NetServer } from "node:net";

/* Import des Types : */
import type { AclRuleBroker_Type } from "../types/broker/aclRuleBroker.type.js";
import type { UserBroker_Type } from "../types/broker/userBroker.type.js";

import type { Client as AedesClient, Subscription } from "aedes";
import type { IPublishPacket } from "mqtt-packet";

/* ---------- Types de configuration ---------- */

export type MqttConfig = {
    enabled: boolean;
    port: number;
    clientsMax?: number;
    users: UserBroker_Type[];
    acl: AclRuleBroker_Type[];
};

/* ---------- Client étendu pour stocker l’username authentifié ---------- */

type AugmentedClient = AedesClient & {
    __username?: string;
};

/* ---------- Utilitaire: matching wildcards MQTT ---------- */
/* "+" = un niveau ; "#" = plusieurs niveaux */
function topicMatches(pattern: string, topic: string): boolean {
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

/* ---------- Aedes: factory CommonJS chargée proprement en ESM ---------- */
/* On typage structurellement uniquement ce qu’on utilise (zéro any) */

interface AedesLike {
    connectedClients: number;
    handle: (socket: import("node:net").Socket) => void;
    close: (cb: () => void) => void;

    authenticate: (
        client: AedesClient,
        username: string | null | undefined,
        password: Buffer | null | undefined,
        done: (err: Error | null, success: boolean) => void
    ) => void;

    authorizePublish: (
        client: AedesClient,
        packet: IPublishPacket,
        done: (error?: Error) => void
    ) => void;

    authorizeSubscribe: (
        client: AedesClient,
        sub: Subscription,
        done: (error: Error | null, subscription?: Subscription | null) => void
    ) => void;

    on: (event: "client" | "clientDisconnect", listener: (c: AedesClient) => void) => void;
}

type AedesFactory = (opts?: { concurrency?: number }) => AedesLike;

const require = createRequire(import.meta.url);
const aedesFactory: AedesFactory = require("aedes");

/* ---------- Factory fonctionnelle ---------- */

export function createMqttBroker(configPath: string) {
    type AedesInstance = ReturnType<AedesFactory>;

    let broker: AedesInstance | null = null;   // Instance Aedes
    let tcpServer: NetServer | null = null;    // Serveur TCP
    let config: MqttConfig | null = null;      // Config courante

    /* Lecture + parsing de la configuration */
    function loadConfig(): MqttConfig {
        const p = path.resolve(configPath);
        const raw = fs.readFileSync(p, "utf-8");
        const json: MqttConfig = JSON.parse(raw);
        json.clientsMax = json.clientsMax ?? 50;
        return json;
    }

    /* État synthétique (pour /health par ex.) */
    function status(): {
        running: boolean;
        port: number | null;
        clients: number;
        enabled: boolean;
    } {
        return {
            running: !!broker && !!tcpServer,
            port: config?.port ?? null,
            clients: broker?.connectedClients ?? 0,
            enabled: config?.enabled ?? false
        };
    }

    /* Démarrage */
    function start(): void {
        if (broker || tcpServer) return; // déjà lancé

        config = loadConfig();
        if (!config.enabled) {
            console.log("[MQTT] Broker désactivé par la config.");
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

            (client as AugmentedClient).__username = username;
            done(null, true);
        };

        /* ACL Publish */
        b.authorizePublish = (
            client: AedesClient,
            packet: IPublishPacket,
            done: (error?: Error) => void
        ): void => {
            try {
                const username = (client as AugmentedClient).__username;
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

                const allowed = publishList.some((pattern) => topicMatches(pattern, topic));
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
                const username = (client as AugmentedClient).__username;
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

                const allowed = list.some((pattern) => topicMatches(pattern, topic));
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
        status
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
