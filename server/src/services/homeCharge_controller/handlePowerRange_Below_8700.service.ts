/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* Utilisé lors de la charge des batteries si la puissance mesurée par le compteur shelly est inférieure ou égale à 8700w */
function handlePowerRange_Below_8700(
    body: BodyRequestHomeController_Type, 
    shellyPower: number, 
    selectBattery: SelectBattery_Type, 
    shellyPrise_BatterieZSF2400AC_N1_Power: number, 
    shellyPrise_BatterieZSF2400AC_N2_Power: number
): BodyRequestHomeController_Type {}


export { handlePowerRange_Below_8700 };
