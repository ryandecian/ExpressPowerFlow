/* Import des Datas */
import { getMemory_Memory } from "../../database/data_memory/memory.data.memory.js";
/* Attention, dans ce service on considère que les données en mémoire ne sont pas undefined et qu'ils existe ! */
/* L'objectif de ce service est de déterminer si la batterie est opérationnelle pour une utilisation et de lancer des logs proprement sans répétition */
function statusAC_dataOn_ZSF2400AC_N2_Service(dataZendure) {
    let status = false;
    /* Logique métier 1 : La batterie détecte il le courant AC ? */
    /* Si le courant AC n'est pas détecté */
    if (dataZendure.properties.gridState === 0) {
        /* On vérifie le status précédent avant de loger */
        if (getMemory_Memory().zendureSolarflow2400AC_N2.data.properties.gridState === 0) {
            status = false;
        }
        else if (getMemory_Memory().zendureSolarflow2400AC_N2.data.properties.gridState === 1) {
            console.warn("zendureSolarflow2400ACN2_Controller => statusAC_dataOn_ZSF2400AC_N2_Service : Le courant AC n'est plus détecté par la batterie Zendure Solarflow 2400 AC N2.");
            status = false;
        }
        else {
            console.error("zendureSolarflow2400ACN2_Controller => statusAC_dataOn_ZSF2400AC_N2_Service : Mise en sécurité : Le server n'arrive pas à déterminer si la batterie Zendure Solarflow 2400 AC N2 détecte le courant AC.");
            status = false;
        }
    }
    /* Si le courant AC est détecté */
    else {
        /* On vérifie le status précédent avant de loger */
        if (getMemory_Memory().zendureSolarflow2400AC_N2.data.properties.gridState === 1) {
            status = true;
        }
        else if (getMemory_Memory().zendureSolarflow2400AC_N2.data.properties.gridState === 0) {
            console.info("zendureSolarflow2400ACN2_Controller => statusAC_dataOn_ZSF2400AC_N2_Service : Rétablissement : Le courant AC est de nouveau détecté par la batterie Zendure Solarflow 2400 AC N2.");
            status = true;
        }
    }
    return status;
}
export { statusAC_dataOn_ZSF2400AC_N2_Service };
