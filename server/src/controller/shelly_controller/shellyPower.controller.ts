/* Import des Types : */
import type { Shelly3EM_emeter_data_Type } from "../../types/dataFetch_type/shelly3EM.emeter.data.type.js";

const SHELLY_URL = "http://192.168.1.23/emeter/0";

async function shellyPower_Controller(): Promise<void> {
    try {
        const response = await fetch(SHELLY_URL);
        const data = (await response.json()) as Shelly3EM_emeter_data_Type;

        const power = data?.power ?? 0;
        console.log(`🔌 Puissance actuelle : ${power} W`);
    } catch (error) {
        console.error("Erreur lors de la lecture du Shelly :", error);
    }
}

export { shellyPower_Controller };
