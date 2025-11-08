/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* targetPower compris entre 50 et 600w de charge */
function handlePowerRange_50_To_600_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            /* Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 - 5);
                }
            /* Cas 2 : La batterie N1 a un niveau de charge plus bas que la batterie N2 */
                else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel < selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                    /* Si la différence de % est de 5 ou plus la batterie prend tout le travail */
                        if (deltaElectricLevel >= 5) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
                        }
                    /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                        else if (deltaElectricLevel === 4) {
                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.9);
                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.1 - 5);
                        }
                }
        }

    return body;
}

export { handlePowerRange_50_To_600_Service };
