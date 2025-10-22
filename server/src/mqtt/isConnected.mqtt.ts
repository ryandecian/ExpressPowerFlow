/* Import des Types : */
import type { MqttClientStatus_Type } from "../types/mqtt/mqttClientStatus.type.js";

function isConnected_MQTT(status: MqttClientStatus_Type): boolean {
    return status.connected;
}

export { isConnected_MQTT };

/* ============================================================================
   🧠 Documentation : isConnected_MQTT
   ----------------------------------------------------------------------------
   Nom du composant : isConnected_MQTT
   Rôle :
       - Cette fonction permet de vérifier l’état de connexion actuel
         du client MQTT à partir de son objet de statut.
       - Elle offre un moyen simple et centralisé de savoir si le client
         est bien connecté au broker avant d’exécuter certaines actions
         (ex : publication ou souscription sécurisée).

   Paramètres :
       - status (MqttClientStatus_Type)
           → Objet décrivant l’état courant du client MQTT.
             Il contient notamment la propriété :
                 connected: boolean  → True si connecté, False sinon.

   Retour :
       - (boolean)
           → Retourne true si le client MQTT est connecté au broker,
             sinon false.

   Utilisation typique :
       if (isConnected_MQTT(status)) {
           console.log("Le client est bien connecté au broker MQTT ✅");
       } else {
           console.warn("Le client n'est pas connecté au broker ⚠️");
       }

   Avantages :
       ✅ Centralise la logique de vérification de connexion
       ✅ Améliore la lisibilité du code dans le service principal
       ✅ Simplifie les conditions avant les actions sensibles (publish, subscribe)

   À savoir :
       - Cette fonction ne modifie pas l’état du client, elle ne fait
         qu’en lire la valeur.
       - Si tu veux vérifier la présence du client **et** son état connecté,
         tu peux la combiner avec ensureClient_MQTT().

   ========================================================================= */
