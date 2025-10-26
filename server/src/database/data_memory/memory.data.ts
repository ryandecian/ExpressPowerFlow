/* Import des Types : */
import type { Shelly3EM_emeter_data_Type } from "../../types/dataFetch_type/shelly3EM.emeter.data.type.js";

type PowerSnapshot = {
    ts: number;                         // Date.now()
    power: number;                      // en watts
    source: "shelly" | "zendure";       // origine de la mesure
    phase?: 1 | 2 | 3;                  // optionnel (ex: 3EM)
};

type DataState = {
    shelly3EM?: Shelly3EM_emeter_data_Type;
    zendure?: PowerSnapshot;            // dernière mesure Zendure (si tu l'ajoutes plus tard)
};

/* État module-scopé (singleton via cache des modules) */
const state: DataState = {};

/* ------- Setters ------- */
function setShellyPower(power: number, phase?: 1 | 2 | 3): void {
    state.shelly3EM = { ts: Date.now(), power, source: "shelly", phase };
}

function setZendurePower(power: number): void {
    state.zendure = { ts: Date.now(), power, source: "zendure" };
}

/* ------- Getters (copies immuables) ------- */
function getShellyPower(): Shelly3EM_emeter_data_Type | undefined {
    return state.shelly3EM ? { ...state.shelly3EM } : undefined;
}

function getZendurePower(): PowerSnapshot | undefined {
    return state.zendure ? { ...state.zendure } : undefined;
}

/* ------- Utils ------- */
function ageMsOf(key: keyof DataState): number | undefined {
    const snap = state[key];
    return snap ? Date.now() - snap.ts : undefined;
}

function toJSON(): DataState {
    return {
        shelly3EM: state.shelly3EM ? { ...state.shelly3EM } : undefined,
        zendure: state.zendure ? { ...state.zendure } : undefined,
    };
}

function resetStore(): void {
    state.shelly3EM = undefined;
    state.zendure = undefined;
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
