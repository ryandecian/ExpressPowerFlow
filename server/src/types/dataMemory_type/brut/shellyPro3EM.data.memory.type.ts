type ShellyPro3EM_data_memory_Type = {
    voltage: number, /* Tension instantanée de la phase (en volts, V) */
    current: number, /* Courant instantané mesuré sur la phase (en ampères, A) */
    act_power: number, /* Puissance active instantanée (en watts, W) — positive = consommation, négative = injection */
    aprt_power: number, /* Puissance apparente instantanée (en voltampères, VA) */
    pf: number, /* Facteur de puissance (cos φ), valeur entre 0 et 1 */
}

export { ShellyPro3EM_data_memory_Type }
