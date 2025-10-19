/* Import des Composants */
import { stop_Broker } from "./stop.broker.js";
import { start_Broker } from "./start.broker.js";

/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";

function reload_Broker(
    broker: AedesInstanceBroker_Type | null,
    tcpServer: NetServer | null = null,
    config: MqttConfigBrocker_Type | null,
    configPath: string
): void {
    stop_Broker(broker, tcpServer);
    setTimeout(() => start_Broker(broker, tcpServer, config, configPath), 250);
}

export { reload_Broker };

/**
 * Fonction utilitaire permettant de redémarrer proprement le broker MQTT embarqué.
 *
 * Objectif :
 * ----------
 * Cette fonction combine les appels à `stop_Broker()` et `start_Broker()` afin d’effectuer
 * un redémarrage contrôlé du service MQTT (Aedes + serveur TCP).  
 * Elle est utile lors d’une mise à jour de configuration (`mqtt.config.json`) ou d’un
 * rechargement manuel du broker sans redémarrer toute l’application ExpressPowerFlow.
 *
 * Détails :
 * ---------
 * - Appelle `stop_Broker()` pour fermer toutes les connexions et libérer les ressources réseau.
 * - Attend 250 ms avant de relancer le broker via `start_Broker()` afin d’assurer que
 *   le port TCP soit complètement libéré par le système d’exploitation.
 * - Les mêmes instances (`broker`, `tcpServer`, `config`) sont réutilisées lors du redémarrage.
 *
 * Bonnes pratiques :
 * ------------------
 * - La temporisation de 250 ms constitue une valeur de sécurité suffisante pour la majorité
 *   des environnements Node.js/Docker, évitant les conflits de port ("EADDRINUSE").
 * - Cette fonction est non bloquante : le redémarrage s’effectue de manière asynchrone.
 * - À utiliser avec précaution dans les environnements de production (préférer un arrêt complet
 *   suivi d’un redémarrage manuel lors des mises à jour critiques).
 *
 * Exemple d’utilisation :
 * -----------------------
 * ```ts
 * import { reload_Broker } from "../utils/reload_Broker.js";
 *
 * // Redémarrage manuel après modification du fichier de config :
 * reload_Broker(brokerInstance, tcpServerInstance, config, "./config/mqtt.config.json");
 * // [MQTT] Arrêt du broker…
 * // [MQTT] Broker arrêté.
 * // [MQTT] Broker embarqué en écoute sur :1883
 * ```
 *
 * Sécurité et supervision :
 * -------------------------
 * - Peut être appelée depuis une API interne (`/mqtt/reload`) ou une commande CLI dédiée.
 * - Garantit que le redémarrage du service n’interrompt pas brutalement les processus Node.js.
 * - Les erreurs éventuelles de redémarrage seront loguées par `start_Broker()`.
 *
 * @param broker - Instance actuelle du broker Aedes à redémarrer, ou `null` si non initialisée.
 * @param tcpServer - Serveur TCP associé au broker, ou `null` par défaut.
 * @param config - Configuration actuelle du broker (optionnelle au rechargement).
 * @param configPath - Chemin vers le fichier JSON de configuration du broker MQTT.
 * @returns Rien (`void`) – exécute un redémarrage asynchrone du service MQTT.
 */
