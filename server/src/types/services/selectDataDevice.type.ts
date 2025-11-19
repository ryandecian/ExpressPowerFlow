/* Import des Types */
import type { SelectBattery_Type } from "./selectBattery.type.js";

type SelectDataDevice_Type = {
    shellyPro3EM_Data: number,
    shellyPrise_BatterieZSF2400AC_N1_Power: number,
    shellyPrise_BatterieZSF2400AC_N2_Power: number,
    selectBattery: SelectBattery_Type,
}

export type { SelectDataDevice_Type };
