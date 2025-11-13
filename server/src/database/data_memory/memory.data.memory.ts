/* Import des Types (RAW, tels que renvoyés par tes devices) : */
import type { ShellyPro3EM_data_memory_Type } from "../../types/dataMemory_type/brut/shellyPro3EM.data.memory.type.js";
import type { ShellyPlugSGen3_data_memory_Type } from "../../types/dataMemory_type/brut/shellyPlugSGen3.data.memory.type.js";
import type { ZendureSolarflow2400AC_data_memory_Type } from "../../types/dataMemory_type/brut/zendureSolarflow2400AC.data.memory.type.js";

import type { ShellyPro3EM_Snapshot_Type } from "../../types/dataMemory_type/snapshot/shellyPro3EM.snapshot.type.js";
import type { ShellyPlugSGen3_Snapshot_Type } from "../../types/dataMemory_type/snapshot/shellyPlugSGen3.snapshot.type.js";

/* -------------------------------
   Snapshots mémoires uniformisés
   ------------------------------- */

type ZendureSolarflow2400AC_Snapshot = {
    ts: number;                                      // Aligné sur ms ; converti depuis payload.timestamp (s)
    source: string;
    status: boolean;
    data: ZendureSolarflow2400AC_data_memory_Type;   // payload RAW complet Zendure
};

/* Etat global (singleton via cache des modules) */
type DataState = {
    shellyPro3EM?: ShellyPro3EM_Snapshot_Type;
    shellyPrise_BatterieZSF2400AC_N1?: ShellyPlugSGen3_Snapshot_Type;
    shellyPrise_BatterieZSF2400AC_N2?: ShellyPlugSGen3_Snapshot_Type;
    zendureSolarflow2400AC_N1?: ZendureSolarflow2400AC_Snapshot;
    zendureSolarflow2400AC_N2?: ZendureSolarflow2400AC_Snapshot;
};

const stateMemory: DataState = {};

/* ------------- Setters (Écriture) ------------- */
/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShellyPro3EM(raw: ShellyPro3EM_data_memory_Type, status: boolean): void {
    stateMemory.shellyPro3EM = {
        ts: Date.now(),
        source: "Compteur Shelly Pro 3EM",
        status,
        data: { ...raw },
    };
}

/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShellyPrise_BatterieZSF2400AC_N1(raw: ShellyPlugSGen3_data_memory_Type, status: boolean): void {
    stateMemory.shellyPrise_BatterieZSF2400AC_N1 = {
        ts: Date.now(),
        source: "Prise Shelly Plug S Gen3 Batterie Zendure Solarflow 2400AC N1",
        status,
        data: { ...raw },
    };
}

