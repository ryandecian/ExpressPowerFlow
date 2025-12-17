/* Import des Datas */
import { getMemory_Memory } from "../../database/data_memory/memory.data.memory.js";

/* Import des Types */
import { Memory_Data_Memory_Type } from "../../types/dataMemory_type/memory/memory.data.memory.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";
import type { SelectDataDevice_Type } from "../../types/services/selectDataDevice.type.js";


function selectDataDevice_Service(logNameController: string): SelectDataDevice_Type | null {
    /* Logique métier 1 : Récupération des données du compteur et des prises de batteries */
        const memoryData: Memory_Data_Memory_Type = getMemory_Memory();

        let shellyPro3EM_Power: number = 0;
        let shellyPrise_BatterieZSF2400AC_N1_Power: number = 0;
        let shellyPrise_BatterieZSF2400AC_N2_Power: number = 0;
        let selectBattery : SelectBattery_Type = {
            zendureSolarflow2400AC_N1: {
                sn: memoryData.zendureSolarflow2400AC_N1?.data.sn || "",
                status: true,
                electricLevel: 0,
            },
            zendureSolarflow2400AC_N2: {
                sn: memoryData.zendureSolarflow2400AC_N2?.data.sn || "",
                status: true,
                electricLevel: 0,
            },
        };

    /* Logique métier 2 : Vérification des données mémoires disponibles */
        /* Vérification 1 : Compteur Shelly Pro 3EM */
            if (memoryData.shellyPro3EM == null) {
                console.error(`[${logNameController}] - Les données du compteur Shelly Pro 3EM ne sont pas encore disponibles.`);
                return null;
            }
            else {
                if (memoryData.shellyPro3EM.status === false) {
                    console.error(`[${logNameController}] - Le compteur Shelly Pro 3EM est déconnecté.`);
                    return null;
                }
                else {
                    shellyPro3EM_Power = memoryData.shellyPro3EM.data.act_power;
                }
            }

        /* Vérification 2 : Prises Shelly Plug S Gen 3 des batteries */
            /* Couche 1 : Si aucune données n'est disponibles */
                if (memoryData.shellyPrise_BatterieZSF2400AC_N1 == null && memoryData.shellyPrise_BatterieZSF2400AC_N2 == null) {
                    console.error(`[${logNameController}] - Aucunes données des prises Shelly des batteries ne sont pas encore disponibles.`);
                    return null;
                }
            /* Couche 1 : Si les données des 2 prises sont disponibles */
                else if (memoryData.shellyPrise_BatterieZSF2400AC_N1 != null && memoryData.shellyPrise_BatterieZSF2400AC_N2 != null) {
                    /* Couche 2 : Si les deux prises sont déconnectées */
                        if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === false && memoryData.shellyPrise_BatterieZSF2400AC_N2.status === false) {
                            console.error(`[${logNameController}] - Toutes les prises Shelly des batteries sont déconnectées.`);
                            return null;
                        }
                    /* Couche 2 : Si les deux prises sont connectées */
                        else if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === true && memoryData.shellyPrise_BatterieZSF2400AC_N2.status === true) {
                            shellyPrise_BatterieZSF2400AC_N1_Power = memoryData.shellyPrise_BatterieZSF2400AC_N1.data.apower;
                            shellyPrise_BatterieZSF2400AC_N2_Power = memoryData.shellyPrise_BatterieZSF2400AC_N2.data.apower;
                        }
                    /* Couche 2 : Si au moins une prise est connectée */
                        else if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === true || memoryData.shellyPrise_BatterieZSF2400AC_N2.status === true) {
                            /* Couche 3 : Si la prise N1 est déconnectée */
                                if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === false && memoryData.shellyPrise_BatterieZSF2400AC_N2.status === true) {
                                    console.info(`[${logNameController}] - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 est déconnectée.`);
                                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                                    shellyPrise_BatterieZSF2400AC_N2_Power = memoryData.shellyPrise_BatterieZSF2400AC_N2.data.apower;
                                }
                            /* Couche 3 : Si la prise N2 est déconnectée */
                                else if (memoryData.shellyPrise_BatterieZSF2400AC_N2.status === false && memoryData.shellyPrise_BatterieZSF2400AC_N1.status === true) {
                                    console.info(`[${logNameController}] - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 2 est déconnectée.`);
                                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                                    shellyPrise_BatterieZSF2400AC_N1_Power = memoryData.shellyPrise_BatterieZSF2400AC_N1.data.apower;
                                }
                            /* Couche 3 : Si aucun cas n'est applicable, on sécurise */
                                else {
                                    console.error(`[${logNameController}] - Erreur inconnue - Impossible d'utiliser les données d'une des deux prises Shelly des batteries.`);
                                    return null;
                                }
                        }
                    /* Couche 2 : Si aucun cas n'est applicable, on sécurise */
                        else {
                            console.error(`[${logNameController}] - Erreur inconnue - Impossible de déterminer quel prise Shelly des batteries est connectée ou déconnectée.`)
                        }
                }
            /* Couche 1 : Si les données d'au moins une des prise est disponibles */
                else if (memoryData.shellyPrise_BatterieZSF2400AC_N1 != null || memoryData.shellyPrise_BatterieZSF2400AC_N2 != null) {
                    /* Couche 2 : Si les données de la prise N1 ne sont pas disponibles */
                        if (memoryData.shellyPrise_BatterieZSF2400AC_N1 == null && memoryData.shellyPrise_BatterieZSF2400AC_N2 != null) {
                            /* Couche 3 : La prise N2 est déconnectée */
                                if (memoryData.shellyPrise_BatterieZSF2400AC_N2.status === false) {
                                    console.error(`[${logNameController}] - Les datas de la prise N1 ne sont pas disponible et la prise N2 est déconnectée.`);
                                    return null;
                                }
                            /* Couche 3 : La prise N2 est connectée */
                                else if (memoryData.shellyPrise_BatterieZSF2400AC_N2.status === true) {
                                    console.info(`[${logNameController}] - Les données de la prise N1 ne sont pas encore disponibles.`);
                                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                                    shellyPrise_BatterieZSF2400AC_N2_Power = memoryData.shellyPrise_BatterieZSF2400AC_N2.data.apower;
                                }
                            /* Couche 3 : Si aucun cas n'est applicable, on sécurise */
                                else {
                                    console.error(`[${logNameController}] - Erreur inconnue - Impossible d'utiliser les données de la prise Shelly de la batterie numéro 2.`)
                                    return null;
                                }
                                
                        }
                    /* Couche 2 : Si les données de la prise N2 ne sont pas disponibles */
                        else if (memoryData.shellyPrise_BatterieZSF2400AC_N2 == null && memoryData.shellyPrise_BatterieZSF2400AC_N1 != null) {
                            /* Couche 3 : La prise N1 est déconnectée */
                                if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === false) {
                                    console.error(`[${logNameController}] - Les datas de la prise N2 ne sont pas disponible et la prise N1 est déconnectée.`);
                                    return null;
                                }
                            /* Couche 3 : La prise N1 est connectée */
                                else if (memoryData.shellyPrise_BatterieZSF2400AC_N1.status === true) {
                                    console.info(`[${logNameController}] - Les données de la prise N2 ne sont pas encore disponibles.`);
                                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                                    shellyPrise_BatterieZSF2400AC_N1_Power = memoryData.shellyPrise_BatterieZSF2400AC_N1.data.apower;
                                }
                            /* Couche 3 : Si aucun cas n'est applicable, on sécurise */
                                else {
                                    console.error(`[${logNameController}] - Erreur inconnue - Impossible d'utiliser les données de la prise Shelly de la batterie numéro 1.`)
                                    return null;
                                }
                        }
                    /* Couche 2 : Si aucun cas n'est applicable, on sécurise */
                        else {
                            console.error(`[${logNameController}] - Erreur inconnue lors de la vérification de la disponibilitée des datas de la seule prise Shelly des batterie en mémoire.`)
                            return null;
                        }
                }
            /* Couche 1 : Si aucun cas n'est applicable, on sécurise */
                else {
                    console.error(`[${logNameController}] - Erreur inconnue lors de la vérification de la disponibilitée des datas des prises Shelly des batterie en mémoire.`)
                    return null;
                }

        /* Vérification 3 : Batteries Zendure Solarflow 2400 AC */
            /* Couche 1 : Si aucune données n'est disponibles */
                if (memoryData.zendureSolarflow2400AC_N1 == null && memoryData.zendureSolarflow2400AC_N2 == null) {
                    console.error(`${logNameController} - Aucunes données des batteries Zendure Solarflow 2400 AC ne sont pas encore disponibles.`);
                    return null;
                }
            /* Couche 1 : Si les données des deux batteries sont disponibles */
                else if (memoryData.zendureSolarflow2400AC_N1 != null && memoryData.zendureSolarflow2400AC_N2 != null) {}
            /* Couche 1 : Si les données d'au moins une seul batterie sont disponibles */
                else if (memoryData.zendureSolarflow2400AC_N1 != null || memoryData.zendureSolarflow2400AC_N2 != null) {}
            /* Couche 1 : Si aucun cas n'est applicable, on sécurise */
                else {
                    console.error(`${logNameController} - Erreur inconnue lors de la vérification de la disponibilitée des datas des batteries Zendure Solarflow 2400 AC en mémoire.`)
                    return null;
                }












            else if (memoryData.zendureSolarflow2400AC_N1!.status === false && memoryData.zendureSolarflow2400AC_N2!.status === false) {
                console.error(`${logNameController} - Toutes les batteries Zendure Solarflow 2400 AC sont déconnectées.`);
                return null;
            }
            else {
                if (memoryData.zendureSolarflow2400AC_N1 == null) {
                    console.info(`${logNameController} - Les données de la Batterie Zendure Solarflow 2400 AC numéro 1 ne sont pas encore disponibles.`);
                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                }
                else if (memoryData.zendureSolarflow2400AC_N1.status == false) {
                    console.info(`${logNameController} - La Batterie Zendure Solarflow 2400 AC numéro 1 est déconnectée.`);
                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                }
                else {
                    selectBattery.zendureSolarflow2400AC_N1.electricLevel = memoryData.zendureSolarflow2400AC_N1.data.properties.electricLevel;
                }

                if (memoryData.zendureSolarflow2400AC_N2 == null) {
                    console.info(`${logNameController} - Les données de la Batterie Zendure Solarflow 2400 AC numéro 2 ne sont pas encore disponibles.`);
                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                }
                else if (memoryData.zendureSolarflow2400AC_N2.status == false) {
                    console.info(`${logNameController} - La Batterie Zendure Solarflow 2400 AC numéro 2 est déconnectée.`);
                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                }
                else {
                    selectBattery.zendureSolarflow2400AC_N2.electricLevel = memoryData.zendureSolarflow2400AC_N2.data.properties.electricLevel;
                }
            }

        /* Logique métier 3 : Préparation des données a renvoyer */
            const selectDataDevice: SelectDataDevice_Type = {
                shellyPro3EM_Power: shellyPro3EM_Power,
                shellyPrise_BatterieZSF2400AC_N1_Power: shellyPrise_BatterieZSF2400AC_N1_Power,
                shellyPrise_BatterieZSF2400AC_N2_Power: shellyPrise_BatterieZSF2400AC_N2_Power,
                selectBattery: selectBattery,
            }

    return selectDataDevice;
}

export { selectDataDevice_Service };
