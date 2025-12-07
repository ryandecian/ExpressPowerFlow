const stateMemory = {
    memory: {
        shellyPro3EM: null,
        shellyPrise_BatterieZSF2400AC_N1: null,
        shellyPrise_BatterieZSF2400AC_N2: null,
        zendureSolarflow2400AC_N1: null,
        zendureSolarflow2400AC_N2: null,
    }
};
/* ------------- Setters (Écriture) ------------- */
/* Met à jour une clé du 1er niveau */
function setMemory_Lvl1_Memory(key, /* Typage fort, la clé doit correspondre à une clé connue dans le type */ value /* Typage fort, la valeur doit correspondre au type de la clé */) {
    if (!stateMemory.memory)
        return;
    stateMemory.memory[key] = value;
}
/* Met à jour une clé du 2ᵉ niveau uniquement si les données Lvl1 ont été initialisés avant */
function setMemory_Lvl2_Memory(key1, key2, value) {
    const level1 = stateMemory.memory?.[key1];
    if (!level1) {
        console.warn(`⚠️ Mémoire non initialisée pour la clé de niveau 1 '${String(key1)}'. Mise à jour ignorée.`);
        return; /* sécurité : mémoire non initialisée → on sort */
    }
    ;
    level1[key2] = value;
}
/* ------------- Getters (copies immuables) ------------- */
function getMemory_Memory() {
    return structuredClone(stateMemory.memory);
}
/* ------------- Exports ------------- */
export { 
// setters
setMemory_Lvl1_Memory, setMemory_Lvl2_Memory, 
// getters
getMemory_Memory, };
