
/* Import des Datas */
import { getShellyPro3EM } from "../database/data_memory/memory.data.js";
import { getShellyPrise_BatterieZSF2400AC_N1 } from "../database/data_memory/memory.data.js";
import { getShellyPrise_BatterieZSF2400AC_N2 } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_N1 } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_N2 } from "../database/data_memory/memory.data.js";

/* Import des Services : */
import { handlePowerRange_Equal_0_Service } from "../services/home_controller/handlePowerRange_Equal_0.service.js";
import { handlePowerRange_0_To_50_Service } from "../services/home_controller/handlePowerRange_0_To_50.service.js";
import { handlePowerRange_50_To_600_Service } from "../services/home_controller/handlePowerRange_50_To_600.service.js";
import { handlePowerRange_600_To_1200_Service } from "../services/home_controller/handlePowerRange_600_To_1200.service.js";
import { handlePowerRange_Albove_1200_Service } from "../services/home_controller/handlePowerRange_Albove_1200.service.js";
import { handlePowerRange_Neg50_To_0_Service } from "../services/home_controller/handlePowerRange_Neg50_To_0.service.js";
import { handlePowerRange_Neg50_To_Neg600_Service } from "../services/home_controller/handlePowerRange_Neg50_To_Neg600.service.js";
import { handlePowerRange_Neg600_To_Neg1200_Service } from "../services/home_controller/handlePowerRange_Neg600_To_Neg1200.service.js";
import { handlePowerRange_Below_Neg1200_Service } from "../services/home_controller/handlePowerRange_Below_Neg1200.service.js";

/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../types/services/bodyRequestHomeController.type.js";
import type { PostZendureSolarflow2400AC_data_Type } from "../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";
import type { SelectBattery_Type } from "../types/services/selectBattery.type.js";

/* Import des Utils */
import { fetch_Utils } from "../utils/fetch.utils.js";

const ZSF2400AC_1_URL_POST = "http://192.168.1.26/properties/write";
const ZSF2400AC_2_URL_POST = "http://192.168.1.83/properties/write";

