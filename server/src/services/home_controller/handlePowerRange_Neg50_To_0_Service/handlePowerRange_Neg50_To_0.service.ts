/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* targetPower compris entre -50 et -1w de charge */
function handlePowerRange_0_To_50_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles on décharge la batterie avec le niveau de charge le plus haut */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            /* Si la batterie N1 a un niveau de charge plus élevé que la batterie 2, c'est lui qui va travailler */
                if (selectBattery.zendureSolarflow2400AC_N1.electricLevel >= selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
                }
            /* Si la batterie N2 a un niveau de charge plus élevé que la batterie N1, c'est lui qui va travailler */
                else {
                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 5);
                }
        }
    /* Si seul la batterie N1 est disponible */
        else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
        }
    /* Si seul la batterie N2 est disponible */
        else {
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 5);
        }

    return body;
}

export { handlePowerRange_0_To_50_Service };
