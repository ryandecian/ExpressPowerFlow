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

    return body;
}

export { handlePowerRange_Above_6500_security_Service };
