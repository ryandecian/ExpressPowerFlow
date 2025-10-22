/* Import des Composants */
import { clientOptions_MQTT } from "./mqttClientExpress.config.mqtt.js";
import { init_MQTT } from "./init.mqtt.js";
import { subscribe_MQTT } from "./subscribe.mqtt.js";
import { publish_MQTT } from "./publish.mqtt.js";
import { ensureClient_MQTT } from "./ensureClient.mqtt.js";
import { isConnected_MQTT } from "./isConnected.mqtt.js";
import { getStatus_MQTT } from "./getStatus.mqtt.js";

/* Import des Logs */
import { logInfo, logWarn } from "../log/mqtt/logMqtt.log.js";

/* Import des Types */
import { MqttClient } from "mqtt";
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

/* =============================== Configuration ============================== */
/**
 * Adresse du broker MQTT local par défaut.
 * En production, cette valeur sera remplacée via une variable d’environnement.
*/
const MQTT_URL = process.env.MQTT_URL ?? "mqtt://localhost:1883";

/* ============================ Variables internes ============================ */
let client: MqttClient | null = null;   /* Instance active du client MQTT */
let status: MqttClientStatus_Type = {
    connected: false,
    reconnecting: false,
    lastError: undefined,
    url: MQTT_URL,
    clientId: String(clientOptions_MQTT.clientId),
};

/* ================================ init() ==================================== */
/**
 * Initialise la connexion MQTT interne d’Express.
 * - Établit la connexion avec le broker local (Aedes)
 * - Met à jour la référence du client interne
 * - Attache les événements de base (connect, reconnect, close, error…)
*/
function init(): void {
    client = init_MQTT(client, status, MQTT_URL);
    logInfo("Initialisation MQTT interne terminée.");
}

/* ================================ subscribe() =============================== */
/**
 * Abonne le client interne à un topic MQTT donné.
 * - Vérifie d’abord que le client est bien initialisé
 * - Délègue ensuite la souscription à subscribe_MQTT()
*/
function subscribe(topic: string, qos: 0 | 1 | 2 = 0): Promise<void> {
    const cli = ensureClient_MQTT(client);
    return subscribe_MQTT(cli, topic, qos);
}

/* ================================= publish() ================================ */
/**
 * Publie un message sur un topic MQTT.
 * - Vérifie d’abord que le client est bien initialisé
 * - Délègue ensuite la publication à publish_MQTT()
*/
function publish(
    topic: string,
    payload: string | Buffer,
    options?: { qos?: 0 | 1 | 2; retain?: boolean }
): Promise<void> {
    const cli = ensureClient_MQTT(client);
    return publish_MQTT(cli, topic, payload, options);
}

/* ================================ isConnected() ============================= */
/**
 * Vérifie si le client MQTT est actuellement connecté au broker.
*/
function isConnected(): boolean {
    return isConnected_MQTT(status);
}

/* ================================ getStatus() =============================== */
/**
 * Retourne l’état complet du client MQTT sous forme immuable.
*/
function getStatus(): Readonly<MqttClientStatus_Type> {
    return getStatus_MQTT(status);
}

/* ============================== API publique ================================ */
export const mqttClientExpress_Service = {
    init,
    subscribe,
    publish,
    isConnected,
    getStatus,
    /* Étape suivante : setMessageHandler (réception des messages) */
};

/* =========================================================================
   Composant : mqttClientExpress.service.mqtt.ts
   Rôle : Client MQTT interne à Express (façade principale)
   -------------------------------------------------------------------------
   - Centralise la gestion du client MQTT intégré à Express
   - Délègue les actions de bas niveau aux composants spécialisés :
       → init_MQTT()          : initialise la connexion
       → subscribe_MQTT()     : gère les abonnements
       → publish_MQTT()       : gère les publications
       → ensureClient_MQTT()  : valide la présence du client
       → isConnected_MQTT()   : indique si connecté
       → getStatus_MQTT()     : retourne l’état complet
   - Sert de pont entre MQTT et les controllers Express
   ========================================================================== */
