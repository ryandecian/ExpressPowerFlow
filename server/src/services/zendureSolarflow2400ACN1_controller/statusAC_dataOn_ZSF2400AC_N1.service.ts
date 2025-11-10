/* Import des Datas */
import { getZendureSolarflow2400AC_N1 } from "../../database/data_memory/memory.data.js";

/* Import des Types */
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";

/* Attention, dans ce service on considère que les données en mémoire ne sont pas undefined et qu'ils existe ! */
/* L'objectif de ce service est de déterminer si la batterie est opérationnelle pour une utilisation et de lancer des logs proprement sans répétition */
function statusAC_dataOn_ZSF2400AC_N1_Service(dataZendure: GetZendureSolarflow2400AC_data_Type): boolean {
    let status = false;
    
    /* Logique métier 1 : La batterie détecte il le courant AC ? */
        /* Si le courant AC n'est pas détecté */
            if (dataZendure.properties.gridState === 0) {
                /* On vérifie le status précédent avant de loger */
                    if (getZendureSolarflow2400AC_N1()!.data!.properties!.gridState === 0) {
                        status = false;
                    }
                    else if (getZendureSolarflow2400AC_N1()!.data!.properties!.gridState === 1) {
                        console.warn("zendureSolarflow2400ACN1_Controller => statusAC_dataOn_ZSF2400AC_N1_Service : Le courant AC n'est pas détecté par la batterie Zendure Solarflow 2400 AC N1.");
                        status = false;
                    }
                    else {
                        console.error("zendureSolarflow2400ACN1_Controller => statusAC_dataOn_ZSF2400AC_N1_Service : Mise en sécurité : Le server n'arrive pas à déterminer si la batterie Zendure Solarflow 2400 AC N1 détecte le courant AC.");
                        status = false;
                    }
                }
        /* Si le courant AC est détecté */
            else {
                /* On vérifie le status précédent avant de loger */
                    if (getZendureSolarflow2400AC_N1()!.data!.properties!.gridState === 1) {
                        status = true;
                    }
                    else if (getZendureSolarflow2400AC_N1()!.data!.properties!.gridState === 0) {
                        console.info("zendureSolarflow2400ACN1_Controller => statusAC_dataOn_ZSF2400AC_N1_Service : Rétablissement : Le courant AC est de nouveau détecté par la batterie Zendure Solarflow 2400 AC N1.");
                        status = true;
                    }
            }

    /* Logique métier 2 : La batterie est elle synchronisée au courant AC ? */
        /* Si la batterie n'est pas synchronisée sur le courant AC */
            if (dataZendure.properties.acStatus === 0) {
                /* On vérifie le status précédent avant de loger */
                    if (getZendureSolarflow2400AC_N1()!.data!.properties!.acStatus === 0) {
                        status = false;
                    }
                    else if (getZendureSolarflow2400AC_N1()!.data!.properties!.acStatus === 1) {
                        console.warn("zendureSolarflow2400ACN1_Controller => statusAC_dataOn_ZSF2400AC_N1_Service : La batterie Zendure Solarflow 2400 AC N1 n'est plus synchronisée au courant AC.");
                        status = false;
                    }
                    else {
                        console.error("zendureSolarflow2400ACN1_Controller => statusAC_dataOn_ZSF2400AC_N1_Service : Mise en sécurité : Le server n'arrive pas à déterminer si la batterie Zendure Solarflow 2400 AC N1 est synchronisée au courant AC.");
                        status = false;
                    }
                }

    return status;
}

export { statusAC_dataOn_ZSF2400AC_N1_Service };
