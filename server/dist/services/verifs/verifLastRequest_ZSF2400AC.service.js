/* Import des Datas */
import { getLastRequest_ZSF2400AC_Memory } from "../../database/data_memory/batteryLastRequest.data.memory.js";
function verifLastRequest_ZSF2400AC_Service(body) {
    const lastRequest_ZSF2400AC = getLastRequest_ZSF2400AC_Memory();
    /* Vérification 1 : Si body contient la commande de la batterie N1 */
    if (body.ZSF2400AC_N1 != null) {
        /* Si la commande à envoyer est identique à la dernière commande en mémoire */
        if (body.ZSF2400AC_N1 === lastRequest_ZSF2400AC.ZSF2400AC_N1) {
            body.ZSF2400AC_N1 = null; /* Suppression de la commande à envoyer */
        }
    }
    /* Vérification 2 : Si body contient la commande de la batterie N2 */
    if (body.ZSF2400AC_N2 != null) {
        /* Si la commande à envoyer est identique à la dernière commande en mémoire */
        if (body.ZSF2400AC_N2 === lastRequest_ZSF2400AC.ZSF2400AC_N2) {
            body.ZSF2400AC_N2 = null; /* Suppression de la commande à envoyer */
        }
    }
    return body;
}
export { verifLastRequest_ZSF2400AC_Service };
