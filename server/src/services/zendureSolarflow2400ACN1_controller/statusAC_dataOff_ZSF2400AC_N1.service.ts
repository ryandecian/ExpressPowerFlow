/* Import des Types */
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";

/* Attention, dans ce service on considère que les données en mémoire sont undefined et qu'ils n'existe pas ! */
/* L'objectif de ce service est de déterminer si la batterie est opérationnelle pour une utilisation et de lancer des logs proprement sans répétition */
function statusAC_dataOff_ZSF2400AC_N1_Service(dataZendure: GetZendureSolarflow2400AC_data_Type): boolean {
    let status = false;

    /* Logique métier 1 : La batterie détecte il le courant AC ? */
        /* Si le courant AC est détecté */
            if (dataZendure.properties.gridState === 1) {
                status = true;
            }
        /* Si le courant AC n'est pas détecté */
            else if (dataZendure.properties.gridState === 0) {
                console.warn("zendureSolarflow2400ACN1_Controller => statusAC_dataOff_ZSF2400AC_N1_Service : Le courant AC n'est pas détecté par la batterie Zendure Solarflow 2400 AC N1.");
                status = false;
            }
        /* Si la valeur n'est pas valable, on ne sait pas si le courant est détectée, on mise sur la sécurité */
            else {
                console.error("zendureSolarflow2400ACN1_Controller => statusAC_dataOff_ZSF2400AC_N1_Service : Mise en sécurité : Le server n'arrive pas à déterminer si la batterie Zendure Solarflow 2400 AC N1 détecte le courant AC.");
                status = false;
            }

    return status;
}

export { statusAC_dataOff_ZSF2400AC_N1_Service };
