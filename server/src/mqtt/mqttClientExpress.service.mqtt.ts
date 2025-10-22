/* Import des Composants */
import { clientOptions_MQTT } from "./mqttClientExpress.config.mqtt.js";

/* Import des Logs : */
import { logInfo, logWarn, logError } from "../log/mqtt/logMqtt.log.js";

/* Import des Types : */
import mqtt, { MqttClient } from "mqtt";
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

/* =============================== Configuration ============================== */
/**
 * Valeur par défaut en dev ; passera par .env/Docker plus tard.
*/
const MQTT_URL = process.env.MQTT_URL ?? "mqtt://localhost:1883";

/* ============================ Variables internes ============================ */
let client: MqttClient | null = null;   /* Contiendra l'instance MQTT active */
let status: MqttClientStatus_Type = {
    connected: false,
    reconnecting: false,
    lastError: undefined,
    url: MQTT_URL,
    clientId: String(clientOptions_MQTT.clientId),
};

/* ================================ init() ==================================== */
/**
 * Établit la connexion au broker et enregistre les événements de base.
 * Idempotent : si déjà initialisé, ne refait rien.
 */
function init(): void {
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

    /* on("message") viendra à l’étape C */
}

/* ============================ Accesseurs simples ============================ */
function isConnected(): boolean {
    return status.connected;
}
function getStatus(): Readonly<MqttClientStatus_Type> {
    return status;
}

/* ============================== API publique ================================ */
export const mqttClientExpress_Service = {
    init,
    isConnected,
    getStatus,
    /* Bientôt : subscribe, publish, setMessageHandler */
};

/* =========================================================================
   Composant : mqttClientExpress.service.mqtt.ts
   Rôle : Client MQTT interne à Express
   - Se connecte au broker MQTT local (Aedes intégré)
   - Sert d’interface pour publier, s’abonner et recevoir des messages
   - Agira comme un pont entre MQTT et les controllers Express
   ========================================================================== */
