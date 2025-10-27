/* Import des Types : */
import type { GetShelly3EM_emeter_data_Type } from "../../types/dataFetch_type/getShelly3EM.emeter.data.type.js";
import type { GetZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/getZendureSolarflow2400AC.data.type.js";
import type { PostZendureSolarflow2400AC_data_Type } from "../../types/dataFetch_type/postZendureSorlarflow2400AC.data.type.js";

/* Import des Utils */
import { fetch_Utils } from "../../utils/fetch.utils.js";

const SHELLY_URL = "http://192.168.1.23/emeter/0";
const ZENDURE_URL = "http://192.168.1.26/properties/report";
const ZENDURE_URL_POST = "http://192.168.1.26/properties/write";

async function shellyPower_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Récupération des données du compteur et de la batterie */
        const [dataShellyResult, dataZendureResult] = await Promise.all([
            fetch_Utils<GetShelly3EM_emeter_data_Type>("GET", SHELLY_URL),
            fetch_Utils<GetZendureSolarflow2400AC_data_Type>("GET", ZENDURE_URL)
        ]);

        const dataShelly = dataShellyResult.data as GetShelly3EM_emeter_data_Type;
        const dataZendure = dataZendureResult.data as GetZendureSolarflow2400AC_data_Type;


        /* Calcul du flux de puissance du Zendure */
        let zendurePower: number | string = "inconnue";
        if (dataZendure.properties.packInputPower > 0) {
            zendurePower = -dataZendure.properties.packInputPower;
        }
        if (dataZendure.properties.outputPackPower > 0) {
            zendurePower = dataZendure.properties.outputPackPower;
        }

        /* Logique métier 2 : Préparation de la commande a envoyer a zendure */
            let body = {}
            /* Si Shelly positif donc besoin de puissance */
            if (dataShelly.power > 0) {
                /* Si Zendure en décharge */
                if (dataZendure.properties.packState === 2) {
                    /* Calcul de l'injection a ajuster */
                    const injection: number = dataShelly.power + dataZendure.properties.outputPackPower;

                    body = {
                        sn: dataZendure.sn, /* Numéro de série de l'appareil cible */
                        properties: {
                            acMode: 2, /* Commande décharge */
                            outputLimit: injection, /* Commande : puissance de décharge demandée */
                        }
                    }
                }
                /* Si Zendure en charge */
                if (dataZendure.properties.packState === 1) {
                    /* Passage de l'état de charge à décharge */
                    /* Calcul de l'injection a demander */
                    let injection: number = dataShelly.power - dataZendure.properties.packInputPower;

                    if (injection < 0) {
                        const charge = -injection;

                        body = {
                            sn: dataZendure.sn, /* Numéro de série de l'appareil cible */
                            properties: {
                                acMode: 1, /* Commande charge */
                                inputLimit: charge, /* Commande : puissance de charge demandée */
                            }
                        }
                    }

                    if (injection > 0) {
                        body = {
                            sn: dataZendure.sn, /* Numéro de série de l'appareil cible */
                            properties: {
                                acMode: 2, /* Commande décharge */
                                outputLimit: injection, /* Commande : puissance de décharge demandée */
                            }
                        }
                    }

                }
            }
            /* Si Shelly négatif donc surplus de puissance */
            if (dataShelly.power < 0) {
                /* Si Zendure en décharge */
                if (dataZendure.properties.packState === 2) {
                    /* Passage de l'état de décharge à charge */
                    /* Calcul de la charge a demander */
                    let charge: number = -dataShelly.power - dataZendure.properties.outputPackPower;
                    if (charge < 0) {
                        charge = -charge;
                    }

                    body = {
                        sn: dataZendure.sn, /* Numéro de série de l'appareil cible */
                        properties: {
                            acMode: 1, /* Commande charge */
                            inputLimit: charge, /* Commande : puissance de charge demandée */
                        }
                    }
                }
                /* Si Zendure en charge */
                if (dataZendure.properties.packState === 1) {
                    /* Calcul de la charge a ajuster */
                    const charge: number = -dataShelly.power + dataZendure.properties.packInputPower;

                    body = {
                        sn: dataZendure.sn, /* Numéro de série de l'appareil cible */
                        properties: {
                            acMode: 1, /* Commande charge */
                            inputLimit: charge, /* Commande : puissance de charge demandée */
                        }
                    }
                }
            }

        /* Logique métier 3 : Envois de la commande a zendure */
            const postZendureResult = await fetch_Utils<PostZendureSolarflow2400AC_data_Type>("POST", ZENDURE_URL_POST, body);

            console.log(`Shelly = ${dataShelly.power} W / Zendure = ${zendurePower}W`);
    }
    catch (error) {
        console.error("Erreur lors de la lecture du Shelly :", error);
    }
}

export { shellyPower_Controller };
