/* Import des Composants */
import { ensureClient_MQTT } from "./ensureClient.mqtt.js";

/* Import des Logs : */
import { logInfo, logError } from "../log/mqtt/logMqtt.log.js";

/* Import des Types : */
import { MqttClient } from "mqtt";

function publish_MQTT(
    client: MqttClient,
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

        const cli = ensureClient_MQTT(client);
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

export { publish_MQTT };
