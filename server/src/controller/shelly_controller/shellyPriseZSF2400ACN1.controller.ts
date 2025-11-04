/* Import des Datas */
import { getShellyPrise_BatterieZSF2400AC_N1 } from "../../database/data_memory/memory.data.js";
import { setShellyPrise_BatterieZSF2400AC_N1 } from "../../database/data_memory/memory.data.js";
import { statusShellyPrise_BatterieZSF2400AC_N1 } from "../../database/data_memory/memory.data.js";

/* Import des Types : */
import type { GetShellyPlugSGen3_data_Type } from "../../types/dataFetch_type/getShellyPlugSGen3.data.type.js";
import type { ShellyPlugSGen3_data_memory_Type } from "../../types/dataMemory_type/shellyPlugSGen3.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const shellyPrise_N1_URL_GET = "http://192.168.1.68/rpc/Shelly.GetStatus";

async function shellyPriseZSF2400ACN1_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPlugSGen3_data_Type>("GET", shellyPrise_N1_URL_GET);

            /* Vérification si le fetch a échoué */
            if (dataShellyResult.data == null) {
                console.error("Erreur de fetch de shellyPriseZSF2400ACN1_Controller :", dataShellyResult.error);
                statusShellyPrise_BatterieZSF2400AC_N1(false);
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
            setShellyPrise_BatterieZSF2400AC_N1(dataSelected, status);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            const data = getShellyPrise_BatterieZSF2400AC_N1();

            console.log(`Compteur Shelly Plug S Gen 3 de la batterie Zendure Solarflow 2400AC N1 : ${data?.data.apower} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPriseZSF2400ACN1_Controller :", error);
    }
}


export { shellyPriseZSF2400ACN1_Controller };
