/* Import des Types */
import type { BodyRequestChargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestChargeZSF2400AC.type.js";
import type { BodyRequestDischargeZSF2400AC_Type } from "../../types/bodyRequestZSF2400AC_type/bodyRequestDischargeZSF2400AC.type.js";

/* -------------------------------
   Snapshots mémoires uniformisés
   ------------------------------- */
type LastRequest_ZSF2400AC_Snapshot = {
    ZSF2400AC_N1: BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type | null;
    ZSF2400AC_N2: BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type | null;
}

/* Etat global (singleton via cache des modules) */
type DataState = {
    lastRequest_ZSF2400AC?: LastRequest_ZSF2400AC_Snapshot;
};

const stateMemory: DataState = {};

/* ------------- Setters (Écriture) ------------- */
function setLastRequest_ZSF2400AC(body: LastRequest_ZSF2400AC_Snapshot): void {
    stateMemory.lastRequest_ZSF2400AC = {
        ZSF2400AC_N1: body.ZSF2400AC_N1,
        ZSF2400AC_N2: body.ZSF2400AC_N2,
    };
}

/* ------------- Getters (copies immuables) ------------- */
function getLastRequest_ZSF2400AC(): LastRequest_ZSF2400AC_Snapshot {
    return structuredClone(
        stateMemory.lastRequest_ZSF2400AC ?? {
            ZSF2400AC_N1: null,
            ZSF2400AC_N2: null,
        }
    );
}

/* ---------------- Utils ---------------- */
function toJSON(): DataState {
    return {
        lastRequest_ZSF2400AC: getLastRequest_ZSF2400AC(),
    };
}

function resetStore(): void {
    stateMemory.lastRequest_ZSF2400AC = undefined;
}

/* ------------- Exports ------------- */
export {
    /* setters */
    setLastRequest_ZSF2400AC,
    /* getters */
    getLastRequest_ZSF2400AC,
    /* utils */
    toJSON,
    resetStore,
};
