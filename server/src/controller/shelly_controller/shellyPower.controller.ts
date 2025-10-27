/* Import des Datas */
import { setShelly3EMSnapshot } from "../../database/data_memory/memory.data.js";
import { getShelly3EMSnapshot } from "../../database/data_memory/memory.data.js";

/* Import des Types : */
import type { GetShelly3EM_emeter_data_Type } from "../../types/dataFetch_type/getShelly3EM.emeter.data.type.js";
import type { Shelly3EM_data_memory_Type } from "../../types/dataMemory_type/shelly3EM.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const SHELLY_URL = "http://192.168.1.23/emeter/0";

async function shellyPower_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShelly3EM_emeter_data_Type>("GET", SHELLY_URL);

            /* Vérification si le fetch a échoué */
            if (typeof dataShellyResult.error === "string") {
                console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);
            }

            const dataShelly = dataShellyResult.data as GetShelly3EM_emeter_data_Type;

        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: Shelly3EM_data_memory_Type = {
                power: dataShelly.power,
                pf: dataShelly.pf,
                current: dataShelly.current,
                voltage: dataShelly.voltage,
            }

        /* Logique métier 3 : Enregistrement des données dans la mémoire */
            setShelly3EMSnapshot(dataSelected);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            const data = getShelly3EMSnapshot();

            console.log(`Compteur Shelly 3EM : ${data?.data.power} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPower_Controller :", error);
    }
}

export { shellyPower_Controller };
