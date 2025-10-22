import { log } from "console";

function logInfo(msg: string): void {
    console.log(`[MQTT-CLIENT] ${msg}`);
}
export { logInfo };

function logWarn(msg: string): void {
    console.warn(`[MQTT-CLIENT] ${msg}`);
}
export { logWarn };

function logError(msg: string): void {
    console.error(`[MQTT-CLIENT] ${msg}`);
}
export { logError };
