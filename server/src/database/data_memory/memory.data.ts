/* Import des Types : */
import type { Shelly3EM_emeter_data_Type } from "../../types/dataFetch_type/shelly3EM.emeter.data.type.js";
import type { ZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/zendureSolarflow2400AC.data.type.js";

type DataState = {
    shelly3EM?: Shelly3EM_emeter_data_Type;
    zendureSolarflow2400AC?: ZendureSolarflow2400AC_data_Type;
};

/* État module-scopé (singleton via cache des modules) */
const stateMemory: DataState = {};

/* ------- Setters ------- */
function setShellyPower(power: number, phase?: 1 | 2 | 3): void {
    stateMemory.shelly3EM = { ts: Date.now(), power, source: "shelly", phase };
}

function setZendurePower(power: number): void {
    stateMemory.zendureSolarflow2400AC = { ts: Date.now(), power, source: "zendure" };
}

/* ------- Getters (copies immuables) ------- */
function getShellyPower(): Shelly3EM_emeter_data_Type | undefined {
    return stateMemory.shelly3EM ? { ...stateMemory.shelly3EM } : undefined;
}

function getZendurePower(): ZendureSolarflow2400AC_data_Type | undefined {
    return stateMemory.zendureSolarflow2400AC ? { ...stateMemory.zendureSolarflow2400AC } : undefined;
}

/* ------- Utils ------- */
function ageMsOf(key: keyof DataState): number | undefined {
    const snap = stateMemory[key];
    return snap ? Date.now() - snap.ts : undefined;
}

function toJSON(): DataState {
    return {
        shelly3EM: stateMemory.shelly3EM ? { ...stateMemory.shelly3EM } : undefined,
        zendureSolarflow2400AC: stateMemory.zendureSolarflow2400AC ? { ...stateMemory.zendureSolarflow2400AC } : undefined,
    };
}

function resetStore(): void {
    stateMemory.shelly3EM = undefined;
    stateMemory.zendureSolarflow2400AC = undefined;
}

export {
    setShellyPower,
    setZendurePower,
    getShellyPower,
    getZendurePower,
    ageMsOf,
    toJSON,
    resetStore,
};
export type { PowerSnapshot, DataState };
