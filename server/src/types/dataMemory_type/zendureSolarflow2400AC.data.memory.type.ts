type ZendureSolarflow2400AC_data_memory_Type = {
    timestamp: number, /* ⚠️ Horodatage UNIX du message (en secondes) */
    sn: string, /* ⚠️ Numéro de série de l’appareil principal (onduleur SolarFlow 2400 AC) */
    product: string, /* ⚠️ Nom du modèle de l’appareil Zendure */
    properties: {};
};

export { ZendureSolarflow2400AC_data_memory_Type };
