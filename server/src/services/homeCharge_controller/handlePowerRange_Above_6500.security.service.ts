/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

/* Ce service est utilisé en cas de mise en sécurité du réseau électrique. */
/* Ce service se déclanche si la consommation de maison dépasse 6500w hors batteries Zendure */
/* Dans ce cas precis, l'objectif est de piloter les batteries pour ne plus se charger mais bien de se décharger et maintenir la consommation maison sous les 6500w */
function handlePowerRange_Above_6500_security_Service(
    body: BodyRequestHomeController_Type,
    selectBattery: SelectBattery_Type,
    homePower: number /* Nombre positive car la maison consomme de l'énergie */
): BodyRequestHomeController_Type {
    
    /* Calcul du seul de déclanchement */
        const maxPowerHome: number = 6500; /* Puissance à atteindre */
        const thresholdPower: number = homePower - maxPowerHome;

    /* Couche 1 : Si le seuil de puissance est dépassé de plus de 100w */
        if (thresholdPower >= 100) {
            /* Couche 2 : Les deux batteries sont disponibles */
            /* Couche 2 : Seul la batterie N1 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    /* Attribution de toute la puissance à la batterie N1 */
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, -thresholdPower);
                }
            /* Couche 2 : Seul la batterie N2 est disponible */
                else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    /* Attribution de toute la puissance à la batterie N2 */
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, -thresholdPower + 5);
                }
            /* Couche 2 : Aucune batterie n'est disponible */
                else {
                    console.error("[homeCharge_Controller] - handlePowerRange_Above_6500_security - Erreur : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                    return body;
                }
        }
    /* Couche 1 : Si le seuil de puissance est inférieur à 100w */
        else {
            return body;
        }

    return body;
}

export { handlePowerRange_Above_6500_security_Service };
