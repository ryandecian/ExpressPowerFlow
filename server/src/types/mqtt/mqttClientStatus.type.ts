type MqttClientStatus_Type = {
    connected: boolean;        /* True si la connexion au broker est établie */
    reconnecting: boolean;     /* True pendant les tentatives de reconnexion */
    lastError?: string;        /* Dernière erreur rencontrée (optionnelle) */
    url: string;               /* Adresse du broker MQTT */
    clientId: string;          /* Identifiant unique de ce client */
};

export type { MqttClientStatus_Type };
