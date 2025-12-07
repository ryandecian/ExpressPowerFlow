/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* targetPower compris entre 600 et 1200w de décharge */
function handlePowerRange_Neg600_To_Neg1200_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            /* Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
                }
            /* Cas numéro 2 : La batterie N1 à un niveau de charge plus élevé que la batterie N2 */
                else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                    /* Si la différence de % est de 5 ou plus la batterie N1 on répartie le travail avec max 600w de charge pour N1 */
                        if (deltaElectricLevel >= 5) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -600);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 600 + 5);
                        }
                    /* Si la différence de 4% : N1 = 90% et N2 = 10% dans la limite des 600w pour N1 */
                        else if (deltaElectricLevel === 4) {
                            const deltaTargetPower = targetPower * 0.9;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N1 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.1 + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N1 et le reste à N2 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 600 + 5);
                                }
                        }
                    /* Si la différence de 3% : N1 = 80% et N2 = 20% dans la limite des 600w pour N1*/
                        else if (deltaElectricLevel === 3) {
                            const deltaTargetPower = targetPower * 0.8;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N1 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.2 + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N1 et le reste à N2 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 600 + 5);
                                }
                        }
                    /* Si la différence de 2% : N1 = 70% et N2 = 30% dans la limite des 600w pour N1*/
                        else if (deltaElectricLevel === 2) {
                            const deltaTargetPower = targetPower * 0.7;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N1 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.3 + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N1 et le reste à N2 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 600 + 5);
                                }
                        }
                    /* Si la différence de 1% : N1 = 60% et N2 = 40% dans la limite des 600w pour N1*/
                        else {
                            const deltaTargetPower = targetPower * 0.6;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N1 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.4 + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N1 et le reste à N2 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 600 + 5);
                                }
                        }
                }
            /* Cas numéro 3 : La batterie N2 à un niveau de charge moins élevé que la batterie N1 */
                else {
                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                    /* Si la différence de % est de 5 ou plus sur la batterie N2 on répartie le travail avec max 600w de charge pour N2 */
                        if (deltaElectricLevel >= 5) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 600);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -600 + 5);
                        }
                    /* Si la différence de 4% : N1 = 10% et N2 = 90% dans la limite des 600w pour N2*/
                        else if (deltaElectricLevel === 4) {
                            const deltaTargetPower = targetPower * 0.9;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N2 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.1);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N2 et le reste à N1 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -600 + 5);
                                }
                        }
                    /* Si la différence de 3% : N1 = 20% et N2 = 80% dans la limite des 600w pour N2*/
                        else if (deltaElectricLevel === 3) {
                            const deltaTargetPower = targetPower * 0.8;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N2 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.2);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N2 et le reste à N1 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -600 + 5);
                                }
                        }
                    /* Si la différence de 2% : N1 = 30% et N2 = 70% dans la limite des 600w pour N2*/
                        else if (deltaElectricLevel === 2) {
                            const deltaTargetPower = targetPower * 0.7;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N2 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.3);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N2 et le reste à N1 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -600 + 5);
                                }
                        }
                    /* Si la différence de 1% : N1 = 40% et N2 = 60% dans la limite des 600w pour N2*/
                        else {
                            const deltaTargetPower = targetPower * 0.6;

                            /* Si deltaTargetPower est inférieur à 600w, on applique deltaTargetPower à N2 */
                                if (deltaTargetPower <= 600) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.4);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                }
                            /* Si deltaTargetPower est supérieur à 600w, on applique 600w à N2 et le reste à N1 */
                                else {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 600);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -600 + 5);
                                }
                        }
                }
        }
    /* Si seule la batterie 1 est disponible */
        else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
        }
    /* Si seule la batterie 2 est disponible */
        else {
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower);
        }

    return body;
}

export { handlePowerRange_Neg600_To_Neg1200_Service };
