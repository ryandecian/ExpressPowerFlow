/* Import des Types : */
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function getStatus_MQTT(status: MqttClientStatus_Type): Readonly<MqttClientStatus_Type> {
    return status;
}

export { getStatus_MQTT };

/* ============================================================================
   🧠 Documentation : getStatus_MQTT
   ----------------------------------------------------------------------------
   Nom du composant : getStatus_MQTT
   Rôle :
       - Cette fonction retourne l’état complet du client MQTT
         sous une forme en lecture seule (immutable).
       - Elle permet à d’autres parties du code (contrôleurs, middlewares, etc.)
         de consulter l’état actuel du client MQTT sans risquer
         de le modifier accidentellement.

   Paramètres :
       - status (MqttClientStatus_Type)
           → Objet représentant l’état interne du client MQTT.
             Contient plusieurs propriétés clés :
                 connected: boolean
                 reconnecting: boolean
                 lastError?: string
                 url: string
                 clientId: string

   Retour :
       - (Readonly<MqttClientStatus_Type>)
           → Retourne l’objet status complet, protégé contre toute modification.
             Toute tentative d’écriture lèvera une erreur en mode strict.

   Utilisation typique :
       const currentStatus = getStatus_MQTT(status);
       console.log(currentStatus.connected); // → true / false

   Avantages :
       ✅ Fournit un accès sûr et transparent à l’état MQTT
       ✅ Empêche toute modification non voulue de l’état interne
       ✅ Facilite la lecture des informations dans le reste du code (logs, debug, API)

   À savoir :
       - Cette fonction ne crée pas de copie ; elle renvoie une référence
         protégée (en lecture seule) de l’objet status actuel.
       - Elle n’effectue aucune opération asynchrone : lecture instantanée.

   ========================================================================= */
