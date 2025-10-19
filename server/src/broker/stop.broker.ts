/* Import des dépendances : */
import { Server as NetServer } from "node:net";

/* Import des Types : */
import type { AedesInstanceBroker_Type } from "../types/broker/aedesInstanceBroker.type.js";

function stop_Broker(
    broker: AedesInstanceBroker_Type | null,
    tcpServer: NetServer | null = null
): Promise<{ broker: null; tcpServer: null }> {
    if (!broker && !tcpServer) {
        return Promise.resolve({ broker: null, tcpServer: null });
    }

    console.log("[MQTT] Arrêt du broker…");
    const tasks: Array<Promise<void>> = [];

    if (tcpServer) {
        const s = tcpServer;
        tasks.push(new Promise<void>((resolve) => s.close(() => resolve())));
    }

    if (broker) {
        const b = broker;
        tasks.push(new Promise<void>((resolve) => b.close(() => resolve())));
    }

    return Promise.all(tasks)
        .then(() => {
            console.log("[MQTT] Broker arrêté.");
            return { broker: null, tcpServer: null };
        })
        .catch(() => {
            /* On force malgré tout la remise à zéro locale */
            return { broker: null, tcpServer: null };
        });
}

export { stop_Broker };


/**
 * Fonction utilitaire permettant d’arrêter proprement le broker MQTT embarqué (Aedes)
 * ainsi que son serveur TCP associé.
 *
 * Objectif :
 * ----------
 * Cette fonction assure la fermeture ordonnée de toutes les ressources réseau liées
 * au broker MQTT, sans interruption brutale du processus Node. Elle s’assure que
 * les connexions en cours soient correctement terminées avant de libérer la mémoire.
 *
 * Détails :
 * ---------
 * - Si le broker ou le serveur TCP ne sont pas initialisés (`null`), la fonction
 *   ne fait rien et retourne immédiatement.
 * - Ferme successivement :
 *   1. Le serveur TCP (`NetServer`) via sa méthode `close()`.
 *   2. L’instance du broker Aedes via sa méthode `close()`.
 * - Les deux opérations sont gérées de manière asynchrone via `Promise.all()`
 *   afin d’attendre la fin des fermetures avant de loguer l’arrêt complet.
 *
 * Bonnes pratiques :
 * ------------------
 * - L’utilisation d’un tableau `tasks` permet d’assurer que toutes les ressources
 *   soient correctement libérées, même si l’une d’entre elles est absente.
 * - L’appel de `Promise.all(...).finally()` garantit que le log "[MQTT] Broker arrêté."
 *   est toujours exécuté, même en cas d’erreur durant la fermeture.
 * - Les variables `broker` et `tcpServer` sont explicitement réinitialisées à `null`
 *   pour éviter toute réutilisation involontaire après arrêt.
 *
 * Exemple d’utilisation :
 * -----------------------
 * ```ts
 * import { stop_Broker } from "../utils/stop_Broker.js";
 *
 * // Exemple : arrêt manuel du service MQTT
 * stop_Broker(brokerInstance, tcpServerInstance);
 * // [MQTT] Arrêt du broker…
 * // [MQTT] Broker arrêté.
 * ```
 *
 * Sécurité et fiabilité :
 * -----------------------
 * - Cette méthode ne lève pas d’exception : elle encapsule la fermeture dans des promesses
 *   silencieuses pour éviter d’interrompre le processus principal.
 * - Elle peut être appelée depuis un gestionnaire de signal (`SIGINT` ou `SIGTERM`)
 *   pour effectuer un arrêt propre du service avant extinction du conteneur Docker.
 *
 * @param broker - Instance active du broker Aedes à arrêter, ou `null` si non initialisée.
 * @param tcpServer - Serveur TCP associé au broker, ou `null` par défaut.
 * @returns Rien (`void`) – la fonction agit par effet de bord (arrêt des processus en cours).
 */
