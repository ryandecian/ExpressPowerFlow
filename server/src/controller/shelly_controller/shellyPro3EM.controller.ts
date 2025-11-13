/* Import des Datas */
import { getShellyPro3EM } from "../../database/data_memory/memory.data.memory.js";
import { setShellyPro3EM } from "../../database/data_memory/memory.data.memory.js";
import { statusShellyPro3EM } from "../../database/data_memory/memory.data.memory.js";

/* Import des Types : */
import type { GetShellyPro3EM_PhaseA_data_Type } from "../../types/dataFetch_type/getShellyPro3EM.phaseA.data.type.js";
import type { ShellyPro3EM_data_memory_Type } from "../../types/dataMemory_type/brut/shellyPro3EM.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const SHELLY_URL = "http://192.168.1.85/rpc/EM1.GetStatus?id=0";

async function shellyPro3EM_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
            const dataShellyResult = await fetch_Utils<GetShellyPro3EM_PhaseA_data_Type>("GET", SHELLY_URL);

            /* Vérification si le fetch a échoué */
            if (typeof dataShellyResult.error === "string") {
                console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);
                statusShellyPro3EM(false);
                return;
            }

            const dataShelly = dataShellyResult.data as GetShellyPro3EM_PhaseA_data_Type;

        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: ShellyPro3EM_data_memory_Type = {
                voltage: dataShelly.voltage,
                current: dataShelly.current,
                act_power: dataShelly.act_power,
                aprt_power: dataShelly.aprt_power,
                pf: dataShelly.pf,
            };
            const status = true;

        /* Logique métier 3 : Enregistrement des données dans la mémoire */
            setShellyPro3EM(dataSelected, status);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            const data = getShellyPro3EM();

            // console.log(`Compteur Shelly Pro 3EM : ${data?.data.act_power} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPro3EM_Controller :", error);
    }
}

export { shellyPro3EM_Controller };
