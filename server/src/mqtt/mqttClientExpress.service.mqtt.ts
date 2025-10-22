/* Import des Composants */
import { clientOptions_MQTT } from "./mqttClientExpress.config.mqtt.js";

/* Import des Types : */
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

/* =============================== Configuration ============================== */
/**
 * Ces valeurs seront extraites d'un fichier .env ou d'une config centralisée.
 * Pour le moment on met des valeurs par défaut.
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

/* ============================= Fonctions internes =========================== */
/**
 * Ici viendront :
 * - init() : établir la connexion et initialiser les events
 * - subscribe() / publish() : gérer les interactions MQTT
 * - onMessage() : intercepter les messages reçus
 * - getStatus() : retourner l’état du client
*/

/* ============================== API publique ================================ */
export const mqttClientExpress_Service = {
    /* fonctions exportées viendront ici */
};

/* =========================================================================
   Composant : mqttClientExpress.service.mqtt.ts
   Rôle : Client MQTT interne à Express
   - Se connecte au broker MQTT local (Aedes intégré)
   - Sert d’interface pour publier, s’abonner et recevoir des messages
   - Agira comme un pont entre MQTT et les controllers Express
   ========================================================================== */