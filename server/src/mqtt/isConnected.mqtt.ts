/* Import des Types : */
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function isConnected_MQTT(status: MqttClientStatus_Type): boolean {
    return status.connected;
}

export { isConnected_MQTT };
