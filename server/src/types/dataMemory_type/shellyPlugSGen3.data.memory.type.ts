type ShellyPlugSGen3_data_memory_Type = {
    "switch:0": {
        output: boolean; /* ⚠️ true si la prise est alimentée (ON) */
        apower: number; /* ⚠️ Puissance instantanée en watts (W) */
        voltage: number; /* ⚠️ Tension mesurée en volts (V) */
        freq: number; /* ⚠️ Fréquence du courant en hertz (Hz) */
        current: number; /* ⚠️ Courant mesuré en ampères (A) */
    }
};

export type { ShellyPlugSGen3_data_memory_Type };
