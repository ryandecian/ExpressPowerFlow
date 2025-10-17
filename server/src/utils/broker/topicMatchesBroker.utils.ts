function topicMatchesBroker_Utils(pattern: string, topic: string): boolean {
    const patt = pattern.split("/");
    const top = topic.split("/");

    for (let i = 0; i < patt.length; i++) {
        const p = patt[i];
        const t = top[i];

        if (p === "#") return true;
        if (p === "+") {
            if (t === undefined) return false;
            continue;
        }
        if (t !== p) return false;
    }
    return patt.length === top.length;
}

export { topicMatchesBroker_Utils };

/**
 * @function topicMatchesBroker_Utils
 * @description
 * Vérifie si un **topic MQTT réel** correspond à un **pattern MQTT** comportant
 * des **wildcards** (`+` ou `#`) selon la spécification MQTT standard.
 *
 * Cette fonction est utilisée par le broker (Aedes ici) pour déterminer
 * si un utilisateur a le droit de **publier** ou de **s’abonner**
 * à un certain topic en fonction des règles ACL.
 *
 * ---
 * ### Rappel sur les wildcards MQTT :
 * - `+` : correspond à **un seul niveau** dans la hiérarchie du topic.
 *   - Exemple : `home/+/temperature` correspond à `home/salon/temperature` ou `home/cuisine/temperature`
 *     mais **pas** à `home/salon/capteur/temperature` (trop de niveaux).
 * - `#` : correspond à **tous les niveaux restants** à partir de sa position.
 *   - Exemple : `home/#` correspond à `home/salon`, `home/salon/capteur/temp`, etc.
 * ---
 *
 * @param {string} pattern - Le **pattern MQTT** défini dans l’ACL (peut contenir `+` et `#`).
 * @param {string} topic - Le **topic réel** envoyé par un client MQTT.
 * @returns {boolean} `true` si le topic correspond au pattern, sinon `false`.
 *
 * @example
 * // ✅ Cas valides
 * topicMatchesBroker_Utils("shelly/+/status", "shelly/livingroom/status"); // true
 * topicMatchesBroker_Utils("devices/#", "devices/room1/sensor/temp");      // true
 *
 * // ❌ Cas invalides
 * topicMatchesBroker_Utils("shelly/+/status", "shelly/status");            // false (manque un niveau)
 * topicMatchesBroker_Utils("home/+/temp", "home/salon/capteur/temp");      // false (trop de niveaux)
 */
7