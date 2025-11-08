/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* targetPower compris entre -50 et -600w de décharge */
function handlePowerRange_Neg50_To_Neg600_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            /* Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
                }
            /* Cas 2 : La batterie N1 a un niveau de charge plus haut que la batterie N2 */
                else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                    /* Si la différence de % est de 5 ou plus la batterie N1 prend tout le travail */
                        if (deltaElectricLevel >= 5) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
                        }
                    /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                        else if (deltaElectricLevel === 4) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.9);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.1 + 5);
                        }
                    /* Si la différence de 3% : N1 = 80% et N2 = 20% */
                        else if (deltaElectricLevel === 3) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.8);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.2 + 5);
                        }
                    /* Si la différence de 2% : N1 = 70% et N2 = 30% */
                        else if (deltaElectricLevel === 2) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.7);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.3 + 5);
                        }
                    /* Si la différence de 1% : N1 = 60% et N2 = 40% */
                        else {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.6);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.4 + 5);
                        }
                }
            /* Cas 3 : La batterie N2 a un niveau de charge plus haut que la batterie N1 */
                else {
                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;
                    
                    /* Si la différence de % est de 5 ou plus la batterie N2 prend tout le travail */
                        if (deltaElectricLevel >= 5) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0); /* Commande pour mise en veille */
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                        }
                    /* Si la différence de 4% : N2 = 90% et N1 = 10% */
                        else if (deltaElectricLevel === 4) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.1);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.9 + 5);
                        }
                    /* Si la différence de 3% : N2 = 80% et N1 = 20% */
                        else if (deltaElectricLevel === 3) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.2);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.8 + 5);
                        }
                    /* Si la différence de 2% : N2 = 70% et N1 = 30% */
                        else if (deltaElectricLevel === 2) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.3);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.7 + 5);
                        }
                    /* Si la différence de 1% : N2 = 60% et N1 = 40% */
                        else {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.4);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.6 + 5);
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

export { handlePowerRange_Neg50_To_Neg600_Service };
