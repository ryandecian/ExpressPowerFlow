/* Import des Config : */
import { ENV_SAFE } from "../config/ENV.config.js";

/* Import des Types : */
import type { IClientOptions } from "mqtt";

const MQTT_USER_EXPRESSPOWERFLOW = ENV_SAFE("MQTT_USER_EXPRESSPOWERFLOW");
const MQTT_PASSWORD_EXPRESSPOWERFLOW = ENV_SAFE("MQTT_PASSWORD_EXPRESSPOWERFLOW");

const clientOptions_MQTT: IClientOptions = {
    username: MQTT_USER_EXPRESSPOWERFLOW,           /* Identifiant du client MQTT */
    password: MQTT_PASSWORD_EXPRESSPOWERFLOW,       /* Mot de passe d’authentification */
    clean: true,                   /* Session non persistante */
    reconnectPeriod: 1000,         /* Tente de se reconnecter toutes les 1 seconde */
    connectTimeout: 10_000,        /* Délai maximum pour établir la connexion (10s) */
    keepalive: 30,                 /* Ping toutes les 30 secondes */
    clientId: `epf-client-${Math.random().toString(16).slice(2)}`, /* Identifiant unique */
};

export { clientOptions_MQTT };