/** Enregistre le dernier snapshot Shelly (RAW + métadonnées uniformes). */
function setShellyPrise_BatterieZSF2400AC_N2(raw: ShellyPlugSGen3_data_memory_Type, status: boolean): void {
    stateMemory.shellyPrise_BatterieZSF2400AC_N2 = {
        ts: Date.now(),
        source: "Prise Shelly Plug S Gen3 Batterie Zendure Solarflow 2400AC N2",
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

function setZendureSolarflow2400AC_N2(raw: ZendureSolarflow2400AC_data_memory_Type, status: boolean): void {
    const hasNumericTs = typeof raw.timestamp === "number" && Number.isFinite(raw.timestamp);
    const tsMs = hasNumericTs ? raw.timestamp * 1000 : Date.now();

    stateMemory.zendureSolarflow2400AC_N2 = {
        ts: tsMs,
        source: "Batterie Zendure Solarflow 2400AC N2",
        status,
        data: { ...raw },
    };
}

/* ------------- Status  ------------- */
function statusShellyPro3EM(status: boolean): void {
    if (stateMemory.shellyPro3EM) {
        stateMemory.shellyPro3EM.status = status;
    }
}

function statusShellyPrise_BatterieZSF2400AC_N1(status: boolean): void {
    if (stateMemory.shellyPrise_BatterieZSF2400AC_N1) {
        stateMemory.shellyPrise_BatterieZSF2400AC_N1.status = status;
    }
}

function statusShellyPrise_BatterieZSF2400AC_N2(status: boolean): void {
    if (stateMemory.shellyPrise_BatterieZSF2400AC_N2) {
        stateMemory.shellyPrise_BatterieZSF2400AC_N2.status = status;
    }
}

function statusZendureSolarflow2400AC_N1(status: boolean): void {
    if (stateMemory.zendureSolarflow2400AC_N1) {
        stateMemory.zendureSolarflow2400AC_N1.status = status;
    }
}

function statusZendureSolarflow2400AC_N2(status: boolean): void {
    if (stateMemory.zendureSolarflow2400AC_N2) {
        stateMemory.zendureSolarflow2400AC_N2.status = status;
    }
}

/* ------------- Getters (copies immuables) ------------- */
function getShellyPro3EM(): ShellyPro3EM_Snapshot_Type | undefined {
    return stateMemory.shellyPro3EM
        ? {
              ...stateMemory.shellyPro3EM,
              data: { ...stateMemory.shellyPro3EM.data },
          }
        : undefined;
}

function getShellyPrise_BatterieZSF2400AC_N1(): ShellyPlugSGen3_Snapshot_Type | undefined {
    return stateMemory.shellyPrise_BatterieZSF2400AC_N1
        ? {
              ...stateMemory.shellyPrise_BatterieZSF2400AC_N1,
              data: { ...stateMemory.shellyPrise_BatterieZSF2400AC_N1.data },
          }
        : undefined;
}

function getShellyPrise_BatterieZSF2400AC_N2(): ShellyPlugSGen3_Snapshot_Type | undefined {
    return stateMemory.shellyPrise_BatterieZSF2400AC_N2
        ? {
              ...stateMemory.shellyPrise_BatterieZSF2400AC_N2,
              data: { ...stateMemory.shellyPrise_BatterieZSF2400AC_N2.data },
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

function getZendureSolarflow2400AC_N2(): ZendureSolarflow2400AC_Snapshot | undefined {
    return stateMemory.zendureSolarflow2400AC_N2
        ? {
              ...stateMemory.zendureSolarflow2400AC_N2,
              data: { ...stateMemory.zendureSolarflow2400AC_N2.data },
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
        shellyPro3EM: getShellyPro3EM(),
        shellyPrise_BatterieZSF2400AC_N1: getShellyPrise_BatterieZSF2400AC_N1(),
        shellyPrise_BatterieZSF2400AC_N2: getShellyPrise_BatterieZSF2400AC_N2(),
        zendureSolarflow2400AC_N1: getZendureSolarflow2400AC_N1(),
        zendureSolarflow2400AC_N2: getZendureSolarflow2400AC_N2(),
    };
}

/* ------------- Exports ------------- */
export {
    // setters
    setShellyPro3EM,
    setShellyPrise_BatterieZSF2400AC_N1,
    setShellyPrise_BatterieZSF2400AC_N2,
    setZendureSolarflow2400AC_N1,
    setZendureSolarflow2400AC_N2,
    // status setters
    statusShellyPro3EM,
    statusShellyPrise_BatterieZSF2400AC_N1,
    statusShellyPrise_BatterieZSF2400AC_N2,
    statusZendureSolarflow2400AC_N1,
    statusZendureSolarflow2400AC_N2,
    // getters
    getShellyPro3EM,
    getShellyPrise_BatterieZSF2400AC_N1,
    getShellyPrise_BatterieZSF2400AC_N2,
    getZendureSolarflow2400AC_N1,
    getZendureSolarflow2400AC_N2,
    // utils
    ageMsOf,
    toJSON,
};

export type {
    DataState,
    ZendureSolarflow2400AC_Snapshot,
};
