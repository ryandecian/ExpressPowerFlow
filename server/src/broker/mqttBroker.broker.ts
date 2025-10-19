/* mqttBroker.functional.ts
   Broker MQTT embarqué pour ExpressPowerFlow (Aedes + TCP) en style fonctionnel
   - Factory createMqttBroker(configPath)
   - Authentification simple (JSON) en attendant la DB
   - ACL Publish/Subscribe par username
   - start / stop / reload / status
*/

/* Import des Composants */
import { loadConfig_Broker } from "./loadConfig.broker.js";
import { start_Broker } from "./start.broker.js";
import { status_Broker } from "./status.broker.js";

/* Import des dépendances : */
import { createServer, Server as NetServer } from "node:net";

/* Import des Types : */
import type { AclRuleBroker_Type } from "../types/broker/aclRuleBroker.type.js";
import type { AedesFactoryBroker_Type } from "../types/broker/aedesFactoryBroker.type.js";
import type { AugmentedClientBroker_Type } from "../types/broker/augmentedClientBroker.type.js";
import type { UserBroker_Type } from "../types/broker/userBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";

/* Import des Utils */
import { require_Utils } from "../utils/import/require.utils.js";

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
    start_Broker(broker, tcpServer, config, configPath);

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
        setTimeout(() => start_Broker(broker, tcpServer, config, configPath), 250);
    }

    /* API publique de la factory */
    return {
        start_Broker,
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
