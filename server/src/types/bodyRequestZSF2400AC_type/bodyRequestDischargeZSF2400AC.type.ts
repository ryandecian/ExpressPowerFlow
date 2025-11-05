type BodyRequestDischargeZSF2400AC_Type = {
    sn: string, /* Numéro de série de l'appareil cible */
    properties: {
        acMode: 1, /* Commande charge */
        inputLimit: number, /* Commande : puissance de charge demandée */
    }
};

export type { BodyRequestDischargeZSF2400AC_Type };
