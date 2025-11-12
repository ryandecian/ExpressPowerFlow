type SystemOverview_Data_Memory_Type = {
    homePower: number | null, /* ⚠️ Puissance totale de la maison consommation (W) */
    edfPower: number | null, /* ⚠️ Puissance totale du réseau consommation EDF (W) */
    solarPower: number | null, /* ⚠️ Puissance totale solaire (W) */
    batteryPower: number | null, /* ⚠️ Puissance totale batterie charge (+) / décharge (-) (W) */
    dataBattery: {
        zendureSolarflow2400AC_N1: {
            sn: string | null, /* Numéro de série du Solarflow */
            status: boolean, /* Statut réseau batterie (répond bien au fetch ?) si false = la batterie ne répond plus */
            gridState: boolean, /* État du réseau détecté par la batterie (branché sur 230V ?) true = good */
            hyperTmp: number | null, /* Température interne brute de l'onduleur en °C */
            electricLevel: number | null, /* Niveau de charge batterie (en %)  exemple 96 pour 96% */
            BatVolt: number | null, /* Tension de la batterie (en V) exemple 49.71 pour 49.71V */
            powerFlow: number | null, /* ⚠️ Puissance de charge (+) ou décharge (-) de la batterie (en W) exemple -500 pour décharge à 500W (Valeur mesuré par prise Shelly dédiée) */
            maxSoc: number | null, /* SoC maximum paramétré (en %) exemple 100 pour 100% */
            minSoc: number | null, /* Seuil minimum avant arrêt de décharge (en %) exemple 5 pour 5% */
        },
        zendureSolarflow2400AC_N2: {
            sn: string | null, /* Numéro de série du Solarflow */
            status: boolean, /* Statut réseau batterie (répond bien au fetch ?) si false = la batterie ne répond plus */
            gridState: boolean, /* État du réseau détecté par la batterie (branché sur 230V ?) true = good */
            hyperTmp: number | null, /* Température interne brute de l'onduleur en °C */
            electricLevel: number | null, /* Niveau de charge batterie (en %)  exemple 96 pour 96% */
            BatVolt: number | null, /* Tension de la batterie (en V) exemple 49.71 pour 49.71V */
            powerFlow: number | null, /* ⚠️ Puissance de charge (+) ou décharge (-) de la batterie (en W) exemple -500 pour décharge à 500W (Valeur mesuré par prise Shelly dédiée) */
            maxSoc: number | null, /* SoC maximum paramétré (en %) exemple 100 pour 100% */
            minSoc: number | null, /* Seuil minimum avant arrêt de décharge (en %) exemple 5 pour 5% */
        },
    }
};

export { SystemOverview_Data_Memory_Type };
