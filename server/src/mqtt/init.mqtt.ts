/* Import des Composants */
import { clientOptions_MQTT } from "./mqttClientExpress.config.mqtt.js";

/* Import des Logs : */
import { logInfo, logWarn, logError } from "../log/mqtt/logMqtt.log.js";

/* Import des Types : */
import mqtt, { MqttClient } from "mqtt";
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function init_MQTT(
    client: MqttClient | null = null, 
    status: MqttClientStatus_Type,
    MQTT_URL: string,
): void {
    if (client) {
        logWarn("init() appelé mais le client est déjà initialisé.");
        return;
    }

    logInfo(`Connexion au broker: ${MQTT_URL} (clientId=${status.clientId})`);
    client = mqtt.connect(MQTT_URL, clientOptions_MQTT);

    client.on("connect", () => {
        status.connected = true;
        status.reconnecting = false;
        status.lastError = undefined;
        logInfo("Connecté ✅");
    });

    client.on("reconnect", () => {
        status.reconnecting = true;
        logWarn("Tentative de reconnexion…");
    });

    client.on("close", () => {
        status.connected = false;
        logWarn("Connexion fermée.");
    });

    client.on("offline", () => {
        status.connected = false;
        logWarn("Client offline.");
    });

    client.on("error", (err) => {
        status.connected = false;
        status.lastError = err?.message ?? "Unknown MQTT error";
        logError(`Erreur: ${status.lastError}`);
    });
}

export { init_MQTT };
