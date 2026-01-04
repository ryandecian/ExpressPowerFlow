function verifCapacityBattery_Service(targetPower, selectBattery) {
    /* Si les deux batteries sont disponibles */
    if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
        const electricLevel_N1 = selectBattery.zendureSolarflow2400AC_N1.electricLevel;
        const electricLevel_N2 = selectBattery.zendureSolarflow2400AC_N2.electricLevel;
        /* Si on doit charger les batteries donc targetPower Positif : */
        if (targetPower > 0) {
            /* Si le niveau de charge est === 100% on change le status sur false pour ne pas utiliser la batterie N1 */
            if (electricLevel_N1 === 100) {
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }
            if (electricLevel_N2 === 100) {
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }
        }
        /* Si on doit décharger les batteries donc targetPower Négatif : */
        if (targetPower < 0) {
            /* Si le niveau de charge est <= 5% on change le status sur false pour ne pas utiliser la batterie N1 */
            if (electricLevel_N1 <= 5) {
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }
            if (electricLevel_N2 <= 5) {
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }
        }
    }
    /* Si seul la batterie N1 est disponible */
    else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
        const electricLevel_N1 = selectBattery.zendureSolarflow2400AC_N1.electricLevel;
        /* Si on doit charger la batterie donc targetPower Positif : */
        if (targetPower > 0) {
            /* Si le niveau de charge est === 100% on change le status sur false pour ne pas utiliser la batterie N1 */
            if (electricLevel_N1 === 100) {
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }
        }
        /* Si on doit décharger la batterie donc targetPower Négatif : */
        if (targetPower < 0) {
            /* Si le niveau de charge est <= 5% on change le status sur false pour ne pas utiliser la batterie N1 */
            if (electricLevel_N1 <= 5) {
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }
        }
    }
    /* Si seul la batterie N2 est disponible */
    else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
        const electricLevel_N2 = selectBattery.zendureSolarflow2400AC_N2.electricLevel;
        /* Si on doit charger la batterie donc targetPower Positif : */
        if (targetPower > 0) {
            /* Si le niveau de charge est === 100% on change le status sur false pour ne pas utiliser la batterie N2 */
            if (electricLevel_N2 === 100) {
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }
        }
        /* Si on doit décharger la batterie donc targetPower Négatif : */
        if (targetPower < 0) {
            /* Si le niveau de charge est <= 5% on change le status sur false pour ne pas utiliser la batterie N2 */
            if (electricLevel_N2 <= 5) {
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }
        }
    }
    /* Si aucune batterie n'est disponible */
    else {
        selectBattery.zendureSolarflow2400AC_N1.status = false;
        selectBattery.zendureSolarflow2400AC_N2.status = false;
    }
    return selectBattery;
}
export { verifCapacityBattery_Service };
