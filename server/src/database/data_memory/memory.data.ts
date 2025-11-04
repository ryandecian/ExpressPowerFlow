/* Import des Types (RAW, tels que renvoyés par tes devices) : */
import type { Shelly3EM_data_memory_Type } from "../../types/dataMemory_type/shelly3EM.data.memory.type.js";
import type { ShellyPlugSGen3_data_memory_Type } from "../../types/dataMemory_type/shellyPlugSGen3.data.memory.type.js";
import type { ZendureSolarflow2400AC_data_memory_Type } from "../../types/dataMemory_type/zendureSolarflow2400AC.data.memory.type.js";

/* -------------------------------
   Snapshots mémoires uniformisés
   ------------------------------- */
type Shelly3EM_Snapshot = {
    ts: number;                                      // Date.now() (ms)
    source: "Compteur Shelly 3EM";
    status: boolean;
    data: Shelly3EM_data_memory_Type;                // payload RAW complet Shelly
};

type ShellyPlugSGen3_Snapshot = {
    ts: number;                                      // Date.now() (ms)
    source: "Prise Shelly Plug S Gen3 Batterie Zendure Solarflow 2400AC";
    status: boolean;
    data: ShellyPlugSGen3_data_memory_Type;         // payload RAW complet Shelly
};

type ZendureSolarflow2400AC_Snapshot = {
    ts: number;                                      // Aligné sur ms ; converti depuis payload.timestamp (s)
    source: "Batterie Zendure Solarflow 2400AC";
    status: boolean;
    data: ZendureSolarflow2400AC_data_memory_Type;   // payload RAW complet Zendure
};

/* Etat global (singleton via cache des modules) */
type DataState = {
    shelly3EM?: Shelly3EM_Snapshot;
    shellyPrise_BatterieZSF2400AC_N1?: ShellyPlugSGen3_Snapshot;
    shellyPrise_BatterieZSF2400AC_N2?: ShellyPlugSGen3_Snapshot;
    zendureSolarflow2400AC_N1?: ZendureSolarflow2400AC_Snapshot;
    zendureSolarflow2400AC_N2?: ZendureSolarflow2400AC_Snapshot;
};

const stateMemory: DataState = {};

/* ------------- Setters (Écriture) ------------- */
/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShelly3EM(raw: Shelly3EM_data_memory_Type, status: boolean): void {
    stateMemory.shelly3EM = {
        ts: Date.now(),
        source: "Compteur Shelly 3EM",
        status,
        data: { ...raw },
    };
}

/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShellyPrise_BatterieZSF2400AC_N1(raw: ShellyPlugSGen3_data_memory_Type, status: boolean): void {
    stateMemory.shellyPrise_BatterieZSF2400AC_N1 = {
        ts: Date.now(),
        source: "Prise Shelly Plug S Gen3 Batterie Zendure Solarflow 2400AC",
        status,
        data: { ...raw },
    };
}

/**
 * Enregistre le dernier snapshot Zendure (RAW + métadonnées).
 * Note: payload.timestamp est en secondes → ts converti en millisecondes.
 */
function setZendureSolarflow2400AC_N1(raw: ZendureSolarflow2400AC_data_memory_Type, status: boolean): void {
    const hasNumericTs = typeof raw.timestamp === "number" && Number.isFinite(raw.timestamp);
    const tsMs = hasNumericTs ? raw.timestamp * 1000 : Date.now();

    stateMemory.zendureSolarflow2400AC_N1 = {
        ts: tsMs,
        source: "Batterie Zendure Solarflow 2400AC",
        status,
        data: { ...raw },
    };
}

/* ------------- Status  ------------- */
function statusShelly3EM(status: boolean): void {
    if (stateMemory.shelly3EM) {
        stateMemory.shelly3EM.status = status;
    }
}

function statusShellyPrise_BatterieZSF2400AC_N1(status: boolean): void {
    if (stateMemory.shellyPrise_BatterieZSF2400AC_N1) {
        stateMemory.shellyPrise_BatterieZSF2400AC_N1.status = status;
    }
}

function statusZendureSolarflow2400AC_N1(status: boolean): void {
    if (stateMemory.zendureSolarflow2400AC_N1) {
        stateMemory.zendureSolarflow2400AC_N1.status = status;
    }
}

/* ------------- Getters (copies immuables) ------------- */
function getShelly3EM(): Shelly3EM_Snapshot | undefined {
    return stateMemory.shelly3EM
        ? {
              ...stateMemory.shelly3EM,
              data: { ...stateMemory.shelly3EM.data },
          }
        : undefined;
}

function getShellyPrise_BatterieZSF2400AC_N1(): ShellyPlugSGen3_Snapshot | undefined {
    return stateMemory.shellyPrise_BatterieZSF2400AC_N1
        ? {
              ...stateMemory.shellyPrise_BatterieZSF2400AC_N1,
              data: { ...stateMemory.shellyPrise_BatterieZSF2400AC_N1.data },
          }
        : undefined;
}

function getZendureSolarflow2400AC_N1(): ZendureSolarflow2400AC_Snapshot | undefined {
    return stateMemory.zendureSolarflow2400AC_N1
        ? {
              ...stateMemory.zendureSolarflow2400AC_N1,
              data: { ...stateMemory.zendureSolarflow2400AC_N1.data },
          }
        : undefined;
}

/* ---------------- Utils ---------------- */
function ageMsOf(key: keyof DataState): number | undefined {
    const snap = stateMemory[key];
    return snap ? Date.now() - snap.ts : undefined;
}

function toJSON(): DataState {
    return {
        shelly3EM: getShelly3EM(),
        shellyPrise_BatterieZSF2400AC_N1: getShellyPrise_BatterieZSF2400AC_N1(),
        zendureSolarflow2400AC_N1: getZendureSolarflow2400AC_N1(),
    };
}

function resetStore(): void {
    stateMemory.shelly3EM = undefined;
    stateMemory.shellyPrise_BatterieZSF2400AC_N1 = undefined;
    stateMemory.zendureSolarflow2400AC_N1 = undefined;
}

/* ------------- Exports ------------- */
export {
    // setters
    setShelly3EM,
    setShellyPrise_BatterieZSF2400AC_N1,
    setZendureSolarflow2400AC_N1,
    // status setters
    statusShelly3EM,
    statusShellyPrise_BatterieZSF2400AC_N1,
    statusZendureSolarflow2400AC_N1,
    // getters
    getShelly3EM,
    getShellyPrise_BatterieZSF2400AC_N1,
    getZendureSolarflow2400AC_N1,
    // utils
    ageMsOf,
    toJSON,
    resetStore,
};

export type {
    DataState,
    Shelly3EM_Snapshot,
    ShellyPlugSGen3_Snapshot,
    ZendureSolarflow2400AC_Snapshot,
};
