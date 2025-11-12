/* Import des Types */
import type { SystemOverview_Data_Memory_Type } from "../../types/dataMemory_type/systemOverview.data.memory.type.js";

/* Etat global (singleton via cache des modules) */
type DataState = {
    systemOverview?: SystemOverview_Data_Memory_Type;
};

/* Instance mémoire initialisée */
const stateMemory: DataState = {
    systemOverview: {
        homePower: null,
        edfPower: null,
        solarPower: null,
        batteryPower: null,
        dataBattery: {
            zendureSolarflow2400AC_N1: {
                sn: null,
                status: false,
                gridState: false,
                hyperTmp: null,
                electricLevel: null,
                BatVolt: null,
                powerFlow: null,
                maxSoc: null,
                minSoc: null,
            },
            zendureSolarflow2400AC_N2: {
                sn: null,
                status: false,
                gridState: false,
                hyperTmp: null,
                electricLevel: null,
                BatVolt: null,
                powerFlow: null,
                maxSoc: null,
                minSoc: null,
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

/* Met à jour une clé du 2ᵉ niveau (batterie N2) */
function setSystemOverview_BatteryN1_Memory<
    K extends keyof SystemOverview_Data_Memory_Type["dataBattery"]["zendureSolarflow2400AC_N1"]
>(
    key: K,
    value: SystemOverview_Data_Memory_Type["dataBattery"]["zendureSolarflow2400AC_N1"][K]
): void {
    stateMemory.systemOverview!.dataBattery.zendureSolarflow2400AC_N1[key] = value;
}

/* Met à jour une clé du 2ᵉ niveau (batterie N2) */
function setSystemOverview_BatteryN2_Memory<
    K extends keyof SystemOverview_Data_Memory_Type["dataBattery"]["zendureSolarflow2400AC_N2"]
>(
    key: K,
    value: SystemOverview_Data_Memory_Type["dataBattery"]["zendureSolarflow2400AC_N2"][K]
): void {
    stateMemory.systemOverview!.dataBattery.zendureSolarflow2400AC_N2[key] = value;
}

/* ------------- Getters (copies immuables) ------------- */
function getSystemOverview_Memory(): SystemOverview_Data_Memory_Type {
    return structuredClone(stateMemory.systemOverview!);
}

export {
    /* setters */
    setSystemOverview_Memory,
    setSystemOverview_BatteryN1_Memory,
    setSystemOverview_BatteryN2_Memory,
    /* getters */
    getSystemOverview_Memory,
};
