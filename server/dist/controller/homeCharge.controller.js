/* Import des Datas */
import { setSystemOverview_Memory } from "../database/data_memory/systemOverview.data.memory.js";
/* Import des Services : */
import { handlePowerRange_Above_6500_security_Service } from "../services/homeCharge_controller/handlePowerRange_Above_6500.security.service.js";
// import { handlePowerRange_Above_9000_Service } from "../services/homeCharge_controller/handlePowerRange_Above_9000.service.js";
import { handlePowerRange_Below_8700_Service } from "../services/homeCharge_controller/handlePowerRange_Below_8700.service.js";
import { saveLastRequest_ZSF2400AC_Service } from "../services/verifs/saveLastRequest_ZSF2400AC.service.js";
import { selectDataDevice_Service } from "../services/verifs/selectDataDevice.service.js";
import { verifLastRequest_ZSF2400AC_Service } from "../services/verifs/verifLastRequest_ZSF2400AC.service.js";
/* Import des Utils */
import { fetch_Utils } from "../utils/fetch.utils.js";
const ZSF2400AC_1_URL_POST = "http://192.168.1.26/properties/write";
const ZSF2400AC_2_URL_POST = "http://192.168.1.83/properties/write";
async function homeCharge_Controller() {
    try {
        /* Logique métier 1 : Récupération des datas nécessaires depuis la mémoire */
        const selectDataDevice_Result = selectDataDevice_Service("homeCharge_Controller");
        /* Si selectDataDevice_Result est null c'est que le controller est dans l'impossibilité de continuer car manque de datas */
        if (selectDataDevice_Result === null) {
            return;
        }
        let selectBattery = selectDataDevice_Result.selectBattery;
        /* Logique métier 2 : Calcul de la consommation réelle de la maison */
        /* Encapsulation de la puissance détecté par le compteur Shelly dans une const */
        const shellyPower = selectDataDevice_Result.shellyPro3EM_Power;
        /* Calcul de la consommation réelle de la maison */
        let homePower = 0;
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
        /* Sauvegarde de la puissance de la maison en mémoire */
        setSystemOverview_Memory("homePower", homePower);
        /* Logique métier 3 : Vérification de la capacité de chaque batterie */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true) {
            const electricLevel_N1 = selectBattery.zendureSolarflow2400AC_N1.electricLevel;
            const electricLevel_N2 = selectBattery.zendureSolarflow2400AC_N2.electricLevel;
            if (electricLevel_N1 === 100) {
                selectBattery.zendureSolarflow2400AC_N1.status = false;
            }
            if (electricLevel_N2 === 100) {
                selectBattery.zendureSolarflow2400AC_N2.status = false;
            }
        }
        /* Logique métier 4 : Préparation  des commandes à envoyer et sélections des batteries et puissance a demander a chacune d'elles */
        let body = {
            ZSF2400AC_N1: null,
            ZSF2400AC_N2: null,
        };
        if (homePower > 6500) {
            /* Sécurité qui n'arrivera normalement jamais car les prise sécurise la consommation maison en se coupant */
            /* On doit décharger les batteries et maintenir à un niveau de sécurité, cible 6500w. HomePower n'incluant pas la puissance des batteries, il s'agit donc bien de la consomation maison */
            body = handlePowerRange_Above_6500_security_Service(body, selectBattery, homePower);
        }
        /* Ajustement de la puissance en temps réel */
        else {
            body = handlePowerRange_Below_8700_Service(body, shellyPower, selectBattery, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power);
        }
        // else if (shellyPower <= 8700) {
        //     body = handlePowerRange_Below_8700_Service(body, shellyPower, selectBattery, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power);
        // }
        /* Logique métier 5 : Vérification des dernières commandes envoyées aux batteries pour éviter les doublons */
        body = verifLastRequest_ZSF2400AC_Service(body);
        /* Logique métier 6 : Envoi de la commande aux batteries */
        /* Si les 2 batteries sont actives */
        if (body.ZSF2400AC_N1 != null && body.ZSF2400AC_N2 != null) {
            const [postZendure_1_Result, postZendure_2_Result] = await Promise.all([
                fetch_Utils("POST", ZSF2400AC_1_URL_POST, body.ZSF2400AC_N1),
                fetch_Utils("POST", ZSF2400AC_2_URL_POST, body.ZSF2400AC_N2),
            ]);
            if (postZendure_1_Result.error && postZendure_2_Result.error) {
                console.error("[Home_Controller] - Une erreur est survenue lors de l'envoi des commandes aux Batteries Zendure Solarflow 2400 AC N1 et N2 :", postZendure_1_Result.error, postZendure_2_Result.error);
                return;
            }
            else if (postZendure_1_Result.error) {
                console.error("[Home_Controller] - Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                return;
            }
            else if (postZendure_2_Result.error) {
                console.error("[Home_Controller] - Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N2 :", postZendure_2_Result.error);
                return;
            }
        }
        /* Si seule batterie N1 est active */
        else if (body.ZSF2400AC_N1 != null) {
            const postZendure_1_Result = await fetch_Utils("POST", ZSF2400AC_1_URL_POST, body.ZSF2400AC_N1);
            if (postZendure_1_Result.error) {
                console.error("[Home_Controller] - Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N1 :", postZendure_1_Result.error);
                return;
            }
        }
        /* Si seule batterie N2 est active */
        else if (body.ZSF2400AC_N2 != null) {
            const postZendure_2_Result = await fetch_Utils("POST", ZSF2400AC_2_URL_POST, body.ZSF2400AC_N2);
            if (postZendure_2_Result.error) {
                console.error("[Home_Controller] - Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC N2 :", postZendure_2_Result.error);
                return;
            }
        }
        /* Si aucune batterie n'est active */
        else {
            console.error("[Home_Controller] - Aucune batterie n'a reçu de commande à exécuter.");
            return;
        }
        /* Logique métier 7 : Sauvegarde des dernières commandes envoyées en mémoire */
        saveLastRequest_ZSF2400AC_Service(selectBattery, body);
    }
    catch (error) {
        console.error("Erreur dans le controller homeCharge_Controller :", error);
    }
}
export { homeCharge_Controller };
