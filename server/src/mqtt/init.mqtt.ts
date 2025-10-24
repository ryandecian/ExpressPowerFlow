/* Import des Composants */
import { mqttConfig } from "../config/mqtt.config.js";

/* Import des Logs : */
import { logInfo, logWarn, logError } from "../log/mqtt/logMqtt.log.js";

/* Import des Types : */
import mqtt, { MqttClient } from "mqtt";
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function init_MQTT(
    currentClient: MqttClient | null,
    status: MqttClientStatus_Type,
    MQTT_URL: string,
): MqttClient {
    if (currentClient) {
        logWarn("init() appelé mais le client est déjà initialisé.");
        return currentClient;
    }

    logInfo(`Connexion au broker: ${MQTT_URL} (clientId=${status.clientId})`);
    const cli = mqtt.connect(MQTT_URL, mqttConfig);

    cli.on("connect", () => {
        status.connected = true;
        status.reconnecting = false;
        status.lastError = undefined;
        logInfo("MQTT Express connecté ✅");
    });

    cli.on("reconnect", () => {
        status.reconnecting = true;
        logWarn("Tentative de reconnexion…");
    });

    cli.on("close", () => {
        status.connected = false;
        logWarn("Connexion fermée.");
    });

    cli.on("offline", () => {
        status.connected = false;
        logWarn("Client offline.");
    });

    cli.on("error", (err) => {
        status.connected = false;
        status.lastError = err?.message ?? "Unknown MQTT error";
        logError(`Erreur: ${status.lastError}`);
    });

    return cli;
}

export { init_MQTT };
