/* Import des Types */
import type { SystemOverview_Data_Memory_Type } from "../../types/dataMemory_type/memory/systemOverview.data.memory.type.js";

/* Etat global (singleton via cache des modules) */
type DataState = {
    systemOverview?: SystemOverview_Data_Memory_Type;
};

/* Instance mémoire initialisée */
const stateMemory: DataState = {
    systemOverview: {
        homePower: null, /* home_Controller */
        edfPower: null, /* shellyPro3EM_Controller */
        solarPower: null, /* shellyPriseSolar_Controller */
        batteryPower: null,
        dataBattery: {
            zendureSolarflow2400AC_N1: {
                sn: null, /* zendureSolarflow2400ACN1_Controller */
                status: false, /* zendureSolarflow2400ACN1_Controller */
                gridState: false, /* zendureSolarflow2400ACN1_Controller */
                hyperTmp: null, /* zendureSolarflow2400ACN1_Controller */
                electricLevel: null, /* zendureSolarflow2400ACN1_Controller */
                BatVolt: null, /* zendureSolarflow2400ACN1_Controller */
                powerFlow: null, /* shellyPriseZSF2400ACN1_Controller */
                maxSoc: null, /* zendureSolarflow2400ACN1_Controller */
                minSoc: null, /* zendureSolarflow2400ACN1_Controller */
            },
            zendureSolarflow2400AC_N2: {
                sn: null, /* zendureSolarflow2400ACN2_Controller */
                status: false, /* zendureSolarflow2400ACN2_Controller */
                gridState: false, /* zendureSolarflow2400ACN2_Controller */
                hyperTmp: null, /* zendureSolarflow2400ACN2_Controller */
                electricLevel: null, /* zendureSolarflow2400ACN2_Controller */
                BatVolt: null, /* zendureSolarflow2400ACN2_Controller */
                powerFlow: null, /* shellyPriseZSF2400ACN2_Controller */
                maxSoc: null, /* zendureSolarflow2400ACN2_Controller */
                minSoc: null, /* zendureSolarflow2400ACN2_Controller */
            },
        },
    },
};

/* ------------- Setters (Écriture) ------------- */
/* Met à jour une clé du 1er niveau */
function setSystemOverview_Memory<K extends keyof SystemOverview_Data_Memory_Type>(
    key: K,
    value: SystemOverview_Data_Memory_Type[K]
): void {
    if (!stateMemory.systemOverview) return;
    stateMemory.systemOverview[key] = value;
}
/* Exemple d'utilisation :  */
/* setSystemOverview_Memory("homePower", 100) */

type BatteryKey = keyof SystemOverview_Data_Memory_Type["dataBattery"];

function setSystemOverview_Battery_Memory<
    B extends BatteryKey,
    K extends keyof SystemOverview_Data_Memory_Type["dataBattery"][B]
>(
    batteryId: B, // "zendureSolarflow2400AC_N1" ou "zendureSolarflow2400AC_N2"
    key: K,
    value: SystemOverview_Data_Memory_Type["dataBattery"][B][K]
): void {
    if (!stateMemory.systemOverview) return;
    
    stateMemory.systemOverview.dataBattery[batteryId][key] = value;
}

/* Exemple d'utilisation :  */
/* setSystemOverview_Memory("zendureSolarflow2400AC_N1", "status", true) */

/* ------------- Getters (copies immuables) ------------- */
function getSystemOverview_Memory(): SystemOverview_Data_Memory_Type {
    return structuredClone(stateMemory.systemOverview!);
}

export {
    /* setters */
    setSystemOverview_Memory,
    setSystemOverview_Battery_Memory,
    /* getters */
    getSystemOverview_Memory,
};
