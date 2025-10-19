/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";
import type { StatusBroker_Type } from "../types/broker/statusBroker.type.js";

function status_Broker(
    broker: AedesInstanceBroker_Type | null, 
    tcpServer: NetServer | null = null, 
    config: MqttConfigBrocker_Type | null): StatusBroker_Type {
    return {
        running: !!broker && !!tcpServer,
        port: config?.port ?? null,
        clients: broker?.connectedClients ?? 0,
        enabled: config?.enabled ?? false
    };
}

export { status_Broker };

/**
 * Fonction utilitaire permettant d’obtenir un état synthétique du broker MQTT embarqué.
 *
 * Objectif :
 * ----------
 * Cette fonction centralise la collecte d’informations essentielles sur l’état courant
 * du broker MQTT (Aedes) et de son serveur TCP associé. Elle est utilisée, par exemple,
 * pour alimenter une route de supervision (`/health` ou `/status`) dans ExpressPowerFlow.
 *
 * Détails :
 * ---------
 * - `broker` : instance active du broker Aedes, ou `null` si le service n’a pas encore été démarré.
 * - `tcpServer` : serveur TCP sous-jacent utilisé par Aedes pour accepter les connexions clients.
 *   Il est optionnel (valeur par défaut `null`) afin de simplifier l’appel dans des contextes de test.
 * - `config` : configuration courante du broker (port, statut d’activation, etc.).
 *
 * Retour :
 * --------
 * Un objet résumant l’état courant du service MQTT :
 * - `running` → `true` si le broker et le serveur TCP sont tous deux actifs.
 * - `port` → le numéro de port TCP actuellement utilisé, ou `null` si non défini.
 * - `clients` → nombre total de clients actuellement connectés au broker.
 * - `enabled` → indique si le service MQTT est activé dans la configuration.
 *
 * Exemple d’utilisation :
 * -----------------------
 * ```ts
 * import { status_Broker } from "../utils/status_Broker.js";
 *
 * const state = status_Broker(brokerInstance, tcpServer, config);
 * console.log(state);
 * // Exemple de sortie :
 * // {
 * //     running: true,
 * //     port: 1883,
 * //     clients: 3,
 * //     enabled: true
 * // }
 * ```
 *
 * Sécurité et supervision :
 * -------------------------
 * - Cette fonction ne modifie aucun état interne : elle est pure et sans effet de bord.
 * - Elle peut être appelée régulièrement (par exemple via une tâche CRON ou un endpoint Express)
 *   sans impact sur les performances.
 * - Elle fournit une base fiable pour construire un indicateur de disponibilité du service MQTT.
 *
 * @param broker - Instance courante du broker Aedes ou `null` si non initialisée.
 * @param tcpServer - Serveur TCP associé au broker, ou `null` par défaut.
 * @param config - Configuration MQTT chargée depuis le fichier JSON, ou `null`.
 * @returns Un objet décrivant l’état opérationnel actuel du broker MQTT.
 */
