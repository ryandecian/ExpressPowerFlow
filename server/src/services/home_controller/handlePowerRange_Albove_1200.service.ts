/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* targetPower suppérieure à 1200w de charge */
function handlePowerRange_Albove_1200_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            /* Cas 1 : Si les deux batteries sont chargées à 100% */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === 100 && selectBattery.zendureSolarflow2400AC_N2.electricLevel === 100) {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                }
            /* Cas 2 : Si une des deux batteries est chargé à 100% */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === 100 || selectBattery.zendureSolarflow2400AC_N2.electricLevel === 100) {
                    /* Si la batterie N1 est à 100% */
                        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === 100) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                        }
                    /* Si la batterie N2 est à 100% */
                        else {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                        }
                }
            /* Cas 3 : Si aucune des deux batteries n'est chargée à 100% */
                else {
                    /* ⚠️ Option 1 : Si les deux batteries ont un niveau de charge entre 95 et 100% */
                        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > 95 && selectBattery.zendureSolarflow2400AC_N2.electricLevel > 95) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
                        }
                    /* Option 2 : Si une des deux batteries a un niveau de charge entre 90 et 95% et que l'autre batterie est au moins 95% ou plus */
                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > 90 && selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 95 &&
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel > 95 || selectBattery.zendureSolarflow2400AC_N2.electricLevel > 90 && 
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel <= 95 && selectBattery.zendureSolarflow2400AC_N1.electricLevel > 95) {
                            /* Si la batterie N1 est entre 90 et 95%, on le charge en priorité jusqu'à 1500w, le reste va au N2 */
                                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 95) {
                                    /* Si targetPower est inférieur ou égal à 1500w N1 = 60% et N2 = 40% */
                                        if (targetPower <= 1500) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower *0.6);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.4 + 5);
                                        }
                                    /* Si targetPower est entre 1500 et 2100w N1 = 1500w et le reste à N2 */
                                        else if (targetPower > 1500 && targetPower <= 2100) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                        }
                                    /* ⚠️ Si targetPower est supérieur à 2100w on attribue 1500w à N1, 600w à N2 et le reste est divisé équitablement à chaque batteries */
                                        else {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 2100) / 2));
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 600 + ((targetPower - 2100) / 2) + 5);
                                        }
                                }
                            /* Si la batterie N2 est entre 90 et 95%, on le charge en priorité jusqu'à 1500w, le reste va au N1 */
                                else {
                                    /* Si targetPower est inférieur ou égal à 1500w N2 = 60% et N1 = 40% */
                                        if (targetPower <= 1500) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower *0.4);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.6 + 5);
                                        }
                                    /* Si targetPower est entre 1500 et 2100w N2 = 1500w et le reste à N1 */
                                        else if (targetPower > 1500 && targetPower <= 2100) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                        }
                                    /* ⚠️ Si targetPower est supérieur à 2100w on attribue 1500w à N2, 600w à N1 et le reste est divisé équitablement à chaque batteries */
                                        else {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 600 + ((targetPower - 2100) / 2));
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 2100) / 2) + 5);
                                        }
                                }
                        }
                    /* Option 3 : Les deux batteries ont un niveau de charge entre 90 et 95% */
                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > 90 && selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 95 &&
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel > 90 && selectBattery.zendureSolarflow2400AC_N2.electricLevel <= 95) {
                            /* Si les deux batteries ont des niveaux de charge égale */
                                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
                                }
                            /* Si la batterie N1 à une charge moins élevée que le N2, il va travailler plus que le N2 */
                                else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel < selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;

                                    /* Si la différence de % est de 5 ou plus la batterie N1 on répartie le travail avec max 600w de charge pour N1 */
                                        if (deltaElectricLevel >= 5) {
                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (targetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (targetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 90% et N2 = 10% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower: number = targetPower * 0.9;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.1 + 5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 3% : N1 = 80% et N2 = 20% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower: number = targetPower * 0.8;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.2 + 5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 70% et N2 = 30% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower: number = targetPower * 0.7;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.3 + 5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 60% et N2 = 40% dans la limite des 1500w pour N1 */
                                        else {
                                            const deltaTargetPower: number = targetPower * 0.6;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.4 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 1500w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                }
                            /* Si la batterie N2 à une charge moins élevée que le N1, il va travailler plus que le N1 */
                                else {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                                    /* Si la différence de % est de 5 ou plus la batterie N1 on répartie le travail avec max 600w de charge pour N1 */
                                        if (deltaElectricLevel >= 5) {
                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (targetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (targetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 90% et N2 = 10% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower: number = targetPower * 0.9;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower +5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 3% : N1 = 80% et N2 = 20% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower: number = targetPower * 0.8;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.2);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                                }
                                            /* Si la puissance demandée est entre 1500 et 3000w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 70% et N2 = 30% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower: number = targetPower * 0.7;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.3);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 1500w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 60% et N2 = 40% dans la limite des 1500w pour N1 */
                                        else {
                                            const deltaTargetPower: number = targetPower * 0.6;

                                            /* Si la puissance demandée est inférieure ou égale à 1500w */
                                                if (deltaTargetPower <= 1500) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.4);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 1500w */
                                                else if (deltaTargetPower > 1500 && targetPower <= 3000) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                            /* Si la puissance demandée est supérieure à 3000w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500 + ((targetPower - 3000) / 2));
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + ((targetPower - 3000) / 2) + 5);
                                                }
                                        }
                                }
                        }
                    /* Option 4 : Si une des deux batteries a un niveau de charge inférieur à 90% et que l'autre est entre 90 et 95% */
                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 90 && selectBattery.zendureSolarflow2400AC_N2.electricLevel > 90 && 
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel <= 95 || selectBattery.zendureSolarflow2400AC_N2.electricLevel < 90 &&
                            selectBattery.zendureSolarflow2400AC_N1.electricLevel > 90 && selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 95) {
                            /* Si la batterie N1 est sous 90% et N2 entre 90 et 95, charge en priorité N1 et limite N2 à 1500w */
                                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel <= 90 && selectBattery.zendureSolarflow2400AC_N2.electricLevel > 90 && 
                                    selectBattery.zendureSolarflow2400AC_N2.electricLevel <= 95) {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;

                                    /* Si la différence est suppérieur ou égale à 5%, N1 prend toute la charge */
                                        if (deltaElectricLevel >= 5) {
                                            /*Si targetPower est inférieur ou égale à 2400w */
                                                if (targetPower <= 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                                                }
                                            /* Si targetPower est supérieur à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 90% et N2 = 10% dans la limite des 1500w pour N2 */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower_N1: number = targetPower * 0.9;
                                            const deltaTargetPower_N2: number = targetPower * 0.1;

                                            /* Si la puissance de charge à demander à N2 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N2 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N2 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N1 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                        }
                                    /* Si la différence de 3% : N1 = 80% et N2 = 20% dans la limite des 1500w pour N2 */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower_N1: number = targetPower * 0.8;
                                            const deltaTargetPower_N2: number = targetPower * 0.2;

                                            /* Si la puissance de charge à demander à N2 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N2 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N2 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N1 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 70% et N2 = 30% dans la limite des 1500w pour N2 */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower_N1: number = targetPower * 0.7;
                                            const deltaTargetPower_N2: number = targetPower * 0.3;

                                            /* Si la puissance de charge à demander à N2 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N2 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                        }
                                                }
                                                /* Si la puissance de N2 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N1 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 60% et N2 = 40% dans la limite des 1500w pour N2 */
                                        else {
                                            const deltaTargetPower_N1: number = targetPower * 0.6;
                                            const deltaTargetPower_N2: number = targetPower * 0.4;

                                            /* Si la puissance de charge à demander à N2 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N2 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N2 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N1 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 1500 + 5);
                                                }
                                        }
                                }
                            /* Si la batterie N2 est sous 90% et N1 entre 90 et 95, charge en priorité N2 et limite N1 à 1500w */
                                else {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;
                                    
                                    /* Si la différence est suppérieur ou égale à 5%, N2 prend toute la charge */
                                        if (deltaElectricLevel >= 5) {
                                            /* Si targetPower est inférieur ou égale à 2400w */
                                                if (targetPower <= 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                                                }
                                            /* Si targetPower est supérieur à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 90% et N2 = 10% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower_N1: number = targetPower * 0.1;
                                            const deltaTargetPower_N2: number = targetPower * 0.9;

                                        /* Si la puissance de charge à demander à N1 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                            if (deltaTargetPower_N1 <= 1500) {
                                                /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                    if (deltaTargetPower_N1 <= 2400) {
                                                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                    }
                                                /* Si la puissance de N1 est supérieure à 2400w */
                                                    else {
                                                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                    }
                                            }
                                        /* Si la puissance de N1 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N2 */
                                            else {
                                                body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                            }
                                        }
                                    /* Si la différence de 3% : N1 = 80% et N2 = 20% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower_N1: number = targetPower * 0.2;
                                            const deltaTargetPower_N2: number = targetPower * 0.8;

                                            /* Si la puissance de charge à demander à N1 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N1 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N1 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N2 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 70% et N2 = 30% dans la limite des 1500w pour N1 */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower_N1: number = targetPower * 0.3;
                                            const deltaTargetPower_N2: number = targetPower * 0.7;

                                            /* Si la puissance de charge à demander à N1 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N1 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N1 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N2 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 60% et N2 = 40% dans la limite des 1500w pour N1 */
                                        else {
                                            const deltaTargetPower_N1: number = targetPower * 0.4;
                                            const deltaTargetPower_N2: number = targetPower * 0.6;

                                            /* Si la puissance de charge à demander à N1 est inférieure ou égale à 1500w, on applique la règle des 5% normalement */
                                                if (deltaTargetPower_N1 <= 1500) {
                                                    /* Si la puissance de N1 est inférieure ou égale à 2400w */
                                                        if (deltaTargetPower_N1 <= 2400) {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                                                        }
                                                    /* Si la puissance de N1 est supérieure à 2400w */
                                                        else {
                                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                        }
                                                }
                                            /* Si la puissance de N1 est suppérieur à 1500w, on le bride a 1500w et on envois le reste à N2 */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 1500);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 1500 + 5);
                                                }
                                        }
                                }
                        }
                    /* Option 5 : Si les deux batteries ont des niveaux de charges inférieurs ou égale à 90% */
                        else {
                            /* Si les deux batteries ont un niveau de charge égale */
                                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
                                }
                            /* Si la batterie N1 a un niveau de charge inférieure à la batterie N2 */
                                else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel < selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;

                                    /* Si la différence est suppérieur ou égale à 5%, N1 prend toute la charge */
                                        if (deltaElectricLevel >= 5) {
                                            /* Si la puissance de targetPower est suppérieur à 2400w */
                                                if (targetPower > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                            /* Si la puissance de targetPower est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower_N1: number = targetPower * 0.9;
                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.1 + 5);
                                                }
                                        }
                                    /* Si la différence de 3% : N1 = 80% et N2 = 20% */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower_N1: number = targetPower * 0.8;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.2 + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 70% et N2 = 30% */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower_N1: number = targetPower * 0.7;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.3 + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 60% et N2 = 40% */
                                        else {
                                            const deltaTargetPower_N1: number = targetPower * 0.6;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.4 + 5);
                                                }
                                        }
                                }
                            /* Si la batterie N2 a un niveau de charge inférieure à la batterie N1 */
                                else {
                                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                                    /* Si la différence est suppérieur ou égale à 5%, N2 prend toute la charge */
                                        if (deltaElectricLevel >= 5) {
                                            /* Si la puissance de targetPower est suppérieur à 2400w */
                                                if (targetPower > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                            /* Si la puissance de targetPower est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                                                }
                                        }
                                    /* Si la différence de 4% : N1 = 10% et N2 = 90% */
                                        else if (deltaElectricLevel === 4) {
                                            const deltaTargetPower_N1: number = targetPower * 0.1;
                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.9 + 5);
                                                }
                                        }
                                    /* Si la différence de 3% : N1 = 20% et N2 = 80% */
                                        else if (deltaElectricLevel === 3) {
                                            const deltaTargetPower_N1: number = targetPower * 0.2;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.8 + 5);
                                                }
                                        }
                                    /* Si la différence de 2% : N1 = 30% et N2 = 70% */
                                        else if (deltaElectricLevel === 2) {
                                            const deltaTargetPower_N1: number = targetPower * 0.3;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.7 + 5);
                                                }
                                        }
                                    /* Si la différence de 1% : N1 = 40% et N2 = 60% */
                                        else {
                                            const deltaTargetPower_N1: number = targetPower * 0.4;

                                            /* Si la puissance de deltaTargetPower_N1 est suppérieur à 2400w */
                                                if (deltaTargetPower_N1 > 2400) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                                                }
                                            /* Si la puissance de deltaTargetPower_N1 est inférieure ou égale à 2400w */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.6 + 5);
                                                }
                                        }
                                }
                        }
                }
        }
    /* Si seul la batterie N1 est disponible */
        else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
        }
    /* Si seul la batterie N2 est disponible */
        else {
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
        }

    return body;
}

export { handlePowerRange_Albove_1200_Service };
