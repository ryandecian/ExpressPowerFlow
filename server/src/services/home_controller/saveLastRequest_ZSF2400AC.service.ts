/* Import des Datas */
import { setLastRequest_ZSF2400AC_N1_Memory } from "../../database/data_memory/batteryLastRequest.data.memory.js";
import { setLastRequest_ZSF2400AC_N2_Memory } from "../../database/data_memory/batteryLastRequest.data.memory.js";

/* Import des Types */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

function saveLastRequest_ZSF2400AC_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type): void {
    /* Vérification 1 : status true + body non null = Commande différente donc enregistrement */
        if (selectBattery.zendureSolarflow2400AC_N1.status === true && body.ZSF2400AC_N1 != null) {
            setLastRequest_ZSF2400AC_N1_Memory(body.ZSF2400AC_N1);
        }
        if (selectBattery.zendureSolarflow2400AC_N2.status === true && body.ZSF2400AC_N2 != null) {
            setLastRequest_ZSF2400AC_N2_Memory(body.ZSF2400AC_N2);
        }
    /* vérification 2 : status false + body null = réinitialisation */
        if (selectBattery.zendureSolarflow2400AC_N1.status === false && body.ZSF2400AC_N1 == null) {
            setLastRequest_ZSF2400AC_N1_Memory(null);
        }
        if (selectBattery.zendureSolarflow2400AC_N2.status === false && body.ZSF2400AC_N2 == null) {
            setLastRequest_ZSF2400AC_N2_Memory(null);
        }
}

export { saveLastRequest_ZSF2400AC_Service };
