type ShellyPro3EM_PhaseA_data_Type = {
    id: number;                 /* Identifiant de la phase (0 = L1, 1 = L2, 2 = L3) */
    voltage: number;            /* Tension instantanée de la phase (en volts, V) */
    current: number;            /* Courant instantané mesuré sur la phase (en ampères, A) */
    act_power: number;          /* Puissance active instantanée (en watts, W) — positive = consommation, négative = injection */
    aprt_power: number;         /* Puissance apparente instantanée (en voltampères, VA) */
    pf: number;                 /* Facteur de puissance (cos φ), valeur entre 0 et 1 */
    freq: number;               /* Fréquence du réseau (en hertz, Hz), généralement 50.0 Hz */
    calibration: string;        /* Type de calibration : "factory" (usine) ou "custom" (utilisateur) */
};
