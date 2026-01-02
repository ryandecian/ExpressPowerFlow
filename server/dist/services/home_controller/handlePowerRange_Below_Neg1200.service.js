/* Import des Utils */
import { requestZSF2400AC_Utils } from "../../utils/requestZSF2400AC/requestZSF2400AC.utils.js";
/* targetPower inférieure à -1200w de décharge */
function handlePowerRange_Below_Neg1200_Service(selectBattery, body, targetPower) {
    /* Si les 2 batteries sont disponibles */
    if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
        /* Si les deux batteries ont des niveau de charge égale */
        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower * 0.5);
            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower * 0.5 + 5);
        }
        /* Si les deux batteries ont des niveau de charge différent */
        else {
            /* Si la batterie N1 a un niveau de charge suppérieure à N2 */
            if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                const deltaElectricLevel = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;
                /* Si la différence est suppérieure ou égale à 5% */
                if (deltaElectricLevel >= 5) {
                    /* Si targetPower est inférieure à 2400w */
                    if (targetPower < 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 0);
                    }
                    /* Si targetPower est supérieure à 2400w */
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                    }
                }
                /* Si la différence est de 4% : N1 = 90% et N2 = 10% */
                else if (deltaElectricLevel === 4) {
                    const deltaTargetPower_N1 = targetPower * 0.9;
                    const deltaTargetPower_N2 = targetPower * 0.1;
                    /* Si la puissance de deltaTargetPower_N1 est inférieur à 2400w */
                    if (deltaTargetPower_N1 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    /* Si la puissance de deltaTargetPower_N1 est suppérieure à 2400w */
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                    }
                }
                /* Si la différence est de 3% : N1 = 80% et N2 = 20% */
                else if (deltaElectricLevel === 3) {
                    const deltaTargetPower_N1 = targetPower * 0.8;
                    const deltaTargetPower_N2 = targetPower * 0.2;
                    /* Si la puissance de deltaTargetPower_N1 est inférieur à 2400w */
                    if (deltaTargetPower_N1 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                    }
                }
                /* Si la différence est de 2% : N1 = 70% et N2 = 30% */
                else if (deltaElectricLevel === 2) {
                    const deltaTargetPower_N1 = targetPower * 0.7;
                    const deltaTargetPower_N2 = targetPower * 0.3;
                    /* Si la puissance de deltaTargetPower_N1 est inférieur à 2400w */
                    if (deltaTargetPower_N1 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                    }
                }
                /* Si la différence est de 1% : N1 = 60% et N2 = 40% */
                else {
                    const deltaTargetPower_N1 = targetPower * 0.6;
                    const deltaTargetPower_N2 = targetPower * 0.4;
                    /* Si la puissance de deltaTargetPower_N1 est inférieur à 2400w */
                    if (deltaTargetPower_N1 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower - 2400 + 5);
                    }
                }
            }
            /* Si la batterie N2 a un niveau de charge suppérieure à N1 */
            else {
                const deltaElectricLevel = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;
                /* Si la différence est suppérieure ou égale à 5% */
                if (deltaElectricLevel >= 5) {
                    /* Si targetPower est inférieure à 2400w */
                    if (targetPower < 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, 0);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
                    }
                    /* Si targetPower est supérieure à 2400w */
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                    }
                }
                /* Si la différence est de 4% : N2 = 90% et N1 = 10% */
                else if (deltaElectricLevel === 4) {
                    const deltaTargetPower_N2 = targetPower * 0.9;
                    const deltaTargetPower_N1 = targetPower * 0.1;
                    /* Si la puissance de deltaTargetPower_N2 est inférieur à 2400w */
                    if (deltaTargetPower_N2 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    /* Si la puissance de deltaTargetPower_N2 est suppérieure à 2400w */
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                    }
                }
                /* Si la différence est de 3% : N2 = 80% et N1 = 20% */
                else if (deltaElectricLevel === 3) {
                    const deltaTargetPower_N2 = targetPower * 0.8;
                    const deltaTargetPower_N1 = targetPower * 0.2;
                    /* Si la puissance de deltaTargetPower_N2 est inférieur à 2400w */
                    if (deltaTargetPower_N2 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                    }
                }
                /* Si la différence est de 2% : N2 = 70% et N1 = 30% */
                else if (deltaElectricLevel === 2) {
                    const deltaTargetPower_N2 = targetPower * 0.7;
                    const deltaTargetPower_N1 = targetPower * 0.3;
                    /* Si la puissance de deltaTargetPower_N2 est inférieur à 2400w */
                    if (deltaTargetPower_N2 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                    }
                }
                /* Si la différence est de 1% : N2 = 60% et N1 = 40% */
                else {
                    const deltaTargetPower_N2 = targetPower * 0.6;
                    const deltaTargetPower_N1 = targetPower * 0.4;
                    /* Si la puissance de deltaTargetPower_N2 est inférieur à 2400w */
                    if (deltaTargetPower_N2 <= 2400) {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, deltaTargetPower_N1);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, deltaTargetPower_N2 + 5);
                    }
                    else {
                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower - 2400);
                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, 2400 + 5);
                    }
                }
            }
        }
    }
    /* Si seul la batterie N1 est disponible */
    else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N1.sn, targetPower);
    }
    /* Si seul la batterie N2 est disponible */
    else {
        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(selectBattery.zendureSolarflow2400AC_N2.sn, targetPower + 5);
    }
    return body;
}
export { handlePowerRange_Below_Neg1200_Service };
