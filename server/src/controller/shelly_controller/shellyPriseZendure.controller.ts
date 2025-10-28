/* Import des Datas */

/* Import des Types : */
import type { GetShellyPlugSGen3_data_Type } from "../../types/dataFetch_type/getShellyPlugSGen3.data.type.js";
import type { ShellyPlugSGen3_data_memory_Type } from "../../types/dataMemory_type/shellyPlugSGen3.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const ShellyPlugSGen3_Solarflow2400AC = "http://192.168.1.68/rpc/Shelly.GetStatus";

async function shellyPriseZendure_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPlugSGen3_data_Type>("GET", ShellyPlugSGen3_Solarflow2400AC);

            /* Vérification si le fetch a échoué */
            if (dataShellyResult.data == null) {
                console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);
                return;
            }

            const dataShelly = dataShellyResult.data as GetShellyPlugSGen3_data_Type;

            const dataSwitch = dataShelly["switch:0"];
        
        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: ShellyPlugSGen3_data_memory_Type = {
                output: dataSwitch.output,
                apower: dataSwitch.apower,
                voltage: dataSwitch.voltage,
                freq: dataSwitch.freq,
                current: dataSwitch.current,
            }
    }
    catch (error) {
        console.error("Erreur dans shellyPriseZendure_Controller :", error);
    }
}


export { shellyPriseZendure_Controller };
