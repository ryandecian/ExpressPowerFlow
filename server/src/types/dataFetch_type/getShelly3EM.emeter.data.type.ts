type GetShelly3EM_emeter_data_Type = {
    power: number, /* Puissance instantanée active (W) — positive = consommation, négative = injection */
    pf: number, /* Facteur de puissance (Power Factor) — proche de 1 = charge résistive, <1 = charge inductive/capacitive */
    current: number, /* Courant mesuré (A) sur la phase correspondante */
    voltage: number, /* Tension mesurée (V) entre phase et neutre */
    is_valid: boolean, /* Indique si les mesures de ce module sont valides (true = données fiables) */
    total: number, /* Énergie totale consommée (Wh) depuis la mise en service ou le dernier reset */
    total_returned: number /* Énergie totale réinjectée (Wh) vers le réseau depuis la mise en service ou le dernier reset */
}

export { GetShelly3EM_emeter_data_Type }
