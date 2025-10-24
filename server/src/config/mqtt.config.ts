/* Import des Config : */
import { ENV_SAFE } from "./ENV.config.js";

/* Import des Types : */
import type { IClientOptions } from "mqtt";

const mqttConfig: IClientOptions = {
    username: ENV_SAFE("MQTT_USER_EXPRESSPOWERFLOW"),           /* Identifiant du client MQTT */
    password: ENV_SAFE("MQTT_PASSWORD_EXPRESSPOWERFLOW"),       /* Mot de passe d’authentification */
    clean: true,                   /* Session non persistante */
    reconnectPeriod: 1000,         /* Tente de se reconnecter toutes les 1 seconde */
    connectTimeout: 10_000,        /* Délai maximum pour établir la connexion (10s) */
    keepalive: 30,                 /* Ping toutes les 30 secondes */
    clientId: `${ENV_SAFE("MQTT_USER_EXPRESSPOWERFLOW")}-${Math.random().toString(16).slice(2)}`, /* Identifiant unique */
};

export { mqttConfig };