async function home_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur et des prises de batteries */
            const shellyPro3EM_Data = getShellyPro3EM();
            const shellyPrise_BatterieZSF2400AC_N1_Data = getShellyPrise_BatterieZSF2400AC_N1();
            const shellyPrise_BatterieZSF2400AC_N2_Data = getShellyPrise_BatterieZSF2400AC_N2();
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
                    console.error("home_Controller - Les données du compteur Shelly Pro 3EM ne sont pas encore disponibles.");
                    return;
                }

            /* Vérification 2 : Prises Shelly Plug S Gen 3 des batteries */
                if (shellyPrise_BatterieZSF2400AC_N1_Data == null && shellyPrise_BatterieZSF2400AC_N2_Data == null) {
                    console.error("home_Controller - Aucunes données des prises Shelly des batteries ne sont pas encore disponibles.");
                    return;
                }

                if (shellyPrise_BatterieZSF2400AC_N1_Data == null) {
                    console.info("home_Controller - Les données de la prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 ne sont pas encore disponibles.");
                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                }

                if (shellyPrise_BatterieZSF2400AC_N2_Data == null) {
                    console.info("home_Controller - Les données de la prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 2 ne sont pas encore disponibles.");
                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                }

            /* Vérification 3 : Batteries Zendure Solarflow 2400 AC */
                if (zendureSolarflow2400AC_N1_Data == null && zendureSolarflow2400AC_N2_Data == null) {
                    console.error("home_Controller - Aucunes données des batteries Zendure Solarflow 2400 AC ne sont pas encore disponibles.");
                    return;
                }

                if (zendureSolarflow2400AC_N1_Data == null) {
                    console.info("home_Controller - Les données de la Batterie Zendure Solarflow 2400 AC numéro 1 ne sont pas encore disponibles.");
                    selectBattery.zendureSolarflow2400AC_N1.status = false;
                }

                if (zendureSolarflow2400AC_N2_Data == null) {
                    console.info("home_Controller - Les données de la Batterie Zendure Solarflow 2400 AC numéro 2 ne sont pas encore disponibles.");
                    selectBattery.zendureSolarflow2400AC_N2.status = false;
                }

        /* Logique métier 3 : Vérification du status de connection */
            /* Vérification 1 : Status du compteur Shelly Pro 3EM */
                if (shellyPro3EM_Data.status === false) {
                    console.error("home_Controller - Le compteur Shelly Pro 3EM est déconnecté.");
                    return;
                }

            /* Vérification 2 : Status des prises Shelly Plug S Gen 3 sur lequel les batteries sont branchées*/
                if (shellyPrise_BatterieZSF2400AC_N1_Data?.status === false && shellyPrise_BatterieZSF2400AC_N2_Data?.status === false) {
                    console.error("home_Controller - Aucunes prises Shelly Plug S Gen 3 des batteries ne sont connectées.");
                    return;
                }

                if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    if (shellyPrise_BatterieZSF2400AC_N1_Data?.status === false) {
                        console.info("home_Controller - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 est déconnectée.");
                        selectBattery.zendureSolarflow2400AC_N1.status = false;
                    }
                }

                if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    if (shellyPrise_BatterieZSF2400AC_N2_Data?.status === false) {
                        console.info("home_Controller - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 2 est déconnectée.");
                        selectBattery.zendureSolarflow2400AC_N2.status = false;
                    }
                }

            /* Vérification 3 : Status des batteries Zendure Solarflow 2400 AC */
                if (zendureSolarflow2400AC_N1_Data?.status === false && zendureSolarflow2400AC_N2_Data?.status === false) {
                    console.error("home_Controller - Aucunes batteries Zendure Solarflow 2400 AC ne sont disponibles.");
                    return;
                }

                if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    if (zendureSolarflow2400AC_N1_Data?.status === false) {
                        console.info("home_Controller - La batterie Zendure Solarflow 2400 AC numéro 1 n'est pas connectée.");
                        selectBattery.zendureSolarflow2400AC_N1.status = false;
                    }
                }

                if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    if (zendureSolarflow2400AC_N2_Data?.status === false) {
                        console.info("home_Controller - La batterie Zendure Solarflow 2400 AC numéro 2 n'est pas connectée.");
                        selectBattery.zendureSolarflow2400AC_N2.status = false;
                    }
                }

        /* Logique métier 4 : Calcul de la consommation réelle de la maison */
            /* Encapsulation de la puissance détecté par le compteur Shelly dans une const */
                const shellyPower: number = shellyPro3EM_Data.data.act_power;

            /* Calcul de la consommation réelle de la maison */
                let homePower: number = 0;

                /* Si les deux batteries sont opérationnelles */
                    if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                        homePower = shellyPower - shellyPrise_BatterieZSF2400AC_N1_Data!.data!.apower - shellyPrise_BatterieZSF2400AC_N2_Data!.data!.apower;
                    }
                /* Si une seule la batterie N1 est opérationnelle */
                    else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                        homePower = shellyPower - shellyPrise_BatterieZSF2400AC_N1_Data!.data!.apower;
                    }
                /* Si une seule la batterie N2 est opérationnelle */
                    else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                        homePower = shellyPower - shellyPrise_BatterieZSF2400AC_N2_Data!.data!.apower;
                    }
                /* Si aucune batterie n'est opérationnelle */
                    else {
                        console.error("home_Controller - Erreur dans le calcul de homePower : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                    }

            /* Modification du signe de la puissance pour un bon traitement dans l'utils requestZSF2400AC */
                /* Point de vue batterie */
                const targetPower = -homePower; /* Inversion de la valeur pour la gestion de la batterie */

        /* Logique métier 5 : Vérification de la capacité de chaque batterie */
            if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                const electricLevel_N1 = zendureSolarflow2400AC_N1_Data!.data!.properties!.electricLevel;
                const electricLevel_N2 = zendureSolarflow2400AC_N2_Data!.data!.properties!.electricLevel;

                /* Si on doit charger les batteries : */
                    if (targetPower > 0) {
                        /* Si le niveau de charge est === 100% on change le status sur false pour ne pas utiliser la batterie N1 */
                        if (electricLevel_N1 === 100) {
                            selectBattery.zendureSolarflow2400AC_N1.status = false;
                        }
                        if (electricLevel_N2 === 100) {
                            selectBattery.zendureSolarflow2400AC_N2.status = false;
                        }

                        if (electricLevel_N1 < 100) {
                            selectBattery.zendureSolarflow2400AC_N1.electricLevel = electricLevel_N1;
                        }
                        if (electricLevel_N2 < 100) {
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel = electricLevel_N2;
                        }
                    }
                /* Si on doit décharger les batteries : */
                    if (targetPower < 0) {
                        /* Si le niveau de charge est <= 5% on change le status sur false pour ne pas utiliser la batterie N1 */
                        if (electricLevel_N1 <= 5) {
                            selectBattery.zendureSolarflow2400AC_N1.status = false;
                        }
                        if (electricLevel_N2 <= 5) {
                            selectBattery.zendureSolarflow2400AC_N2.status = false;
                        }

                        if (electricLevel_N1 > 5) {
                            selectBattery.zendureSolarflow2400AC_N1.electricLevel = electricLevel_N1;
                        }
                        if (electricLevel_N2 > 5) {
                            selectBattery.zendureSolarflow2400AC_N2.electricLevel = electricLevel_N2;
                        }
                    }
            }

        /* Logique métier 6 : Préparation  des commandes à envoyer et sélections des batteries et puissance a demander a chacune d'elles */
            let body: BodyRequestHomeController_Type = {
                ZSF2400AC_N1: null,
                ZSF2400AC_N2: null,
            };

            /* Neutre */
            if (targetPower === 0) {
                body = handlePowerRange_Equal_0_Service(selectBattery, body, targetPower);
            }
            /* Charge */
            if (targetPower > 0 && targetPower <= 50) {
                body = handlePowerRange_0_To_50_Service(selectBattery, body, targetPower);
            }
            if (targetPower > 50 && targetPower <= 600) {
                body = handlePowerRange_50_To_600_Service(selectBattery, body, targetPower);
            }
            if (targetPower > 600 && targetPower <= 1200) {
                body = handlePowerRange_600_To_1200_Service(selectBattery, body, targetPower);
            }
            if (targetPower > 1200) {
                body = handlePowerRange_Albove_1200_Service(selectBattery, body, targetPower);
            }
            /* Décharge */
            if (targetPower < 0 && targetPower >= -50) {
                body = handlePowerRange_Neg50_To_0_Service(selectBattery, body, targetPower);
            }
            if (targetPower < -50 && targetPower >= -600) {
                body = handlePowerRange_Neg50_To_Neg600_Service(selectBattery, body, targetPower);
            }
            if (targetPower < -600 && targetPower >= -1200) {
                body = handlePowerRange_Neg600_To_Neg1200_Service(selectBattery, body, targetPower);
            }
            if (targetPower < -1200) {
                body = handlePowerRange_Below_Neg1200_Service(selectBattery, body, targetPower);
            }

        /* Logique métier 7 : Envoi de la commande aux batteries */
            /* Si les 2 batteries sont actives */
                if (body.ZSF2400AC_N1 != null && body.ZSF2400AC_N2 != null) {
                    const [postZendure_1_Result, postZendure_2_Result] = await Promise.all ([
                        fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_1_URL_POST, body.ZSF2400AC_N1),
                        fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_2_URL_POST, body.ZSF2400AC_N2),
                    ]);

                    if (typeof postZendure_1_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                        return;
                    }

                    if (typeof postZendure_2_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N2 :", postZendure_2_Result.error);
                        return;
                    }
                }
                else if (body.ZSF2400AC_N1 != null) {
                    const postZendure_1_Result = await fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_1_URL_POST, body.ZSF2400AC_N1);

                    if (typeof postZendure_1_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                        return;
                    }
                }
                else if (body.ZSF2400AC_N2 != null) {
                    const postZendure_2_Result = await fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_2_URL_POST, body.ZSF2400AC_N2);

                    if (typeof postZendure_2_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N2 :", postZendure_2_Result.error);
                        return;
                    }
                }
                else {
                    console.error("Aucune batterie n'a reçu de commande à exécuter.");
                    return;
                }

            console.log({
                "Compteur Shelly pro 3EM": `${shellyPower} W`,
                "targetPower (point de vue batterie)": `${targetPower} W`,
                "Shelly prise Batterie ZSF2400AC N1": `${shellyPrise_BatterieZSF2400AC_N1_Data!.data!.apower} W`,
                "Shelly prise Batterie ZSF2400AC N2": `${shellyPrise_BatterieZSF2400AC_N2_Data!.data!.apower} W`,
                "Consommation maison": `${homePower} W`,
            })
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans home_Controller :", error);
    }
}

export { home_Controller };
