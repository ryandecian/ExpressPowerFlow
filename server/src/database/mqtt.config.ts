/* Configuration du broker MQTT embarqué (Express = broker) */
const mqttConfig = {
    "enabled": true, /* Active/désactive le broker intégré (true = on, false = off) */
    "port": 1883, /* Port TCP d’écoute (1883 = MQTT sans TLS) */
    "clientsMax": 50, /* Nombre max de clients MQTT simultanés autorisés */
    /* Liste des comptes autorisés à s’authentifier sur le broker */
    "users": [
        {                                      
            "username": "shelly_3em_user",         /* Identifiant MQTT à renseigner dans l’interface du Shelly 3EM */
            "password": "change_me_strong"     /* Mot de passe MQTT (à changer en prod ; plus tard chiffré en DB) */
        },
        {                                      
            "username": "zendure_solarflow_2400ac_user",         /* Identifiant MQTT à renseigner dans l’interface du Shelly 3EM */
            "password": "zendure_pw"     /* Mot de passe MQTT (à changer en prod ; plus tard chiffré en DB) */
        },
        {                                      
            "username": "express_power_flow",         /* Identifiant MQTT à renseigner dans l’interface du Shelly 3EM */
            "password": "super_secure_password"     /* Mot de passe MQTT (à changer en prod ; plus tard chiffré en DB) */
        }
    ],
    /* ACL = Access Control List (droits de publish/subscribe par user) */
    "acl": [
        /* Règle d’ACL associée à un utilisateur précis */
        {
            "username": "shelly_3em_user",         /* Cette règle s’applique à l’utilisateur "shelly_user" */
            "publish": [                       /* Liste blanche des topics que cet utilisateur peut PUBLIER */
                "shellies/+/emeter/+/+",       /* Mesures 3EM : shellies/<id>/emeter/<phase>/<clé> (power, voltage, …) */
                                                /*   "+" = wildcard sur exactement un segment de topic */
                "shellies/+/online",           /* Publication de l’état de présence (online/offline) */
                "shellies/+/announce"          /* Messages d’annonce/découverte du Shelly */
            ],
            "subscribe": []                    /* Vide = aucun droit de SUBSCRIBE (Shelly = publisher only) */
        }
    ]
};

export { mqttConfig };
