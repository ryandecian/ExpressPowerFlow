/* Import MQTT Client */
import mqtt from "mqtt";

/* Paramètres de connexion (vers ton propre broker Express) */
const MQTT_URL = "mqtt://localhost:1883";
const MQTT_USER = "express_server";  // un compte spécifique à ton API
const MQTT_PASS = "super_secure_password";

/* Connexion du client interne */
const mqttExpress_MQTT = mqtt.connect(MQTT_URL, {
    username: MQTT_USER,
    password: MQTT_PASS,
});

/* Log de connexion */
mqttExpress_MQTT.on("connect", () => {
    console.log("[MQTT][Client] Connecté au broker local");

    // Abonnement aux topics Shelly 3EM
    mqttExpress_MQTT.subscribe("shellies/+/emeter/+/+", (err) => {
        if (err) {
            console.error("[MQTT][Client] Erreur d'abonnement :", err);
        } else {
            console.log("[MQTT][Client] Abonné à shellies/+/emeter/+/+");
        }
    });
});

/* Réception des messages */
mqttExpress_MQTT.on("message", (topic, payload) => {
    try {
        const data = payload.toString();
        console.log(`[MQTT][Client] Message reçu sur ${topic} :`, data);
        // TODO: parser et stocker en base
    } catch (err) {
        console.error("[MQTT][Client] Erreur de traitement :", err);
    }
});

export { mqttExpress_MQTT };
