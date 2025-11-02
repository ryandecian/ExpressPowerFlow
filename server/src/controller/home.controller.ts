
/* Import des Datas */
import { get } from "http";
import { getShelly3EMSnapshot } from "../database/data_memory/memory.data.js";
import { getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot } from "../database/data_memory/memory.data.js";
import { getZendureSolarflow2400AC_1_Snapshot } from "../database/data_memory/memory.data.js";

/* Import des Types : */
import type { PostZendureSolarflow2400AC_data_Type } from "../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";

/* Import des Utils */
import { adjustZendureChargePower } from "../utils/ajustement/adjustZendureChargePower.utils.js";
import { adjustZendureDischargePower } from "../utils/ajustement/adjustZendureDischargePower.utils.js";
import { fetch_Utils } from "../utils/fetch.utils.js";

const ZENDURE_URL_POST = "http://192.168.1.26/properties/write";

async function home_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur et des prises de batteries */
            const shelly3EMData = await getShelly3EMSnapshot();
            const shellyPlugZendure_1_Data = await getShellyPlugSGen3_BatterieZSF2400AC_1_Snapshot();

            if (shelly3EMData == null || shellyPlugZendure_1_Data == null) {
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

        /* Logique métier 3 : Calcul de la consommation réelle de la maison */
            const shellyPlugZendure_1_Power = shellyPlugZendure_1_Data.data.apower;
            const shellyPower = shelly3EMData.data.power;
            const homePower = shellyPower - shellyPlugZendure_1_Power; /* Valeur positive = consomation EDF et Valeur négative = injection EDF */

        /* Logique métier 4 : Préparation de la commande à envoyer aux batteries */
            let commande: number = 0;
            const homePowerAbs = Math.abs(homePower); /* Conversion de la valeur en positif */
            let body = {};

            /* Si la consommation de la maison est négative, on charge la batterie */
            if (homePower < 0) {
                commande = adjustZendureChargePower(homePowerAbs);
                body = {
                    sn: getZendureSolarflow2400AC_1_Snapshot()?.data.sn, /* Numéro de série de l'appareil cible */
                    properties: {
                        acMode: 1, /* Commande charge */
                        inputLimit: commande, /* Commande : puissance de charge demandée */
                    }
                };
            }

            /* Si la consommation de la maison est positive, on décharge la batterie */
            if (homePower > 0) {
                commande = adjustZendureDischargePower(homePowerAbs);
                body = {
                    sn: getZendureSolarflow2400AC_1_Snapshot()?.data.sn, /* Numéro de série de l'appareil cible */
                    properties: {
                        acMode: 2, /* Commande décharge */
                        outputLimit: commande, /* Commande : puissance de décharge demandée */
                    }
                };
            }

        /* Logique métier 5 : Envoi de la commande aux batteries */
            const postZendureResult = await fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZENDURE_URL_POST, body);

            if (typeof postZendureResult.error === "string") {
                console.error("Une erreur est survenue lors de l'envoi de la commande à la Batterie Zendure Solarflow 2400 AC :", postZendureResult.error);
                return;
            }
    }
    catch (error) {
        console.error("Une erreur inconnue est survenue dans home_Controller :", error);
    }
}

export { home_Controller };
