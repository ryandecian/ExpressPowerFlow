/* Import des Controllers */
import { shellyPro3EM_Controller } from "../shelly_controller/shellyPro3EM.controller.js";
import { shellyPriseZSF2400ACN1_Controller } from "../shelly_controller/shellyPriseZSF2400ACN1.controller.js";
import { shellyPriseZSF2400ACN2_Controller } from "../shelly_controller/shellyPriseZSF2400ACN2.controller.js";
import { zendureSolarflow2400ACN1_Controller } from "../zendure_controller/zendureSolarflow2400ACN1.controller.js";
import { zendureSolarflow2400ACN2_Controller } from "../zendure_controller/zendureSolarflow2400ACN2.controller.js";

async function homeManager_Controller(): Promise<void> {
    try {
        /* Logique métier 1 : Initialisation des variables */
            let shellyPro3EM_Controle: boolean = false;
            let shellyPriseZSF2400ACN1_Controle: boolean = false;
            let shellyPriseZSF2400ACN2_Controle: boolean = false;
            let zendureSolarflow2400ACN1_Controle: boolean = false;
            let zendureSolarflow2400ACN2_Controle: boolean = false;

        /* Logique métier 2 : Lancement des controller en même temps */
            [
                shellyPro3EM_Controle, 
                shellyPriseZSF2400ACN1_Controle, 
                shellyPriseZSF2400ACN2_Controle, 
                zendureSolarflow2400ACN1_Controle, 
                zendureSolarflow2400ACN2_Controle
            ] = await Promise.all
            (
                [
                    shellyPro3EM_Controller(),
                    shellyPriseZSF2400ACN1_Controller(),
                    shellyPriseZSF2400ACN2_Controller(),
                    zendureSolarflow2400ACN1_Controller(),
                    zendureSolarflow2400ACN2_Controller(),
                ]
            );
    }
    catch (error) {
        console.error(`[homeManager_Controller] - Une erreur inconnue est survenue : `, error);
    }
}