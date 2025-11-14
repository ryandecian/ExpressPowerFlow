/* Import des Types (RAW, tels que renvoyés par tes devices) : */
import type { Memory_Data_Memory_Type } from "../../types/dataMemory_type/memory/memory.data.memory.type.js";

/* Etat global (singleton via cache des modules) */
type DataState = {
    memory?: Memory_Data_Memory_Type;
};

const stateMemory: DataState = {
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
function setMemory_Lvl1_Memory<K extends keyof Memory_Data_Memory_Type>(
    key: K, /* Typage fort, la clé doit correspondre à une clé connue dans le type */
    value: Memory_Data_Memory_Type[K] /* Typage fort, la valeur doit correspondre au type de la clé */
): void {
    if (!stateMemory.memory) return;
    stateMemory.memory[key] = value;
}

/* Met à jour une clé du 2ᵉ niveau uniquement si les données Lvl1 ont été initialisés avant */
function setMemory_Lvl2_Memory<
    K1 extends keyof Memory_Data_Memory_Type,
    K2 extends keyof NonNullable<Memory_Data_Memory_Type[K1]>
>(
    key1: K1,
    key2: K2,
    value: NonNullable<Memory_Data_Memory_Type[K1]>[K2]
): void {
    const level1 = stateMemory.memory?.[key1];
    if (!level1) {
        console.warn(`⚠️ Mémoire non initialisée pour la clé de niveau 1 '${String(key1)}'. Mise à jour ignorée.`);
        return; /* sécurité : mémoire non initialisée → on sort */
    }; 

    (level1 as NonNullable<Memory_Data_Memory_Type[K1]>)[key2] = value;
}

/* ------------- Getters (copies immuables) ------------- */
function getMemory_Memory(): Memory_Data_Memory_Type {
    return structuredClone(stateMemory.memory!);
}

/* ------------- Exports ------------- */
export {
    // setters
    setMemory_Lvl1_Memory,
    setMemory_Lvl2_Memory,
    // getters
    getMemory_Memory,
};
