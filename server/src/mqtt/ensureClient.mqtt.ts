/* Import des Types : */
import { MqttClient } from "mqtt";

function ensureClient_MQTT(client: MqttClient | null): MqttClient {
    if (!client) {
        throw new Error("[MQTT-CLIENT] Client non initialisé. Appelle init() avant subscribe/publish.");
    }
    return client;
}

export { ensureClient_MQTT };
