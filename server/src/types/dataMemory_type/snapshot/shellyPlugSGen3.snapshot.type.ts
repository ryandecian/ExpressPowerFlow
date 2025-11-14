/* Import des Types */
import type { ShellyPlugSGen3_data_memory_Type } from "../brut/shellyPlugSGen3.data.memory.type.js";

type ShellyPlugSGen3_Snapshot_Type = {
    ts: number;                                      // Date.now() (ms)
    source: string;
    status: boolean;
    data: ShellyPlugSGen3_data_memory_Type;         // payload RAW complet Shelly
};

export { ShellyPlugSGen3_Snapshot_Type };
