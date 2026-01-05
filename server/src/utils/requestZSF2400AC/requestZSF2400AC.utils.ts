/* Import des Datas */
import { refPowerZSF2400AC_v2_Data } from "../../database/zSF2400AC/refPowerZSF2400AC.v2.data.js";

/* Import des Types : */
import type { BodyRequestChargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestChargeZSF2400AC.type.js";
import type { BodyRequestDischargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestDischargeZSF2400AC.type.js";

/* Import des Utils */
import { adjustZendureChargePower } from "../ajustement/adjustZendureChargePower.utils.js";
import { adjustZendureDischargePower } from "../ajustement/adjustZendureDischargePower.utils.js";

/* Attention, les valeurs sont interpreté d'un point de vue de la batterie. */
/* Valeur positive = charge batterie / Valeur négative = décharge batterie. */
function requestZSF2400AC_Utils(sn: string, targetPower: number): BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type {
    /* Initialisation des variables */
        let valueCommande: number = 0; /* Valeur de la commande à envoyer dans le body */
        let body: BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type; /* Corps de la requête */

    /* Logique métier 0 : Si targetPower = 0, 1 ou -1 (ce sont des valeurs inatégnables) */
        if (targetPower === 0 || targetPower === 1 || targetPower === -1) {
            body = {
                sn: sn, /* Numéro de série de l'appareil cible */
                properties: {
                    acMode: 2, /* Commande décharge */
                    outputLimit: 0, /* Commande : puissance de décharge demandée */
                }
            };
            return body; /* Envois du corps de la requête créer au controller */
        }

    /* Logique métier 1 : Préparation des variables */
        /* Arrondissement de la valeur cible (targetPower) en un nombre entier */
        targetPower = Math.round(targetPower);

        /* Conversion de targetPower de number à string */
        const targetPowerString = targetPower.toString();
        console.log(`Target Power dans requestZSF2400AC_Utils : ${targetPower} W`);

    /* Logique métier 2 : Calcul de la valeur de la commande à intégrer dans la requête */
        /* Option 1 : Utilisation des données des tests effectués (très précis) dans refPowerZSF2400AC */
            /* Parcours les datas et vérifie si la clé targetPowerString existe dans refPowerZSF2400AC_v2_Data */
            if (targetPowerString in refPowerZSF2400AC_v2_Data) {
                valueCommande = refPowerZSF2400AC_v2_Data[targetPowerString as keyof typeof refPowerZSF2400AC_v2_Data]; /* On dit a typescript tkt, la clé existe bien dans refPowerZSF2400AC_v2_Data */
            }
        /* Option 2 : Si la valeur n'existe pas dans les datas, on fait une approximation linéaire avec utils */
            else {
                /* Possibilité 1 : La valeur est inférieure à 0 donc négative, on doit décharger la batterie */
                    if (targetPower < 0) {
                        valueCommande = adjustZendureDischargePower(targetPower) /* Valeur positive et nb entier */
                    }

                /* Possibilité 2 : La valeur est supérieure à 0 donc positive, on doit charger la batterie */
                    if (targetPower > 0) {
                        valueCommande = adjustZendureChargePower(targetPower) /* Valeur positive et nb entier */
                    }
            }
            console.log(`Valeur de la commande : ${valueCommande} W`);
    
    /* Logique métier 3 : Transformation de la variable de commande */
        const stateValueCommande: number = valueCommande; /* Conservation de la valeur d'état avec son signe positif ou négatif pour décider quel utils sera lancé */
        if (valueCommande < 0) {
            valueCommande = Math.abs(valueCommande); /* On transforme la valeur en positive */
        }
        
    /* Logique métier 4 : Préparation du body de la requête */
        /* Option 1 : targetPower est négatif donc préparation du requête avec commande de décharge batterie */
        if (stateValueCommande < 0) {
            body = {
                sn: sn, /* Numéro de série de l'appareil cible */
                properties: {
                    acMode: 2, /* Commande décharge */
                    outputLimit: valueCommande, /* Commande : puissance de décharge demandée */
                }
            };
            return body; /* Envois du corps de la requête créer au controller */
        }

        /* Option 2 : targetPower est positif donc préparation du requête avec commande de charge batterie */
        if (stateValueCommande > 0) {
            body = {
                sn: sn, /* Numéro de série de l'appareil cible */
                properties: {
                    acMode: 1, /* Commande charge */
                    inputLimit: valueCommande, /* Commande : puissance de charge demandée */
                }
            };
            return body; /* Envois du corps de la requête créer au controller */
        }

    return body!; /* Juste pour satisfaire Typescript, ce return ne sera jamais atteint */
}

export { requestZSF2400AC_Utils };
