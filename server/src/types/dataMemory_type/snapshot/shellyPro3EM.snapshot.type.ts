/* Import des Types */
import type { ShellyPro3EM_data_memory_Type } from "../brut/shellyPro3EM.data.memory.type.js";

type ShellyPro3EM_Snapshot = {
    ts: number; /* Date.now() (ms) */
    source: "Compteur Shelly Pro 3EM";
    status: boolean;
    data: ShellyPro3EM_data_memory_Type; /* payload RAW complet Shelly */
};

export { ShellyPro3EM_Snapshot };
