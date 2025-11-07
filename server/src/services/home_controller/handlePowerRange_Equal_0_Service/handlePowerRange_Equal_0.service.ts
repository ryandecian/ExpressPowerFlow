/* Import des Types : */
import type { BodyRequestChargeZSF2400AC_Type } from "../../../types/bodyRequestZSF2400AC_type/bodyRequestChargeZSF2400AC.type.js";
import type { BodyRequestDischargeZSF2400AC_Type } from "../../../types/bodyRequestZSF2400AC_type/bodyRequestDischargeZSF2400AC.type.js";
import type { BodyRequestHomeController_Type } from "../../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

function handlePowerRange_Equal_0_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, targetPower: number): BodyRequestHomeController_Type {
    /* Si les 2 batteries sont disponibles */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0); /* Commande pour mise en veille */
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
        }
    /* Si seul la batterie 1 est disponible */
        else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0); /* Commande pour mise en veille */
        }
    /* Si seul la batterie 2 est disponible */
        else {
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0); /* Commande pour mise en veille */
        }
    
    return body;
}

export { handlePowerRange_Equal_0_Service };
