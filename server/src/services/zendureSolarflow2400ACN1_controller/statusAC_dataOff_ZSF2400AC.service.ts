/* Import des Datas */
import { getZendureSolarflow2400AC_N1 } from "../../database/data_memory/memory.data.js";

/* Import des Types */
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";

/* Attention, dans ce service on considère que les données en mémoire sont undefined et qu'ils n'existe pas ! */
/* L'objectif de ce service est de déterminer si la batterie est opérationnelle pour une utilisation et de lancer des logs proprement sans répétition */
function statusAC_dataOff_ZSF2400AC_N1_Service(dataZendure: GetZendureSolarflow2400AC_data_Type): boolean {
    let status = false;

    return status;
}

export { statusAC_dataOff_ZSF2400AC_N1_Service };
