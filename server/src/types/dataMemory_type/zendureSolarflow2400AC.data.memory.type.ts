type ZendureSolarflow2400AC_data_memory_Type = {
    timestamp: number, /* ⚠️ Horodatage UNIX du message (en secondes) */
    sn: string, /* ⚠️ Numéro de série de l’appareil principal (onduleur SolarFlow 2400 AC) */
    product: string, /* ⚠️ Nom du modèle de l’appareil Zendure */
    properties: {
        electricLevel: number, /* ⚠️ Niveau de charge batterie (en %) */
        hyperTmp: number, /* ⚠️ Température interne brute (3071 = 30,71°C) */
        gridState: number, /* ⚠️ État du réseau détecté (1 = présent) */
        BatVolt: number, /* ⚠️ Tension batterie (mV → 4971 ≈ 49,71V) */
        acMode: number, /* ⚠️ Mode AC: 0 = veille/idle, 1 = charge, 2 = décharge */
        inputLimit: number, /* ⚠️ Limite de puissance d’entrée configurée (W ou %) */
        outputLimit: number, /* ⚠️ Limite de puissance de sortie configurée vers maison (W) */
        socSet: number, /* ⚠️ SoC cible paramétré (1000 ≈ 100%) */
        minSoc: number, /* ⚠️ Seuil minimum avant arrêt de décharge (50 ≈ 5%) */
    };
};

export { ZendureSolarflow2400AC_data_memory_Type };
