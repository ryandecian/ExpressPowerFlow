/* Import des dépendances : */
import fs from "node:fs";
import path from "node:path";

/* Import des Types : */
import type { MqttConfigBrocker_Type } from "../types/broker/mqttConfigBroker.type.js";

function loadConfig_Broker(configPath: string): MqttConfigBrocker_Type {
    const p = path.resolve(configPath);
    const raw = fs.readFileSync(p, "utf-8");
    const json: MqttConfigBrocker_Type = JSON.parse(raw);
    json.clientsMax = json.clientsMax ?? 50;

    return (
        json
    );
}

export { loadConfig_Broker };

/**
 * Fonction utilitaire chargée de lire et de parser le fichier de configuration MQTT du broker.
 *
 * Objectif :
 * ----------
 * Cette fonction permet de centraliser le chargement des paramètres de configuration du broker MQTT
 * (port d’écoute, utilisateurs autorisés, règles ACL, nombre maximum de clients, etc.)
 * à partir d’un fichier JSON local. Elle garantit également la présence d’une valeur par défaut
 * pour la propriété `clientsMax` si celle-ci est absente.
 *
 * Détails :
 * ---------
 * - `configPath` : chemin absolu ou relatif vers le fichier de configuration JSON.
 * - Utilise le module `fs` pour la lecture synchrone du fichier,
 *   et `path.resolve()` pour obtenir un chemin absolu compatible sur toutes les plateformes.
 * - Parse le contenu du fichier JSON en objet typé selon `MqttConfigBrocker_Type`.
 * - Définit `clientsMax` à `50` par défaut si la valeur n’est pas renseignée.
 *
 * Exemple d’utilisation :
 * -----------------------
 * ```ts
 * import { loadConfig_Broker } from "../utils/loadConfig_Broker.js";
 *
 * const config = loadConfig_Broker("./config/mqtt.config.json");
 * console.log(config.port); // Affiche le port configuré du broker
 * ```
 *
 * Sécurité :
 * ----------
 * - Cette fonction ne valide pas le schéma JSON (aucune vérification de structure ou de types).
 *   Il est recommandé d’ajouter une validation via un outil comme Zod pour les environnements critiques.
 * - Le chargement se fait en lecture synchrone (`readFileSync`) car il est exécuté
 *   une seule fois au démarrage du broker, garantissant ainsi la cohérence du chargement.
 *
 * @param configPath - Chemin du fichier de configuration JSON du broker MQTT.
 * @returns Un objet `MqttConfigBrocker_Type` contenant la configuration courante du broker.
 */