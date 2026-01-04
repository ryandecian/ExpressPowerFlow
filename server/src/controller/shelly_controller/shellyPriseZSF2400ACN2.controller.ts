/* Import des Datas */
import { getMemory_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl1_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl2_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setSystemOverview_Battery_Memory } from "../../database/data_memory/systemOverview.data.memory.js";

/* Import des Types : */
import type { GetShellyPlugSGen3_data_Type } from "../../types/dataFetch_type/getShellyPlugSGen3.data.type.js";
import type { ShellyPlugSGen3_Snapshot_Type } from "../../types/dataMemory_type/snapshot/shellyPlugSGen3.snapshot.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const shellyPrise_N2_URL_GET = "http://192.168.1.84/rpc/Shelly.GetStatus";

async function shellyPriseZSF2400ACN2_Controller(): Promise<void> {
    try {
        const start = Date.now();
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPlugSGen3_data_Type>("GET", shellyPrise_N2_URL_GET);

            /* Vérification si le fetch a échoué */
            if (typeof dataShellyResult.error === "string") {
                console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);

                /* Si les données ont déjà été initialisées en mémoire */
                    if (getMemory_Memory().shellyPrise_BatterieZSF2400AC_N2 !== null) {
                        setMemory_Lvl2_Memory("shellyPrise_BatterieZSF2400AC_N2", "status", false);
                    }
                return;
            }

            const dataShelly = dataShellyResult.data as GetShellyPlugSGen3_data_Type;

            const dataSwitch = dataShelly["switch:0"];
        
        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: ShellyPlugSGen3_Snapshot_Type = {
                ts: Date.now(),
                source: "Prise Shelly ZSF2400AC N2",
                status: true,
                data: {
                    output: dataSwitch.output,
                    apower: dataSwitch.apower,
                    voltage: dataSwitch.voltage,
                    freq: dataSwitch.freq,
                    current: dataSwitch.current,
                }
            }
    
        /* Logique métier 3 : Enregistrement des données dans la mémoire */
            setMemory_Lvl1_Memory("shellyPrise_BatterieZSF2400AC_N2", dataSelected);
            setSystemOverview_Battery_Memory("zendureSolarflow2400AC_N2", "powerFlow" , dataSelected.data.apower);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            // const data = getShellyPrise_BatterieZSF2400AC_N2();

            // console.log(`Compteur Shelly Plug S Gen 3 de la batterie Zendure Solarflow 2400AC N2 : ${data?.data.apower} W`);
        const end = Date.now();
        console.log(`[shellyPriseZSF2400ACN2_Controller] - Durée d'exécution : ${end - start} ms`);
    }
    catch (error) {
        console.error("Erreur dans shellyPriseZSF2400ACN2_Controller :", error);
    }
}

export { shellyPriseZSF2400ACN2_Controller };
