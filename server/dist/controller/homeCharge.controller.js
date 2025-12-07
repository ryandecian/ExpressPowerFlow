/* Import des Datas */
import { setSystemOverview_Memory } from "../database/data_memory/systemOverview.data.memory.js";
/* Import des Services : */
import { handlePowerRange_Above_6500_security_Service } from "../services/homeCharge_controller/handlePowerRange_Above_6500.security.service.js";
import { handlePowerRange_Above_9000_Service } from "../services/homeCharge_controller/handlePowerRange_Above_9000.service.js";
import { handlePowerRange_Below_8700_Service } from "../services/homeCharge_controller/handlePowerRange_Below_8700.service.js";
/* Import des Utils */
import { selectDataDevice_Service } from "../services/verifs/selectDataDevice.service.js";
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
        else if (shellyPower > 8700) {
            body = handlePowerRange_Above_9000_Service(body, shellyPower, selectBattery, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N1_Power, selectDataDevice_Result.shellyPrise_BatterieZSF2400AC_N2_Power);
        }
        else if (shellyPower <= 8700) {
            body = handlePowerRange_Below_8700_Service(body, shellyPower, selectBattery);
        }
    }
    catch (error) {
        console.error("Erreur dans le controller homeCharge_Controller :", error);
    }
}
export { homeCharge_Controller };
