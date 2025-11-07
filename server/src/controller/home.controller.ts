
/* Import des Datas */
import { getShellyPro3EM } from "../database/data_memory/memory.data.js";
import { getShellyPrise_BatterieZSF2400AC_N1 } from "../database/data_memory/memory.data.js";
import { getShellyPrise_BatterieZSF2400AC_N2 } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_N1 } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_N2 } from "../database/data_memory/memory.data.js";

/* Import des Services : */
import { handlePowerRange_Equal_0_Service } from "../services/home_controller/handlePowerRange_Equal_0_Service/handlePowerRange_Equal_0.service.js";
import { handlePowerRange_0_To_50_Service } from "../services/home_controller/handlePowerRange_0_To_50_Service/handlePowerRange_0_To_50.service.js";

/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../types/services/bodyRequestHomeController.type.js";
import type { PostZendureSolarflow2400AC_data_Type } from "../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";
import type { SelectBattery_Type } from "../types/services/selectBattery.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../utils/requestZSF2400AC/requestZSF2400AC.utils.js";
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
                    console.error("home_Controller - Aucunes batteries Zendure Solarflow 2400 AC ne sont connectées.");
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

        /* Logique métier 4 : Vérification de la capacité de chaque batterie */
            if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                const electricLevel = zendureSolarflow2400AC_N1_Data!.data!.properties!.electricLevel;

                if (electricLevel > 5) {
                    selectBattery.zendureSolarflow2400AC_N1.electricLevel = electricLevel;
                }
                if (electricLevel <= 5) {
                     selectBattery.zendureSolarflow2400AC_N1.status = false;
                }
            }

            if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                const electricLevel = zendureSolarflow2400AC_N2_Data!.data!.properties!.electricLevel;

                if (electricLevel > 5) {
                    selectBattery.zendureSolarflow2400AC_N2.electricLevel = electricLevel;
                }
                if (electricLevel <= 5) {
                     selectBattery.zendureSolarflow2400AC_N2.status = false;
                }
            }


        /* Logique métier 5 : Calcul de la consommation réelle de la maison */
            /* Encapsulation de la puissance détecté par le compteur Shelly dans une const */
                const shellyPower: number = shellyPro3EM_Data.data.act_power;

            /* Calcul de la consommation réelle de la maison */
                let homePower: number = 0;

                if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                    homePower = shellyPower - shellyPrise_BatterieZSF2400AC_N1_Data!.data!.apower;
                }

                if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                    homePower = homePower - shellyPrise_BatterieZSF2400AC_N2_Data!.data!.apower;
                }

            /* Modification du signe de la puissance pour un bon traitement dans l'utils requestZSF2400AC */
                /* Point de vue batterie */
                const targetPower = -homePower; /* Inversion de la valeur pour la gestion de la batterie */

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

            /* Situation 1 : Le besoin est situé entre -50w et 50w. Dans ce cas on attribue le travail à une seul batterie */
                if (targetPower >= -50 && targetPower <= 50) {
                    /* Option 1 : targetPower est négatif donc on doit décharger la batterie avec % le plus élevé */
                        if (targetPower < 0) {
                            /* Si les 2 batteries sont disponibles */
                                if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                                    /* Si la batterie 1 a un niveau de charge plus élevé que la batterie 2, c'est lui qui va travailler */
                                    if (selectBattery.zendureSolarflow2400AC_N1.electricLevel >= selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower);
                                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, 0); /* Commande pour mise en veille */
                                    } 
                                    else {
                                        body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, 0); /* Commande pour mise en veille */
                                        body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower);
                                    }
                                }
                            /* Si seul la batterie 1 est disponible */
                                else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower);
                                }
                            /* Si seul la batterie 2 est disponible */
                                else {
                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower);
                                }
                        }
                    }

            /* Situation 2 : Le besoin est supérieur à 50w en charge ou en décharge. Dans ce cas on répartie le travail entre les 2 batteries */
                else {
                    /* Option 1 : targetPower est négatif donc on doit décharger les batteries en foction de la différence de % */
                        if (targetPower < -50) {
                            /* Si les 2 batteries sont disponibles */
                                if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                                    /* Si les batteries ont des niveaux de charge identique */
                                        if (selectBattery.zendureSolarflow2400AC_N1.electricLevel === selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                            body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.5);
                                            body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.5);
                                        }
                                    /* Si la batterie 1 est plus chargée que la batterie 2, on décharge la batterie 1 plus vite que la batterie 2 */
                                        else if (selectBattery.zendureSolarflow2400AC_N1.electricLevel > selectBattery.zendureSolarflow2400AC_N2.electricLevel) {
                                            const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N1.electricLevel - selectBattery.zendureSolarflow2400AC_N2.electricLevel;
                                            
                                            /* Si la différence de % est de 5 ou plus la batterie prend tout le travail */
                                                if (deltaElectricLevel >= 5) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, 0); /* Commande pour mise en veille */
                                                }
                                            /* Si la différence de 4% : N1 = 90% et N2 = 10% */
                                                else if (deltaElectricLevel === 4) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.9);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.1);
                                                }
                                            /* Si la différence de 3% : N1 = 80% et N2 = 20% */
                                                else if (deltaElectricLevel === 3) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.8);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.2);
                                                }
                                            /* Si la différence de 2% : N1 = 70% et N2 = 30% */
                                                else if (deltaElectricLevel === 2) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.7);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.3);
                                                }
                                            /* Si la différence de 1% : N1 = 60% et N2 = 40% */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.6);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.4);
                                                }
                                        }
                                    /* Si la batterie 2 est plus chargée que la batterie 1, on décharge la batterie 2 plus vite que la batterie 1 */
                                        else {
                                            const deltaElectricLevel: number = selectBattery.zendureSolarflow2400AC_N2.electricLevel - selectBattery.zendureSolarflow2400AC_N1.electricLevel;
                                            
                                            /* Si la différence de % est de 5 ou plus la batterie prend tout le travail */
                                                if (deltaElectricLevel >= 5) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, 0); /* Commande pour mise en veille */
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower);
                                                }
                                            /* Si la différence de 4% : N2 = 90% et N1 = 10% */
                                                else if (deltaElectricLevel === 4) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.1);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.9);
                                                }
                                            /* Si la différence de 3% : N2 = 80% et N1 = 20% */
                                                else if (deltaElectricLevel === 3) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.2);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.8);
                                                }
                                            /* Si la différence de 2% : N2 = 70% et N1 = 30% */
                                                else if (deltaElectricLevel === 2) {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.3);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.7);
                                                }
                                            /* Si la différence de 1% : N2 = 60% et N1 = 40% */
                                                else {
                                                    body.ZSF2400AC_N1 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data!.data!.sn, targetPower * 0.4);
                                                    body.ZSF2400AC_N2 = requestZSF2400AC_Utils(zendureSolarflow2400AC_N2_Data!.data!.sn, targetPower * 0.6);
                                                }
                                        }

                                }
                        }
                    /* Option 2 : targetPower est positif on doit donc charger les batteries en fonctions de la différence de % */
                }


        /* Logique métier 7 : Préparation de la commande à envoyer aux batteries */
            /* Option 1 :  */
            // const body = requestZSF2400AC_Utils(zendureSolarflow2400AC_N1_Data.data.sn, targetPower);

            // if (body == null) {
            //     return
            // }

        /* Logique métier 5 : Envoi de la commande aux batteries */
            const [postZendure_1_Result, postZendure_2_Result] = await Promise.all ([
                fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_1_URL_POST, body),
                fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_2_URL_POST, body),
            ]);

            if (typeof postZendure_1_Result.error === "string") {
                console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                return;
            }

            if (typeof postZendure_2_Result.error === "string") {
                console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N2 :", postZendure_2_Result.error);
                return;
            }

            console.log({
                "Compteur Shelly 3EM": `${shellyPower} W`,
                "Prise Shelly Batterie": `${shellyPrise_BatterieZSF2400AC_N1_Power} W`,
                "Consommation maison": `${homePower} W`,
            })
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans home_Controller :", error);
    }
}

export { home_Controller };
