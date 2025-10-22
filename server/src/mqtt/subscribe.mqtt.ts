/* Import des Composants */
import { ensureClient_MQTT } from "./ensureClient.mqtt.js";

/* Import des Logs : */
import { logInfo, logError } from "../log/mqtt/logMqtt.log.js";

/* Import des Types : */
import { MqttClient } from "mqtt";

function subscribe_MQTT(
    client: MqttClient,
    topic: string,
    qos: 0 | 1 | 2 = 0
): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
            reject(new Error("[MQTT-CLIENT] subscribe(): topic invalide."));
            return;
        }

        const cli = ensureClient_MQTT(client);

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

export { subscribe_MQTT };
