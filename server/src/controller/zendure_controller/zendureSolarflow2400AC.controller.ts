/* Import des Datas */
import { setZendureSolarflow2400AC_1_Snapshot } from "../../database/data_memory/memory.data.js";
import { statusZendureSolarflow2400AC_1 } from "../../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_1_Snapshot } from "../../database/data_memory/memory.data.js";

/* Import des Types : */
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";
import type { ZendureSolarflow2400AC_data_memory_Type } from "../../types/dataMemory_type/zendureSolarflow2400AC.data.memory.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const ZENDURE_URL = "http://192.168.1.26/properties/report"

async function zendureSolarflow2400AC_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données de la Batterie Zendure Solarflow 2400 AC */
            const dataZendureResult = await fetch_Utils<GetZendureSolarflow2400AC_data_Type>("GET", ZENDURE_URL);

            /* Vérification si le fetch a échoué */
            if (dataZendureResult.data == null) {
                console.error("Erreur dans la récupération des données de la Batterie Zendure Solarflow 2400 AC :", dataZendureResult.error);
                statusZendureSolarflow2400AC_1(false);
                return;
            }

            const dataZendure = dataZendureResult.data as GetZendureSolarflow2400AC_data_Type;

        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: ZendureSolarflow2400AC_data_memory_Type = {
                timestamp: dataZendure.timestamp,
                sn: dataZendure.sn,
                product: dataZendure.product,
                properties: {
                    packInputPower: dataZendure.properties.packInputPower,
                    outputPackPower: dataZendure.properties.outputPackPower,
                    electricLevel: dataZendure.properties.electricLevel,
                    hyperTmp: dataZendure.properties.hyperTmp,
                    gridState: dataZendure.properties.gridState,
                    BatVolt: dataZendure.properties.BatVolt,
                    acMode: dataZendure.properties.acMode,
                    inputLimit: dataZendure.properties.inputLimit,
                    outputLimit: dataZendure.properties.outputLimit,
                    socSet: dataZendure.properties.socSet,
                    minSoc: dataZendure.properties.minSoc,
                },
                packData: [
                    {
                        sn: dataZendure.packData[0].sn,
                        socLevel: dataZendure.packData[0].socLevel,
                        state: dataZendure.packData[0].state,
                        totalVol: dataZendure.packData[0].totalVol,
                    },
                    {
                        sn: dataZendure.packData[1].sn,
                        socLevel: dataZendure.packData[1].socLevel,
                        state: dataZendure.packData[1].state,
                        totalVol: dataZendure.packData[1].totalVol,
                    },
                ],
            }

            const status = true;
        
        /* Logique métier 3 : Enregistrement des données dans la mémoire */
            setZendureSolarflow2400AC_1_Snapshot(dataSelected, status);

        /* Logique métier 4 : Récupération des données depuis la mémoire pour vérification */
            const data = getZendureSolarflow2400AC_1_Snapshot();

            console.log(`Batterie Zendure entrée: ${data?.data.properties?.outputPackPower} W, sortie: ${data?.data.properties?.packInputPower} W`);
    }
    catch (error) {
        console.error("Erreur dans zendureSolarflow2400AC_Controller :", error);
    }
}

export { zendureSolarflow2400AC_Controller };
