type GetShellyPlugSGen3_data_Type = {
    ble: Record<string, never>;                   /* Module Bluetooth Low Energy (désactivé ici, vide) */
    bthome: {                                     /* Interface Bluetooth Home (protocole de télémétrie) */
        errors: string[];                         /* Liste des erreurs BTHome, ici "bluetooth_disabled" */
    };
    cloud: {                                      /* Statut de la connexion Cloud Shelly */
        connected: boolean;                       /* true si connecté au Cloud Shelly */
    };
    knx: Record<string, never>;                   /* Configuration KNX (non utilisée sur ce modèle) */
    matter: {                                     /* Support du protocole Matter (domotique interopérable) */
        num_fabrics: number;                      /* Nombre de réseaux Matter configurés */
        commissionable: boolean;                  /* true si l’appareil est prêt à être appairé Matter */
    };
    mqtt: {                                       /* Statut de la connexion MQTT */
        connected: boolean;                       /* true si connecté à un broker MQTT */
    };
    plugs_ui: Record<string, never>;              /* Paramètres d’interface utilisateur de la prise (vide) */
    "switch:0": {                                 /* Informations de la sortie principale de la prise */
        id: number;                               /* Identifiant interne du relais (0 = unique) */
        source: string;                           /* Source de l’état actuel (init, mqtt, http, etc.) */
        output: boolean;                          /* ⚠️ true si la prise est alimentée (ON) */
        apower: number;                           /* ⚠️ Puissance instantanée en watts (W) */
        voltage: number;                          /* ⚠️ Tension mesurée en volts (V) */
        freq: number;                             /* ⚠️ Fréquence du courant en hertz (Hz) */
        current: number;                          /* ⚠️ Courant mesuré en ampères (A) */
        aenergy: {                                /* Énergie totale consommée */
            total: number;                        /* Total d’énergie consommée (Wh) */
            by_minute: number[];                  /* Historique d’énergie par minute (Wh/min) */
            minute_ts: number;                    /* Timestamp du dernier enregistrement (s) */
        };
        ret_aenergy: {                            /* Énergie totale restituée (injection retour, si applicable) */
            total: number;                        /* Total d’énergie renvoyée (Wh) */
            by_minute: number[];                  /* Historique d’énergie renvoyée par minute (Wh/min) */
            minute_ts: number;                    /* Timestamp du dernier enregistrement (s) */
        };
        temperature: {                            /* Température interne du module */
            tC: number;                           /* Température en degrés Celsius */
            tF: number;                           /* Température en degrés Fahrenheit */
        };
    };
    sys: {                                        /* Informations système et matérielles */
        mac: string;                              /* Adresse MAC unique de l’appareil */
        restart_required: boolean;                /* true si un redémarrage est nécessaire */
        time: string;                             /* Heure locale actuelle (format HH:MM) */
        unixtime: number;                         /* Horodatage UNIX actuel (en secondes) */
        last_sync_ts: number;                     /* Dernière synchronisation de l’heure (UNIX) */
        uptime: number;                           /* Temps de fonctionnement depuis le démarrage (s) */
        ram_size: number;                         /* Taille totale de la RAM (octets) */
        ram_free: number;                         /* Mémoire RAM libre (octets) */
        ram_min_free: number;                     /* Mémoire RAM minimale libre observée (octets) */
        fs_size: number;                          /* Taille totale du système de fichiers interne (octets) */
        fs_free: number;                          /* Espace libre restant sur le système de fichiers (octets) */
        cfg_rev: number;                          /* Révision actuelle de la configuration */
        kvs_rev: number;                          /* Révision du Key-Value Store interne */
        schedule_rev: number;                     /* Révision du planificateur d’événements */
        webhook_rev: number;                      /* Révision des webhooks configurés */
        btrelay_rev: number;                      /* Révision du relais Bluetooth (si présent) */
        available_updates: Record<string, never>; /* Informations sur les mises à jour disponibles */
        reset_reason: number;                     /* Code indiquant la cause du dernier redémarrage */
        utc_offset: number;                       /* Décalage horaire UTC en secondes */
    };
    wifi: {                                       /* Informations réseau Wi-Fi */
        sta_ip: string;                           /* Adresse IPv4 locale de l’appareil */
        status: string;                           /* État actuel de la connexion Wi-Fi ("got ip", etc.) */
        ssid: string;                             /* Nom du réseau Wi-Fi connecté */
        bssid: string;                            /* Adresse MAC du point d’accès */
        rssi: number;                             /* Puissance du signal Wi-Fi (dBm) */
        sta_ip6: string[];
    }                                               /* Liste des adresses IPv6 attribuées à l’appareil */
    ws: {                                         /* Statut de la connexion WebSocket */
        connected: boolean;                       /* true si une connexion WebSocket est active */
    };
};

export type { GetShellyPlugSGen3_data_Type };
