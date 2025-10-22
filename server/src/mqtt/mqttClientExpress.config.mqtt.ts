/* Import des Types : */
import type { IClientOptions } from "mqtt";

const MQTT_USER = process.env.MQTT_USER ?? "express_power_flow";
const MQTT_PASSWORD = process.env.MQTT_PASSWORD ?? "super_secure_password";

const clientOptions_MQTT: IClientOptions = {
    username: MQTT_USER,           /* Identifiant du client MQTT */
    password: MQTT_PASSWORD,       /* Mot de passe d’authentification */
    clean: true,                   /* Session non persistante */
    reconnectPeriod: 1000,         /* Tente de se reconnecter toutes les 1 seconde */
    connectTimeout: 10_000,        /* Délai maximum pour établir la connexion (10s) */
    keepalive: 30,                 /* Ping toutes les 30 secondes */
    clientId: `epf-client-${Math.random().toString(16).slice(2)}`, /* Identifiant unique */
};

export { clientOptions_MQTT };
