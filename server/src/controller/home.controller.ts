/* Import des Services : */
import { handlePowerRange_Equal_0_Service } from "../services/home_controller/handlePowerRange_Equal_0.service.js";
import { handlePowerRange_0_To_50_Service } from "../services/home_controller/handlePowerRange_0_To_50.service.js";
import { handlePowerRange_50_To_600_Service } from "../services/home_controller/handlePowerRange_50_To_600.service.js";
import { handlePowerRange_600_To_1200_Service } from "../services/home_controller/handlePowerRange_600_To_1200.service.js";
import { handlePowerRange_Above_1200_Service } from "../services/home_controller/handlePowerRange_Above_1200.service.js";
import { handlePowerRange_Neg50_To_0_Service } from "../services/home_controller/handlePowerRange_Neg50_To_0.service.js";
import { handlePowerRange_Neg50_To_Neg600_Service } from "../services/home_controller/handlePowerRange_Neg50_To_Neg600.service.js";
import { handlePowerRange_Neg600_To_Neg1200_Service } from "../services/home_controller/handlePowerRange_Neg600_To_Neg1200.service.js";
import { handlePowerRange_Below_Neg1200_Service } from "../services/home_controller/handlePowerRange_Below_Neg1200.service.js";
import { verifLastRequest_ZSF2400AC_Service } from "../services/verifs/verifLastRequest_ZSF2400AC.service.js";
import { saveLastRequest_ZSF2400AC_Service } from "../services/verifs/saveLastRequest_ZSF2400AC.service.js";
import { SelectDataDevice_Type } from "../types/services/selectDataDevice.type.js";

/* Import des Types : */
import type { BodyRequestHomeController_Type } from "../types/services/bodyRequestHomeController.type.js";
import type { PostZendureSolarflow2400AC_data_Type } from "../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";
import type { SelectBattery_Type } from "../types/services/selectBattery.type.js";

/* Import des Utils */
import { fetch_Utils } from "../utils/fetch.utils.js";
import { selectDataDevice_Service } from "../services/verifs/selectDataDevice.service.js";

const ZSF2400AC_1_URL_POST = "http://192.168.1.26/properties/write";
const ZSF2400AC_2_URL_POST = "http://192.168.1.83/properties/write";

async function home_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données des appareils, analyse et attribution d'un status */            
            const selectDataDevice_Result: SelectDataDevice_Type | null = selectDataDevice_Service("home_Controller");
            /* Si selectDataDevice_Result est null c'est que le controller est dans l'impossibilité de continuer car manque de datas */
            if (selectDataDevice_Result === null) {
                return;
            }

            let selectBattery: SelectBattery_Type = selectDataDevice_Result.selectBattery;

        /* Logique métier 2 : Calcul de la consommation réelle de la maison */
            /* Encapsulation de la puissance détecté par le compteur Shelly dans une const */
                const shellyPower: number = selectDataDevice_Result.shellyPro3EM_Power;

            /* Calcul de la consommation réelle de la maison */
                let homePower: number = 0;

                /* Si les deux batteries sont opérationnelles */
                    if (selectBattery.zendureSolarflow2400AC_N1.status === true && selectBattery.zendureSolarflow2400AC_N2.status === true) {
                        homePower = shellyPower - selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power - selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power;
                    }
                /* Si une seule la batterie N1 est opérationnelle */
                    else if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                        homePower = shellyPower - selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power;
                    }
                /* Si une seule la batterie N2 est opérationnelle */
                    else if (selectBattery.zendureSolarflow2400AC_N2.status === true) {
                        homePower = shellyPower - selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power;
                    }
                /* Si aucune batterie n'est opérationnelle */
                    else {
                        console.error("home_Controller - Erreur dans le calcul de homePower : Aucunes batteries Zendure Solarflow 2400 AC ne sont opérationnelles.");
                    }

            /* Modification du signe de la puissance pour un bon traitement dans l'utils requestZSF2400AC */
                /* Point de vue batterie */
                const targetPower = -homePower; /* Inversion de la valeur pour la gestion de la batterie (Point de vue batterie)*/

        /* Logique métier 3 : Vérification de la capacité de chaque batterie */
            if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
                const electricLevel_N1 = selectBattery.zendureSolarflow2400AC_N1.electricLevel;
                const electricLevel_N2 = selectBattery.zendureSolarflow2400AC_N2.electricLevel;

                /* Si on doit charger les batteries : */
                    if (targetPower < 0) {
                        /* Si le niveau de charge est === 100% on change le status sur false pour ne pas utiliser la batterie N1 */
                        if (electricLevel_N1 === 100) {
                            selectBattery.zendureSolarflow2400AC_N1.status = false;
                        }
                        if (electricLevel_N2 === 100) {
                            selectBattery.zendureSolarflow2400AC_N2.status = false;
                        }
                    }
                /* Si on doit décharger les batteries : */
                    if (targetPower > 0) {
                        /* Si le niveau de charge est <= 5% on change le status sur false pour ne pas utiliser la batterie N1 */
                        if (electricLevel_N1 <= 5) {
                            selectBattery.zendureSolarflow2400AC_N1.status = false;
                        }
                        if (electricLevel_N2 <= 5) {
                            selectBattery.zendureSolarflow2400AC_N2.status = false;
                        }
                    }
            }

        /* Logique métier 4 : Préparation  des commandes à envoyer et sélections des batteries et puissance a demander a chacune d'elles */
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
                body = handlePowerRange_Above_1200_Service(selectBattery, body, targetPower);
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

        /* Logique métier 5 : Vérification des dernières commandes envoyées aux batteries pour éviter les doublons */
            body = verifLastRequest_ZSF2400AC_Service(body);

        /* Logique métier 6 : Envoi de la commande aux batteries */
            /* Si les 2 batteries sont actives */
                if (body.ZSF2400AC_N1 != null && body.ZSF2400AC_N2 != null) {
                    const [postZendure_1_Result, postZendure_2_Result] = await Promise.all ([
                        fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_1_URL_POST, body.ZSF2400AC_N1),
                        fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZSF2400AC_2_URL_POST, body.ZSF2400AC_N2),
                    ]);

                    if (typeof postZendure_1_Result.error === "string" && typeof postZendure_2_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi descommandes aux Batteries Zendure Solarflow 2400 AC N1 et N2 :", postZendure_1_Result.error, postZendure_2_Result.error);
                        return;
                    }
                    else if (typeof postZendure_1_Result.error === "string") {
                        console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                        return;
                    }
                    else {
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
        
        /* Logique métier 7 : Sauvegarde des dernières commandes envoyées en mémoire */
            saveLastRequest_ZSF2400AC_Service(selectBattery, body);

            console.log({
                "Compteur Shelly pro 3EM": `${shellyPower} W`,
                "targetPower (point de vue batterie)": `${targetPower} W`,
                "Shelly prise Batterie ZSF2400AC N1": `${selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power} W`,
                "Shelly prise Batterie ZSF2400AC N2": `${selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power} W`,
                "Consommation maison": `${homePower} W`,
            })
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans home_Controller :", error);
    }
}

export { home_Controller };
