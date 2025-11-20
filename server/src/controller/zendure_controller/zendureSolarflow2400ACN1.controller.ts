/* Import des Datas */
import { getMemory_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl1_Memory } from "../../database/data_memory/memory.data.memory.js";
import { setMemory_Lvl2_Memory } from "../../database/data_memory/memory.data.memory.js";

/* Import des Services : */
import { statusAC_dataOn_ZSF2400AC_N1_Service } from "../../services/zendureSolarflow2400ACN1_controller/statusAC_dataOn_ZSF2400AC_N1.service.js";
import { statusAC_dataOff_ZSF2400AC_N1_Service } from "../../services/zendureSolarflow2400ACN1_controller/statusAC_dataOff_ZSF2400AC_N1.service.js";

/* Import des Types : */
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";
import type { ZendureSolarflow2400AC_data_memory_Type } from "../../types/dataMemory_type/brut/zendureSolarflow2400AC.data.memory.type.js";
import type { ZendureSolarflow2400AC_Snapshot_Type } from "../../types/dataMemory_type/snapshot/zendureSolarflow2400AC.snapshot.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";
import { formulaTmp_ZSF2400AC } from "../../utils/temperature/formulaTmp_ZSF2400AC.utils.js";
import { get } from "http";

const ZENDURE_URL = "http://192.168.1.26/properties/report"

async function zendureSolarflow2400ACN1_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données de la Batterie Zendure Solarflow 2400 AC */
            const dataZendureResult = await fetch_Utils<GetZendureSolarflow2400AC_data_Type>("GET", ZENDURE_URL);

            /* Vérification si le fetch a échoué */
            if (typeof dataZendureResult.error === "string") {
                console.error("zendureSolarflow2400ACN1_Controller - Erreur de fetch :", dataZendureResult.error);

                /* Si les données ont déjà été initialisées en mémoire */
                    if (getMemory_Memory().zendureSolarflow2400AC_N1 !== null) {
                        setMemory_Lvl2_Memory("zendureSolarflow2400AC_N1", "status", false);
                    }
                return;
            }

            const dataZendure = dataZendureResult.data as GetZendureSolarflow2400AC_data_Type;

        /* Logique métier 2 : Préparation des données pour l'enregistrement */
            const dataSelected: ZendureSolarflow2400AC_Snapshot_Type = {
                ts: Date.now(),
                source: "Batterie Zendure Solarflow 2400AC N1",
                status: true,
                data: {
                    timestamp: dataZendure.timestamp,
                    sn: dataZendure.sn,
                    product: dataZendure.product,
                    properties: {
                        packInputPower: dataZendure.properties.packInputPower,
                        outputPackPower: dataZendure.properties.outputPackPower,
                        electricLevel: dataZendure.properties.electricLevel,
                        hyperTmp: formulaTmp_ZSF2400AC(dataZendure.properties.hyperTmp),
                        acStatus: dataZendure.properties.acStatus,
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
            };

        /* Logique métier 3 : Analyse des données et vérification si la batterie est oppérationnel */
            /* Si les données en mémoire existent et ne sont pas undefined */
                if (getMemory_Memory().zendureSolarflow2400AC_N1 !== null) {
                    dataSelected.status = statusAC_dataOn_ZSF2400AC_N1_Service(dataZendure);
                }
            /* Si les données en mémoire n'existent pas ou sont undefined */
                else {
                    dataSelected.status = statusAC_dataOff_ZSF2400AC_N1_Service(dataZendure);
                }


        
        /* Logique métier 4 : Enregistrement des données dans la mémoire */
            setMemory_Lvl1_Memory("zendureSolarflow2400AC_N1", dataSelected);

        /* Logique métier 5 : Récupération des données depuis la mémoire pour vérification */
            // const data = getZendureSolarflow2400AC_N1();

            // console.log(`Batterie Zendure entrée: ${data?.data.properties?.outputPackPower} W, sortie: ${data?.data.properties?.packInputPower} W`);
    }
    catch (error) {
        console.error("Erreur dans zendureSolarflow2400AC_Controller :", error);
    }
}

export { zendureSolarflow2400ACN1_Controller };
