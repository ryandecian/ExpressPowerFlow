/* Import des Types : */
import type { Shelly3EM_emeter_data_Type } from "../../types/dataFetch_type/shelly3EM.emeter.data.type.js";
import type { ZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/zendureSolarflow2400AC.data.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const SHELLY_URL = "http://192.168.1.23/emeter/0";
const ZENDURE_URL_POST = "http://192.168.1.26/properties/write";

async function shellyPower_Controller(): Promise<void> {
    try {
        const dataShelly = await fetch_Utils<Shelly3EM_emeter_data_Type>("GET", SHELLY_URL);
        const dataZendure = await fetch_Utils<ZendureSolarflow2400AC_data_Type>("POST", ZENDURE_URL_POST);
        // const response = await fetch(SHELLY_URL);
        // const data = (await response.json()) as Shelly3EM_emeter_data_Type;

        // const power = data?.power ?? 0;
        console.log(`Shelly = W / Zendure = W`);
    } catch (error) {
        console.error("Erreur lors de la lecture du Shelly :", error);
    }
}

export { shellyPower_Controller };
