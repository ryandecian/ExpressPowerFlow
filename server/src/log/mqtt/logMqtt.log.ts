import { log } from "console";

function logInfo(msg: string): void {
    console.log(`[MQTT] ${msg}`);
}
export { logInfo };

function logWarn(msg: string): void {
    console.warn(`[MQTT] ${msg}`);
}
export { logWarn };

function logError(msg: string): void {
    console.error(`[MQTT] ${msg}`);
}
export { logError };
