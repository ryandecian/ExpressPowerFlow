
/* Import des Datas */
import { getShelly3EMSnapshot } from "../database/data_memory/memory.data.js";
import { getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_1_Snapshot } from "../database/data_memory/memory.data.js";

/* Import des Types : */
import type { PostZendureSolarflow2400AC_data_Type } from "../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";

/* Import des Utils */
import { requestZSF2400AC_Utils } from "../utils/requestZSF2400AC/requestZSF2400AC.utils.js";
import { fetch_Utils } from "../utils/fetch.utils.js";

const ZSF2400AC_1_URL_POST = "http://192.168.1.26/properties/write";
const ZSF2400AC_2_URL_POST = "http://192.168.1.83/properties/write";

async function home_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur et des prises de batteries */
            const shelly3EMData = getShelly3EMSnapshot();
            const shellyPlugZendure_1_Data = getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot();
            const zendureSolarflow2400AC_1_Data = getZendureSolarflow2400AC_1_Snapshot();

            if (shelly3EMData == null || shellyPlugZendure_1_Data == null || zendureSolarflow2400AC_1_Data == null) {
                console.error("home_Controller - Les données du compteur ou des prises de batteries ne sont pas encore disponibles.");
                return;
            }

        /* Logique métier 2 : Vérification du status de connection */
            if (shelly3EMData.status === false) {
                console.error("home_Controller - Le compteur Shelly 3EM n'est pas connecté.");
                return;
            }

            if (shellyPlugZendure_1_Data.status === false) {
                console.error("home_Controller - La prise Shelly Plug S Gen 3 de la Batterie Zendure numéro 1 n'est pas connectée.");
                return;
            }

            if (zendureSolarflow2400AC_1_Data.status === false) {
                console.error("home_Controller - La batterie Zendure Solarflow 2400 AC numéro 1 n'est pas connectée.");
                return;
            }

        /* Logique métier 3 : Calcul de la consommation réelle de la maison */
            const shellyPlugZendure_1_Power = shellyPlugZendure_1_Data.data.apower; /* Etat de la puissance fournie par la Batterie */
            const shellyPower = shelly3EMData.data.power; /* Etat de la puissance totale de la maison */
            const homePower = shellyPower - shellyPlugZendure_1_Power; /* Valeur positive = consomation EDF et Valeur négative = injection EDF */
            const targetPower = -homePower; /* Inversion de la valeur pour la gestion de la batterie */

        /* Logique métier 4 : Préparation de la commande à envoyer aux batteries */
            const body = requestZSF2400AC_Utils(zendureSolarflow2400AC_1_Data.data.sn, targetPower);

            if (body == null) {
                return
            }

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
                "Prise Shelly Batterie": `${shellyPlugZendure_1_Power} W`,
                "Consommation maison": `${homePower} W`,
            })
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans home_Controller :", error);
    }
}

export { home_Controller };
