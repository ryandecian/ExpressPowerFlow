/* Import des Datas */
import { setShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot } from "../../database/data_memory/memory.data.js";
import { statusShellyPlugSGen3_BatterieZSF2400AC_1 } from "../../database/data_memory/memory.data.js";
import { getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot } from "../../database/data_memory/memory.data.js";

/* Import des Types : */
import type { GetShellyPlugSGen3_data_Type } from "../../types/dataFetch_type/getShellyPlugSGen3.data.type.js";
import type { ShellyPlugSGen3_data_memory_Type } from "../../types/dataMemory_type/shellyPlugSGen3.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const ShellyPlugSGen3_Solarflow2400AC = "http://192.168.1.68/rpc/Shelly.GetStatus";

async function shellyPriseZSF2400ACN1_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPlugSGen3_data_Type>("GET", ShellyPlugSGen3_Solarflow2400AC);

            /* Vérification si le fetch a échoué */
            if (dataShellyResult.data == null) {
                console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);
                statusShellyPlugSGen3_BatterieZSF2400AC_1(false);
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

            const status = true;
    
        /* Logique métier 3 : Enregistrement des données dans la mémoire */
            setShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot(dataSelected, status);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            const data = getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot();

            console.log(`Compteur Shelly Plug S Gen 3 : ${data?.data.apower} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPriseZendure_Controller :", error);
    }
}


export { shellyPriseZSF2400ACN1_Controller };
