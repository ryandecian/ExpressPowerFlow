/* Import des Types : */
import { MqttClient } from "mqtt";

function ensureClient_MQTT(client: MqttClient | null): MqttClient {
    if (!client) {
        throw new Error("[MQTT-CLIENT] Client non initialisé. Appelle init() avant subscribe/publish.");
    }
    return client;
}

export { ensureClient_MQTT };

/* ============================================================================
   🧠 Documentation : ensureClient_MQTT
   ----------------------------------------------------------------------------
   Nom du composant : ensureClient_MQTT
   Rôle :
       - Cette fonction agit comme une "garde" (guard function) afin de
         vérifier que le client MQTT a bien été initialisé avant d’exécuter
         toute opération (ex : subscribe, publish, etc.).
       - Elle évite les erreurs classiques du type :
           "Cannot read properties of null (reading 'subscribe')"
         lorsque le client n’a pas encore été créé par la fonction init().

   Paramètres :
       - client (MqttClient | null)
           → Instance potentielle du client MQTT. Si null ou undefined,
             cela signifie que la connexion n’a pas encore été établie.

   Retour :
       - (MqttClient)
           → Retourne directement le client MQTT, mais garanti comme
             étant non nul et donc utilisable immédiatement dans le reste du code.

   Exceptions :
       - Lance une erreur explicite si le client est null :
         "[MQTT-CLIENT] Client non initialisé. Appelle init() avant subscribe/publish."

   Utilisation typique :
       const cli = ensureClient_MQTT(client);
       cli.publish("topic/test", "message");

   Avantages :
       ✅ Sécurise les appels vers le client MQTT
       ✅ Facilite la maintenance (vérification centralisée)
       ✅ Améliore la lisibilité du code (évite les if répétés)

   À savoir :
       - Cette fonction ne vérifie **pas** si le client est connecté au broker.
         Elle vérifie uniquement s’il a été créé (init()).
       - Pour vérifier la connexion active, il est possible d’ajouter plus tard
         une variante comme ensureClientReady_MQTT().

   ========================================================================= */
