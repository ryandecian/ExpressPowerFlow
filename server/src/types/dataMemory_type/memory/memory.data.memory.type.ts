/* Import des Types */
import type { ShellyPro3EM_Snapshot_Type } from "../snapshot/shellyPro3EM.snapshot.type.js";
import type { ShellyPlugSGen3_Snapshot_Type } from "../snapshot/shellyPlugSGen3.snapshot.type.js";
import type { ZendureSolarflow2400AC_Snapshot_Type } from "../snapshot/zendureSolarflow2400AC.snapshot.type.js";

type Memory_Data_Memory_Type = {
    shellyPro3EM: ShellyPro3EM_Snapshot_Type | null;
    shellyPrise_BatterieZSF2400AC_N1: ShellyPlugSGen3_Snapshot_Type | null;
    shellyPrise_BatterieZSF2400AC_N2: ShellyPlugSGen3_Snapshot_Type | null;
    zendureSolarflow2400AC_N1: ZendureSolarflow2400AC_Snapshot_Type | null;
    zendureSolarflow2400AC_N2: ZendureSolarflow2400AC_Snapshot_Type | null;
};

export { Memory_Data_Memory_Type };
