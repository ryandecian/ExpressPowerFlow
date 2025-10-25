/* Import des dépendances */

const SHELLY_URL = "http://192.168.1.23/emeter/0";

type DataShellyPower = {
    power: number;
    pf: number;
    current: number;
    voltage: number;
    is_valid: boolean;
    total: number;
    total_returned: number;
};

async function shellyPower_Controller(): Promise<void> {
    try {
        const response = await fetch(SHELLY_URL);
        const data = (await response.json()) as DataShellyPower;

        const power = data?.power ?? 0;
        console.log(`🔌 Puissance actuelle : ${power} W`);
    } catch (error) {
        console.error("Erreur lors de la lecture du Shelly :", error);
    }
}

export { shellyPower_Controller };
