/* Import des Composants */
import { ensureClient_MQTT } from "./ensureClient.mqtt.js";

/* Import des Types */
import type { MqttClient } from "mqtt";

/**
 * Enregistre un unique handler pour l'événement "message".
 * - Remplace tout handler précédent (évite les doublons).
 * - Le payload reçu est un Buffer (brut), tu choisis quoi en faire (toString(), JSON.parse, etc.).
 */
function setMessageHandler_MQTT(
    client: MqttClient,
    handler: (topic: string, payload: Buffer) => void
): void {
    const cli = ensureClient_MQTT(client);

    // On enlève d'abord tout handler existant pour éviter les handlers multiples
    cli.removeAllListeners("message");

    // Puis on enregistre le nouveau
    cli.on("message", (topic, payload) => {
        try {
            handler(topic, payload);
        } catch (err) {
            // Ne JAMAIS faire throw dans un event handler → on log et on continue
            // (tu as déjà un logger dédié ; j'évite de l'importer ici pour laisser l'utilitaire pur)
            console.error(`[MQTT-CLIENT] Handler 'message' a levé une erreur: ${(err as Error)?.message}`);
        }
    });
}

/**
 * Optionnel : supprime tout handler "message" (nettoyage propre).
 */
function clearMessageHandler_MQTT(client: MqttClient): void {
    const cli = ensureClient_MQTT(client);
    cli.removeAllListeners("message");
}

export { setMessageHandler_MQTT, clearMessageHandler_MQTT };
