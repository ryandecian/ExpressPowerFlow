/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";

function handlePowerRange_Above_9000(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type, shellyPower: number): BodyRequestHomeController_Type {
    /* Calcul du seul de déclanchement */
        const maxPowerHome: number = 8700

        const thresholdPower: number = shellyPower - maxPowerHome;

    /* Si le seuil de puissance est dépassé de plus de 100w */
        if (thresholdPower > 100) {}
    /* Si le seuil de puissance est inférieur à 100w */
        else {
            body.ZSF2400AC_N1 = null;
            body.ZSF2400AC_N2 = null;
        }


    return body;
}