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

type ShellyPlugSGen3_BatterieZendureSolarflow2400AC_Snapshot = {
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
    shellyPlugSGen3_BatterieZendureSolarflow2400AC?: ShellyPlugSGen3_BatterieZendureSolarflow2400AC_Snapshot;
    zendureSolarflow2400AC?: ZendureSolarflow2400AC_Snapshot;
};

const stateMemory: DataState = {};

/* ------------- Setters (Écriture) ------------- */
/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShelly3EMSnapshot(raw: Shelly3EM_data_memory_Type, status: boolean): void {
    stateMemory.shelly3EM = {
        ts: Date.now(),
        source: "Compteur Shelly 3EM",
        status,
        data: { ...raw },
    };
}

/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot(raw: ShellyPlugSGen3_data_memory_Type, status: boolean): void {
    stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC = {
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
function setZendureSolarflow2400ACSnapshot(raw: ZendureSolarflow2400AC_data_memory_Type, status: boolean): void {
    const hasNumericTs = typeof raw.timestamp === "number" && Number.isFinite(raw.timestamp);
    const tsMs = hasNumericTs ? raw.timestamp * 1000 : Date.now();

    stateMemory.zendureSolarflow2400AC = {
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

function statusShellyPlugSGen3_BatterieZSF2400AC_1(status: boolean): void {
    if (stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC) {
        stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC.status = status;
    }
}

function statusZendureSolarflow2400AC(status: boolean): void {
    if (stateMemory.zendureSolarflow2400AC) {
        stateMemory.zendureSolarflow2400AC.status = status;
    }
}

/* ------------- Getters (copies immuables) ------------- */
function getShelly3EMSnapshot(): Shelly3EM_Snapshot | undefined {
    return stateMemory.shelly3EM
        ? {
              ...stateMemory.shelly3EM,
              data: { ...stateMemory.shelly3EM.data },
          }
        : undefined;
}

function getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot(): ShellyPlugSGen3_BatterieZendureSolarflow2400AC_Snapshot | undefined {
    return stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC
        ? {
              ...stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC,
              data: { ...stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC.data },
          }
        : undefined;
}

function getZendureSolarflow2400ACSnapshot(): ZendureSolarflow2400AC_Snapshot | undefined {
    return stateMemory.zendureSolarflow2400AC
        ? {
              ...stateMemory.zendureSolarflow2400AC,
              data: { ...stateMemory.zendureSolarflow2400AC.data },
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
        shelly3EM: getShelly3EMSnapshot(),
        zendureSolarflow2400AC: getZendureSolarflow2400ACSnapshot(),
    };
}

function resetStore(): void {
    stateMemory.shelly3EM = undefined;
    stateMemory.shellyPlugSGen3_BatterieZendureSolarflow2400AC = undefined;
    stateMemory.zendureSolarflow2400AC = undefined;
}

/* ------------- Exports ------------- */
export {
    // setters
    setShelly3EMSnapshot,
    setShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot,
    setZendureSolarflow2400ACSnapshot,
    // status setters
    statusShelly3EM,
    statusShellyPlugSGen3_BatterieZSF2400AC_1,
    statusZendureSolarflow2400AC,
    // getters
    getShelly3EMSnapshot,
    getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot,
    getZendureSolarflow2400ACSnapshot,
    // utils
    ageMsOf,
    toJSON,
    resetStore,
};

export type {
    DataState,
    Shelly3EM_Snapshot,
    ShellyPlugSGen3_BatterieZendureSolarflow2400AC_Snapshot,
    ZendureSolarflow2400AC_Snapshot,
};
