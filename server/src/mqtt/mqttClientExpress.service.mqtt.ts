/* Import des Composants */
import { clientOptions_MQTT } from "./mqttClientExpress.config.mqtt.js";
import { init_MQTT } from "./init.mqtt.js";
import { isConnected_MQTT } from "./isConnected.mqtt.js";
import { getStatus_MQTT } from "./getStatus.mqtt.js";
import { ensureClient_MQTT } from "./ensureClient.mqtt.js";

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
init_MQTT(client, status, MQTT_URL);

/* ============================ Accesseurs simples ============================ */
isConnected_MQTT(status);

getStatus_MQTT(status);

/*
    - Cette fonction agit comme une "garde" (guard function) afin de
      vérifier que le client MQTT a bien été initialisé avant d’exécuter
      toute opération (ex : subscribe, publish, etc.).
    - Elle évite les erreurs classiques du type :
      "Cannot read properties of null (reading 'subscribe')"
      lorsque le client n’a pas encore été créé par la fonction init().
*/
ensureClient_MQTT(client);

/* ============================== subscribe() ================================= */
/**
 * S'abonne à un topic MQTT avec un QoS optionnel (0, 1 ou 2).
 * - topic : chaîne non vide (ex: "shelly/+/status")
 * - qos   : 0 par défaut, 1 ou 2 si besoin (à éviter tant qu'on apprend)
 */
function subscribe(topic: string, qos: 0 | 1 | 2 = 0): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
            reject(new Error("[MQTT-CLIENT] subscribe(): topic invalide."));
            return;
        }

        const cli = ensureClient();

        cli.subscribe(topic, { qos }, (err, granted) => {
            if (err) {
                logError(`subscribe("${topic}") a échoué: ${err.message}`);
                reject(err);
                return;
            }
            const g = granted?.map(g => `${g.topic}(qos=${g.qos})`).join(", ") ?? "—";
            logInfo(`Abonné: ${g}`);
            resolve();
        });
    });
}

/* =============================== publish() ================================== */
/**
 * Publie un message sur un topic.
 * - payload peut être string ou Buffer (évite les gros objets pour l'instant).
 * - options.qos: 0 par défaut; options.retain: false par défaut.
 */
function publish(
    topic: string,
    payload: string | Buffer,
    options?: { qos?: 0 | 1 | 2; retain?: boolean }
): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
            reject(new Error("[MQTT-CLIENT] publish(): topic invalide."));
            return;
        }
        if (payload === undefined || payload === null) {
            reject(new Error("[MQTT-CLIENT] publish(): payload manquant."));
            return;
        }

        const cli = ensureClient();
        const qos = options?.qos ?? 0;
        const retain = options?.retain ?? false;

        cli.publish(topic, payload, { qos, retain }, (err) => {
            if (err) {
                logError(`publish("${topic}") a échoué: ${err.message}`);
                reject(err);
                return;
            }
            logInfo(`Publié → ${topic} (qos=${qos}, retain=${retain})`);
            resolve();
        });
    });
}

export const mqttClientExpress_Service = {
    init_MQTT,
    isConnected_MQTT,
    getStatus_MQTT,
    subscribe,
    publish,
    /* Bientôt : setMessageHandler (Étape C) */
};


/* =========================================================================
   Composant : mqttClientExpress.service.mqtt.ts
   Rôle : Client MQTT interne à Express
   - Se connecte au broker MQTT local (Aedes intégré)
   - Sert d’interface pour publier, s’abonner et recevoir des messages
   - Agira comme un pont entre MQTT et les controllers Express
   ========================================================================== */
