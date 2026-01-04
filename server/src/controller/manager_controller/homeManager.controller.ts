/* Import des Controllers */
import { shellyPro3EM_Controller } from "../shelly_controller/shellyPro3EM.controller.js";
import { shellyPriseZSF2400ACN1_Controller } from "../shelly_controller/shellyPriseZSF2400ACN1.controller.js";
import { shellyPriseZSF2400ACN2_Controller } from "../shelly_controller/shellyPriseZSF2400ACN2.controller.js";
import { zendureSolarflow2400ACN1_Controller } from "../zendure_controller/zendureSolarflow2400ACN1.controller.js";
import { zendureSolarflow2400ACN2_Controller } from "../zendure_controller/zendureSolarflow2400ACN2.controller.js";
import { home_Controller } from "../home.controller.js";

async function homeManager_Controller(): Promise<void> {
    try {
        const start = Date.now();
        /* Logique métier 1 : Lancement des controller secondaires en même temps */
            await Promise.all(
                [
                    shellyPro3EM_Controller(),
                    shellyPriseZSF2400ACN1_Controller(),
                    shellyPriseZSF2400ACN2_Controller(),
                    zendureSolarflow2400ACN1_Controller(),
                    zendureSolarflow2400ACN2_Controller(),
                ]
            );
        
        /* Logique métier 2 : Lancement du controller principal */
            await home_Controller();
        
        const end = Date.now();
        console.log(`[homeManager_Controller] - Durée d'exécution totale : ${end - start} ms`);
    }
    catch (error) {
        console.error(`[homeManager_Controller] - Une erreur inconnue est survenue : `, error);
    }
}

export { homeManager_Controller };
