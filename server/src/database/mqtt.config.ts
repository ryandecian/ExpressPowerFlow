/* Configuration du broker MQTT embarqué (Express = broker) */
const mqttConfig = {
    "enabled": true, /* Active/désactive le broker intégré (true = on, false = off) */
    "port": 1883, /* Port TCP d’écoute (1883 = MQTT sans TLS) */
    "clientsMax": 50, /* Nombre max de clients MQTT simultanés autorisés */
    /* Liste des comptes autorisés à s’authentifier sur le broker */
    "users": [
        {                                      
            "username": "shelly_3em_user",         /* Identifiant MQTT à renseigner dans l’interface du Shelly 3EM */
            "password": "Tv4rbSA6odtQE62ce4VZ"     /* Mot de passe MQTT du compteur Shelly 3EM */
        },
        {                                      
            "username": "zendure_solarflow_2400ac_user",         /* Identifiant MQTT à renseigner dans l’interface du Zendure */
            "password": "zendure_pw"     /* Mot de passe MQTT de la batterie Solarflow 2400AC */
        },
        {                                      
            "username": "express_power_flow",         /* Identifiant utilisé par ton client interne Express */
            "password": "super_secure_password"     /* Mot de passe MQTT du serveur Express */
        }
    ],
    /* ACL = Access Control List (droits de publish/subscribe par user) */
    "acl": [
        /* Shelly 3EM : publie uniquement ses mesures/états */
        {
            "username": "shelly_3em_user",
            "publish": [
                "shellies/+/emeter/+/+", /* Mesures (power, voltage, current, total…) */
                "shellies/+/online", /* État de présence */
                "shellies/+/announce" /* Message d’annonce Shelly */
            ],
            "subscribe": [] /* Le Shelly n’écoute rien */
        },
        /* Express : s’abonne aux messages du Shelly */
        {
            username: "express_power_flow",
            publish: [], /* Express ne publie rien pour l’instant */
            subscribe: [
                "shellies/+/emeter/+/+", /* Toutes les mesures 3EM */
                "shellies/+/online", /* États de présence */
                "shellies/+/announce" /* Messages d’annonce */
            ]
        }
    ]
};

export { mqttConfig };
