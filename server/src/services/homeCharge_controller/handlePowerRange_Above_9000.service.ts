/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

function handlePowerRange_Above_9000(
    body: BodyRequestHomeController_Type, 
    shellyPower: number, 
    selectBattery: SelectBattery_Type, 
    shellyPrise_BatterieZSF2400AC_N1_Power: number, 
    shellyPrise_BatterieZSF2400AC_N2_Power: number
): BodyRequestHomeController_Type {

    /* Calcul du seul de déclanchement */
        const maxPowerHome: number = 8700

        const thresholdPower: number = shellyPower - maxPowerHome;

    /* Couche 1 : Si le seuil de puissance est dépassé de plus de 100w */
        if (thresholdPower > 100) {
            /* Couche 2 : Les deux batteries sont disponibles */
                if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Couche 3 : Cas 1 : Les 2 batteries ont des niveaux de charge identiques */
                }
            /* Couche 2 : Seul la batterie N1 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    /* Attribution de la puissance à la batterie N1 */
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, shellyPrise_BatterieZSF2400AC_N1_Power - thresholdPower);
                }
            /* Couche 2 : Seul la batterie N2 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Attribution de la puissance à la batterie N2 */
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, shellyPrise_BatterieZSF2400AC_N2_Power - thresholdPower);
                }
            /* Couche 2 : Aucune batterie n'est disponible */
                else {
                    console.error("[homeCharge_Controller] - handlePowerRange_Above_9000 - Erreur : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                }
        }
    /* Couche 1 : Si le seuil de puissance est inférieur à 100w */
        else {
            body.ZSF2400AC_N1 = null;
            body.ZSF2400AC_N2 = null;
        }


    return body;
}