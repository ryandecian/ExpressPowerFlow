/* Import des Types */
import type { ZendureSolarflow2400AC_data_memory_Type } from "../brut/zendureSolarflow2400AC.data.memory.type.js";

type ZendureSolarflow2400AC_Snapshot_Type = {
    ts: number;                                      // Aligné sur ms ; converti depuis payload.timestamp (s)
    source: string;
    status: boolean;
    data: ZendureSolarflow2400AC_data_memory_Type;   // payload RAW complet Zendure
};

export { ZendureSolarflow2400AC_Snapshot_Type };
