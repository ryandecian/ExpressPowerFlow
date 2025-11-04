type BodyRequestChargeZSF2400AC_Type = {
    sn: string, /* Numéro de série de l'appareil cible */
    properties: {
        acMode: 2, /* Commande décharge */
        outputLimit: number, /* Commande : puissance de décharge demandée */
    }
};

export type { BodyRequestChargeZSF2400AC_Type };
