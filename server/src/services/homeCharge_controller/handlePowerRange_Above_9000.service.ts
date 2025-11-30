/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* Utilisé lors de la charge des batteries si la puissance mesurée par le compteur shelly dépasse les 8700w */
function handlePowerRange_Above_9000(
    body: BodyRequestHomeController_Type, 
    shellyPower: number, 
    selectBattery: SelectBattery_Type, 
    shellyPrise_BatterieZSF2400AC_N1_Power: number, 
    shellyPrise_BatterieZSF2400AC_N2_Power: number
): BodyRequestHomeController_Type {

    /* Calcul du seul de déclanchement */
        const maxPowerHome: number = 8700

        const thresholdPower: number = shellyPower - maxPowerHome;

    /* Couche 1 : Si le seuil de puissance est dépassé de plus de 100w */
        if (thresholdPower > 100) {
            /* Couche 2 : Les deux batteries sont disponibles */
                if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Couche 3 : Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.5);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - (thresholdPower * 0.5) + 5);
                        }
                    /* Couche 3 : Cas 2 : La batterie N1 a un niveau de charge plus haut que la batterie N2 */
                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                            const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                            /* Si la différence de % est de 5 ou plus la batterie N1 réduit sa puissance en priorité */
                                if (deltaElectricLevel >= 5) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power + 5); /* Commande pour mise en veille */
                                }
                            /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                                else if (deltaElectricLevel === 4) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.9);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - (thresholdPower * 0.1) + 5);
                                }
                            /* Si la différence de 3% : N1 = 80% et N2 = 20% */
                                else if (deltaElectricLevel === 3) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.8);
                                body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - (thresholdPower * 0.2) + 5);
                                }
                            /* Si la différence de 2% : N1 = 70% et N2 = 30% */
                                else if (deltaElectricLevel === 2) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.7);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - (thresholdPower * 0.3) + 5);
                                }
                            /* Si la différence de 1% : N1 = 60% et N2 = 40% */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.6);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - (thresholdPower * 0.4) + 5);
                                }
                        }
                    /* Couche 3 : Cas 2 : La batterie N2 a un niveau de charge plus haut que la batterie N1 */
                        else if (selectBattery.zendureSolarflow2400AC_N2.electricLevel > selectBattery.zendureSolarflow2400AC_N1.electricLevel) {
                            const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;

                            /* Si la différence de % est de 5 ou plus la batterie N2 réduit sa puissance en priorité */
                                if (deltaElectricLevel >= 5) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power + 0); /* Commande pour mise en veille */
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower);
                                }
                            /* Si la différence de 4% : N2 = 90% et N1 = 10% */
                                else if (deltaElectricLevel === 4) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.1);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower * 0.9 + 5);
                                }
                            /* Si la différence de 3% : N2 = 80% et N1 = 20% */
                                else if (deltaElectricLevel === 3) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.2);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower * 0.8 + 5);
                                }
                            /* Si la différence de 2% : N2 = 70% et N1 = 30% */
                                else if (deltaElectricLevel === 2) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.3);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower * 0.7 + 5);
                                }
                            /* Si la différence de 1% : N2 = 60% et N1 = 40% */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower * 0.4);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower * 0.6 + 5);
                                }
                        }
                    /* Couche 3 : Si aucune des situation n'est rencontrée */
                        else {
                            console.error("[homeCharge_Controller] - handlePowerRange_Above_9000 - Erreur : Impossible de déterminer la répartition de la puissance entre les deux batteries Zendure Solarflow 2400 AC.");
                            return body;
                        }
                }
            /* Couche 2 : Seul la batterie N1 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    /* Attribution de la puissance à la batterie N1 */
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower);
                }
            /* Couche 2 : Seul la batterie N2 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Attribution de la puissance à la batterie N2 */
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower + 5);
                }
            /* Couche 2 : Aucune batterie n'est disponible */
                else {
                    console.error("[homeCharge_Controller] - handlePowerRange_Above_9000 - Erreur : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                    return body;
                }
        }
    /* Couche 1 : Si le seuil de puissance est inférieur à 100w */
        else {
            return body;
        }


    return body;
}

export { handlePowerRange_Above_9000 };
