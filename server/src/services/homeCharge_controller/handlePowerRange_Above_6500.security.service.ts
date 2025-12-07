/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* Ce service est utilisé en cas de mise en sécurité du réseau électrique. */
/* Ce service se déclanche si la consommation de maison dépasse 6500w hors batteries Zendure */
/* Dans ce cas precis, l'objectif est de piloter les batteries pour ne plus se charger mais bien de se décharger et maintenir la consommation maison sous les 6500w */
function handlePowerRange_Above_6500_security_Service(
    body: BodyRequestHomeController_Type,
    selectBattery: SelectBattery_Type,
    homePower: number /* Nombre positive car la maison consomme de l'énergie */
): BodyRequestHomeController_Type {
    
    /* Calcul du seul de déclanchement */
        const maxPowerHome: number = 6500; /* Puissance à atteindre */
        const thresholdPower: number = homePower - maxPowerHome; /* Nombre positif, il faudra le mettre négatif pour décharger les batteries */

    /* Couche 1 : Si le seuil de puissance est dépassé de plus de 100w */
        if (thresholdPower >= 100) {
            /* Couche 2 : Les deux batteries sont disponibles */
                if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Couche 3 : Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -thresholdPower * 0.5);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -thresholdPower * 0.5 + 5);
                        }
                    /* Couche 3 : Cas 2 : La batterie N1 a un niveau de charge plus haut que la batterie N2 */
                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                            const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                            /* Si la différence de % est de 5 ou plus la batterie N1 réduit sa puissance en priorité */
                                if (deltaElectricLevel >= 5) {
                                    /* Si la puissance max de charge (thresholdPower) disponible est suppérieur a 2400w */
                                        if (thresholdPower > 2400) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -2400);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -thresholdPower + 2400 + 5);
                                        }
                                    /* Si la puissance max de charge est inférieur ou égale à 2400w */
                                        else if (thresholdPower <= 2400 && thresholdPower > 0) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -thresholdPower);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
                                        }
                                }
                            /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                            /* J'en suis là ----------------------------------------------------------------------------------------------- */
                        }
                }
            /* Couche 2 : Seul la batterie N1 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    /* Attribution de toute la puissance à la batterie N1 */
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -thresholdPower);
                }
            /* Couche 2 : Seul la batterie N2 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Attribution de toute la puissance à la batterie N2 */
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -thresholdPower + 5);
                }
            /* Couche 2 : Aucune batterie n'est disponible */
                else {
                    console.error("[homeCharge_Controller] - handlePowerRange_Above_6500_security - Erreur : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                    return body;
                }
        }
    /* Couche 1 : Si le seuil de puissance est inférieur à 100w */
        else {
            return body;
        }

    return body;
}

export { handlePowerRange_Above_6500_security_Service };
