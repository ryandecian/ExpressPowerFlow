/* Import des Datas */
import { getLastRequest_ZSF2400AC_Memory } from "../../database/data_memory/batteryLastRequest.data.memory.js";
import { setLastRequest_ZSF2400AC_Memory } from "../../database/data_memory/batteryLastRequest.data.memory.js";

/* Import des Types */
import type { BodyRequestHomeController_Type } from "../../types/services/bodyRequestHomeController.type.js";
import type { SelectBattery_Type } from "../../types/services/selectBattery.type.js";

function saveLastRequest_ZSF2400AC_Service(selectBattery: SelectBattery_Type, body: BodyRequestHomeController_Type): void {}

export { saveLastRequest_ZSF2400AC_Service };
