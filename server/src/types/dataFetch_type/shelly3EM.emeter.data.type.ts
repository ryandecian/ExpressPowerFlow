type Shelly3EM_emeter_data_Type = {
    power: number;
    pf: number;
    current: number;
    voltage: number;
    is_valid: boolean;
    total: number;
    total_returned: number;
};

export { Shelly3EM_emeter_data_Type };
