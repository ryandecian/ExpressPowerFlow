/* Import des Datas */
import { getShellyPro3EM } from "../../database/data_memory/memory.data.memory.js";
import { getShellyPrise_BatterieZSF2400AC_N1 } from "../../database/data_memory/memory.data.memory.js";
import { getShellyPrise_BatterieZSF2400AC_N2 } from "../../database/data_memory/memory.data.memory.js";
import { getZendureSolarflow2400AC_N1 } from "../../database/data_memory/memory.data.memory.js";
import { getZendureSolarflow2400AC_N2 } from "../../database/data_memory/memory.data.memory.js";

/* Import des Types */
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";
import type { SelectDataDevice_Type } from "../../types/services/selectDataDevice.type.js";


function selectDataDevice_Service(logNameController: string): SelectDataDevice_Type | null {
    /* Logique métier 1 : Récupération des données du compteur et des prises de batteries */
        const shellyPro3EM_Data = getShellyPro3EM();
        let shellyPrise_BatterieZSF2400AC_N1_Data = getShellyPrise_BatterieZSF2400AC_N1();
        let shellyPrise_BatterieZSF2400AC_N2_Data = getShellyPrise_BatterieZSF2400AC_N2();
        const zendureSolarflow2400AC_N1_Data = getZendureSolarflow2400AC_N1();
        const zendureSolarflow2400AC_N2_Data = getZendureSolarflow2400AC_N2();

        let selectBattery : SelectBattery_Type = {
            zendureSolarflow2400AC_N1: {
                sn: zendureSolarflow2400AC_N1_Data?.data.sn || "",
                status: true,
                electricLevel: 0,
            },
            zendureSolarflow2400AC_N2: {
                sn: zendureSolarflow2400AC_N2_Data?.data.sn || "",
                status: true,
                electricLevel: 0,
            },
        };

    /* Logique métier 2 : Vérification des données mémoires disponibles */
        /* Vérification 1 : Compteur Shelly Pro 3EM */
            if (shellyPro3EM_Data == null) {
                console.error(`${logNameController} - Les données du compteur Shelly Pro 3EM ne sont pas encore disponibles.`);
                return null;
            }

        /* Vérification 2 : Prises Shelly Plug S Gen 3 des batteries */
            if (shellyPrise_BatterieZSF2400AC_N1_Data == null && shellyPrise_BatterieZSF2400AC_N2_Data == null) {
                console.error(`${logNameController} - Aucunes données des prises Shelly des batteries ne sont pas encore disponibles.`);
                return null;
            }

            if (shellyPrise_BatterieZSF2400AC_N1_Data == null) { /* Si c'est null ou undefined */
                console.info(`${logNameController} - Les données de la prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 ne sont pas encore disponibles.`);
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }

            if (shellyPrise_BatterieZSF2400AC_N2_Data == null) {
                console.info(`${logNameController} - Les données de la prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 2 ne sont pas encore disponibles.`);
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }

        /* Vérification 3 : Batteries Zendure Solarflow 2400 AC */
            if (zendureSolarflow2400AC_N1_Data == null && zendureSolarflow2400AC_N2_Data == null) {
                console.error(`${logNameController} - Aucunes données des batteries Zendure Solarflow 2400 AC ne sont pas encore disponibles.`);
                return null;
            }

            if (zendureSolarflow2400AC_N1_Data == null) {
                console.info(`${logNameController} - Les données de la Batterie Zendure Solarflow 2400 AC numéro 1 ne sont pas encore disponibles.`);
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }

            if (zendureSolarflow2400AC_N2_Data == null) {
                console.info(`${logNameController} - Les données de la Batterie Zendure Solarflow 2400 AC numéro 2 ne sont pas encore disponibles.`);
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }

        /* Logique métier 3 : Vérification du status de connection */
            /* Vérification 1 : Status du compteur Shelly Pro 3EM */
                if (shellyPro3EM_Data.status === false) {
                    console.error(`${logNameController} - Le compteur Shelly Pro 3EM est déconnecté.`);
                    return null;
                }

            /* Vérification 2 : Status des prises Shelly Plug S Gen 3 sur lequel les batteries sont branchées*/
                if (shellyPrise_BatterieZSF2400AC_N1_Data?.status === false && shellyPrise_BatterieZSF2400AC_N2_Data?.status === false) {
                    console.error(`${logNameController} - Aucunes prises Shelly Plug S Gen 3 des batteries ne sont connectées.`);
                    return null;
                }

                if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    if (shellyPrise_BatterieZSF2400AC_N1_Data?.status === false) {
                        console.info(`${logNameController} - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 est déconnectée.`);
                        selectBattery.zendureSolarflow2400AC_N1.status = false;
                    }
                }

                if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    if (shellyPrise_BatterieZSF2400AC_N2_Data?.status === false) {
                        console.info(`${logNameController} - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 2 est déconnectée.`);
                        selectBattery.zendureSolarflow2400AC_N2.status = false;
                    }
                }

            /* Vérification 3 : Status des batteries Zendure Solarflow 2400 AC */
                if (zendureSolarflow2400AC_N1_Data?.status === false && zendureSolarflow2400AC_N2_Data?.status === false) {
                    console.error(`${logNameController} - Aucunes batteries Zendure Solarflow 2400 AC ne sont disponibles.`);
                    return null;
                }

                if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    if (zendureSolarflow2400AC_N1_Data?.status === false) {
                        console.info(`${logNameController} - La batterie Zendure Solarflow 2400 AC numéro 1 n'est pas connectée.`);
                        selectBattery.zendureSolarflow2400AC_N1.status = false;
                    }
                }

                if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    if (zendureSolarflow2400AC_N2_Data?.status === false) {
                        console.info(`${logNameController} - La batterie Zendure Solarflow 2400 AC numéro 2 n'est pas connectée.`);
                        selectBattery.zendureSolarflow2400AC_N2.status = false;
                    }
                }

        /* Logique métier 4 : Préparation des données a renvoyer */
            const selectDataDevice: SelectDataDevice_Type = {
                shellyPro3EM_Data: shellyPro3EM_Data,
                shellyPrise_BatterieZSF2400AC_N1_Data: shellyPrise_BatterieZSF2400AC_N1_Data,
                shellyPrise_BatterieZSF2400AC_N2_Data: shellyPrise_BatterieZSF2400AC_N2_Data,
                selectBattery: selectBattery,
            }

    return selectDataDevice;
}

export { selectDataDevice_Service };
