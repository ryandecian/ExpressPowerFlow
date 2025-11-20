/* Import des Datas */
import { setSystemOverview_Memory } from "../../database/data_memory/systemOverview.data.memory.js";

/* Import des Types : */
import type { GetShellyPlugSGen3_data_Type } from "../../types/dataFetch_type/getShellyPlugSGen3.data.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const shellyPrise_N2_URL_GET = "http://192.168.1.72/rpc/Shelly.GetStatus";

async function shellyPriseSolar_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPlugSGen3_data_Type>("GET", shellyPrise_N2_URL_GET);

            /* Vérification si le fetch a échoué */
            if (typeof dataShellyResult.error === "string") {
                console.error("shellyPriseSolar_Controller - Erreur de fetch :", dataShellyResult.error);
                return;
            }

            const dataShelly = dataShellyResult.data as GetShellyPlugSGen3_data_Type;

            const dataSwitch = dataShelly["switch:0"];
    
        /* Logique métier 2 : Enregistrement des données dans la mémoire */
            setSystemOverview_Memory("solarPower", dataSwitch.apower);

        /* Logique métier 3 : Récupération des données depuis la mémoire pour vérification */
            // const data = getShellyPrise_BatterieZSF2400AC_N2();

            // console.log(`Compteur Shelly Plug S Gen 3 de la batterie Zendure Solarflow 2400AC N2 : ${data?.data.apower} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPriseSolar_Controller :", error);
    }
}

export { shellyPriseSolar_Controller };
