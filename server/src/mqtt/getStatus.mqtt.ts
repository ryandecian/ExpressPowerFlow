/* Import des Types : */
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function getStatus_MQTT(status: MqttClientStatus_Type): Readonly<MqttClientStatus_Type> {
    return status;
}

export { getStatus_MQTT };
