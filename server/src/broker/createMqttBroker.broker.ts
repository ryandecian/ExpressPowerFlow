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
import { stop_Broker } from "./stop.broker.js";
import { reload_Broker } from "./reload.broker.js";

/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { AedesFactoryBroker_Type } from "../types/broker/aedesFactoryBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";

function createMqttBroker_Broker(configPath: string) {

    let broker: AedesInstanceBroker_Type | null = null;   // Instance Aedes
    let tcpServer: NetServer | null = null;    // Serveur TCP
    let config: MqttConfigBrocker_Type | null = null;      // Config courante

    /* Lecture + parsing de la configuration */
    loadConfig_Broker(configPath);

    /* État synthétique (pour /health par ex.) */
    status_Broker(broker, tcpServer, config);

    /* Démarrage */
    function start(): void {
        start_Broker(broker, tcpServer, config, configPath);
    }

    /* Arrêt propre */
    stop_Broker(broker, tcpServer);

    /* Reload (arrêt + redémarrage) */
    reload_Broker(broker, tcpServer, config, configPath);

    /* API publique de la factory */
    return {
        start,
        stop_Broker,
        reload_Broker,
        status_Broker
    };
}

export { createMqttBroker_Broker };

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
