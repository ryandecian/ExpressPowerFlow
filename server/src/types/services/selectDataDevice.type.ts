/* Import des Types */
import type { SelectBattery_Type } from "./selectBattery.type.js";
import type { ShellyPro3EM_Snapshot } from "../../database/data_memory/memory.data.memory.js";
import type { ShellyPlugSGen3_Snapshot } from "../../database/data_memory/memory.data.memory.js";

type SelectDataDevice_Type = {
    shellyPro3EM_Data: ShellyPro3EM_Snapshot,
    shellyPrise_BatterieZSF2400AC_N1_Data: ShellyPlugSGen3_Snapshot | undefined,
    shellyPrise_BatterieZSF2400AC_N2_Data: ShellyPlugSGen3_Snapshot | undefined,
    selectBattery: SelectBattery_Type,
}

export type { SelectDataDevice_Type };
