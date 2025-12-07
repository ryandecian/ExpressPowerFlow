/* Import des Datas */
import { getMemory_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl1_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl2_Memory } from "../../database/data_memory/memory.data.memory.js";
/* Import des Datas */
import { setSystemOverview_Memory } from "../../database/data_memory/systemOverview.data.memory.js";
/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";
const SHELLY_URL = "http://192.168.1.85/rpc/EM1.GetStatus?id=0";
async function shellyPro3EM_Controller() {
    try {
        /* Logique métier 1 : Récupération des données du compteur */
        const dataShellyResult = await fetch_Utils("GET", SHELLY_URL);
        /* Vérification si le fetch a échoué */
        if (typeof dataShellyResult.error === "string") {
            console.error("shellyPower_Controller - Erreur de fetch :", dataShellyResult.error);
            /* Si les données ont déjà été initialisées en mémoire */
            if (getMemory_Memory().shellyPro3EM !== null) {
                setMemory_Lvl2_Memory("shellyPro3EM", "status", false);
            }
            return;
        }
        const dataShelly = dataShellyResult.data;
        /* Logique métier 2 : Préparation des données pour l'enregistrement */
        const dataSelected = {
            ts: Date.now(),
            source: "Compteur Shelly Pro 3EM",
            status: true,
            data: {
                voltage: dataShelly.voltage,
                current: dataShelly.current,
                act_power: dataShelly.act_power,
                aprt_power: dataShelly.aprt_power,
                pf: dataShelly.pf,
            }
        };
        /* Logique métier 3 : Enregistrement des données dans la mémoire */
        setMemory_Lvl1_Memory("shellyPro3EM", dataSelected);
        setSystemOverview_Memory("edfPower", dataSelected.data.act_power);
        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
        // const power: number = getMemory_Memory().shellyPro3EM!.data.act_power;
        // console.log(`Compteur Shelly Pro 3EM : ${data?.data.act_power} W`);
    }
    catch (error) {
        console.error("Erreur dans shellyPro3EM_Controller :", error);
    }
}
export { shellyPro3EM_Controller };
