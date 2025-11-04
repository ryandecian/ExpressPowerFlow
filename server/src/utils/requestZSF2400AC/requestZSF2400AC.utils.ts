/* Import des Datas */
import { refPowerZSF2400AC } from "../../database/zSF2400AC/refPowerZSF2400AC.data.js";

/* Import des Types : */
import type { BodyRequestChargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestChargeZSF2400AC.type.js";
import type { BodyRequestDischargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestDischargeZSF2400AC.type.js";

/* Import des Utils */
import { adjustZendureChargePower } from "../ajustement/adjustZendureChargePower.utils.js";
import { adjustZendureDischargePower } from "../ajustement/adjustZendureDischargePower.utils.js";

function requestZSF2400AC_Utils(sn: string, targetPower: number): BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type {
    /* Initialisation des variables */
        let valueCommande: number = 0; /* Valeur de la commande à envoyer dans le body */
        let body = {}; /* Corps de la requête */

    /* Logique métier 1 : Préparation des variables */
        /* Arrondissement de la valeur cible (targetPower) en un nombre entier */
        targetPower = Math.round(targetPower);

        /* Conversion de targetPower de number à string */
        const targetPowerString = targetPower.toString();

    /* Logique métier 2 : Calcul de la valeur de la commande à intégrer dans la requête */
        /* Option 1 : Utilisation des données des tests effectués (très précis) dans refPowerZSF2400AC */
            /* Parcours les datas et vérifie si la clé targetPowerString existe dans refPowerZSF2400AC */
            if (targetPowerString in refPowerZSF2400AC) {
            valueCommande = refPowerZSF2400AC[targetPowerString as keyof typeof refPowerZSF2400AC]; /* On dit a typescript tkt, la clé existe bien dans refPowerZSF2400AC */
            }
        
        /* Option 2 : Si la valeur n'existe pas dans les datas, on fait une approximation linéaire avec utils */
            /* Possibilité 1 : La valeur est inférieure à 0 donc négative, on doit charger la batterie */
            if (targetPower < 0) {
                valueCommande = adjustZendureChargePower(targetPower)
            }

}

export { requestZSF2400AC_Utils };
