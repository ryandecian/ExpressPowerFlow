type Shelly3EM_data_memory_Type = {
    power: number, /* Puissance instantanée active (W) — positive = consommation, négative = injection */
    pf: number, /* Facteur de puissance (Power Factor) — proche de 1 = charge résistive, <1 = charge inductive/capacitive */
    current: number, /* Courant mesuré (A) sur la phase correspondante */
    voltage: number, /* Tension mesurée (V) entre phase et neutre */
}

export { Shelly3EM_data_memory_Type }
