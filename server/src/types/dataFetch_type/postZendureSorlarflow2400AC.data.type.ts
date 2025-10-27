type PostZendureSolarflow2400AC_data_Type = {
    "timestamp": number, /* ⚠️ Horodatage UNIX du message (en secondes) */
    "messageId": number, /* Identifiant du message envoyé (incrémental) */
    "success": true, /* Indicateur de succès de l’opération */
    "code": number, /* Code de statut de la réponse */
    "sn": string, /* ⚠️ Numéro de série de l’appareil principal (onduleur SolarFlow 2400 AC) */
}

export type { PostZendureSolarflow2400AC_data_Type };
