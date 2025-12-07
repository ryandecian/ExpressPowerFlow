const stateMemory = {
    lastRequest_ZSF2400AC: {
        ZSF2400AC_N1: null,
        ZSF2400AC_N2: null,
    }
};
/* ------------- Setters (Écriture) ------------- */
function setLastRequest_ZSF2400AC_Memory(body) {
    stateMemory.lastRequest_ZSF2400AC = {
        ZSF2400AC_N1: body.ZSF2400AC_N1,
        ZSF2400AC_N2: body.ZSF2400AC_N2,
    };
}
function setLastRequest_ZSF2400AC_N1_Memory(requestZSF2400AC_N1) {
    /* Initialisation si la mémoire est encore vide */
    if (!stateMemory.lastRequest_ZSF2400AC) {
        stateMemory.lastRequest_ZSF2400AC = {
            ZSF2400AC_N1: requestZSF2400AC_N1,
            ZSF2400AC_N2: null,
        };
    }
    else {
        /* Mise à jour ciblée */
        stateMemory.lastRequest_ZSF2400AC = {
            ...stateMemory.lastRequest_ZSF2400AC,
            ZSF2400AC_N1: requestZSF2400AC_N1,
        };
    }
}
function setLastRequest_ZSF2400AC_N2_Memory(requestZSF2400AC_N2) {
    if (!stateMemory.lastRequest_ZSF2400AC) {
        stateMemory.lastRequest_ZSF2400AC = {
            ZSF2400AC_N1: null,
            ZSF2400AC_N2: requestZSF2400AC_N2,
        };
    }
    else {
        stateMemory.lastRequest_ZSF2400AC = {
            ...stateMemory.lastRequest_ZSF2400AC,
            ZSF2400AC_N2: requestZSF2400AC_N2,
        };
    }
}
/* ------------- Getters (copies immuables) ------------- */
function getLastRequest_ZSF2400AC_Memory() {
    return structuredClone(stateMemory.lastRequest_ZSF2400AC);
}
/* ------------- Exports ------------- */
export { 
/* setters */
setLastRequest_ZSF2400AC_Memory, setLastRequest_ZSF2400AC_N1_Memory, setLastRequest_ZSF2400AC_N2_Memory, 
/* getters */
getLastRequest_ZSF2400AC_Memory, };
