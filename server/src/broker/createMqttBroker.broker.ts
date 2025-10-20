/* Import des Composants */
import { loadConfig_Broker } from "./loadConfig.broker.js";
import { start_Broker } from "./start.broker.js";
import { status_Broker } from "./status.broker.js";
import { stop_Broker } from "./stop.broker.js";
import { reload_Broker } from "./reload.broker.js";

/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";
import type { StatusBroker_Type } from "../types/broker/statusBroker.type.js";

/* -------------------------------------------------------------------------------------------------
   Factory : createMqttBroker_Broker
   - Encapsule l’état (broker, tcpServer, config) dans une fermeture.
   - S’appuie sur TES helpers, légèrement adaptés pour retourner l’état.
   - API publique sans argument : start(), stop(), reload(), status().
-------------------------------------------------------------------------------------------------- */

function createMqttBroker_Broker() {
    /* État privé (capturé par fermeture) */
    let broker: AedesInstanceBroker_Type | null = null;   /* Instance Aedes */
    let tcpServer: NetServer | null = null;               /* Serveur TCP */
    let config: MqttConfigBrocker_Type | null = null;     /* Config courante */

    /* Chargement initial de la configuration (pas de start auto) */
    config = loadConfig_Broker();

    function status(): StatusBroker_Type {
        return status_Broker(broker, tcpServer, config);
    }

    function start(): void {
        const res = start_Broker(broker, tcpServer, config);
        if (res) {
            broker = res.broker ?? broker;
            tcpServer = res.tcpServer ?? tcpServer;
            config = res.config ?? config; /* au cas où start recharge la config */
        }
    }

    async function stop(): Promise<void> {
        const res = await stop_Broker(broker, tcpServer);
        /* Les helpers arrêtent réellement; on remet l’état local à jour */
        broker = res.broker;
        tcpServer = res.tcpServer;
        /* config non touchée */
    }

    async function reload(): Promise<void> {
        const res = await reload_Broker(broker, tcpServer, config);
        broker = res.broker;
        tcpServer = res.tcpServer;
        if (res.config) config = res.config;
    }


    return {
        start,
        stop,
        reload,
        status
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
