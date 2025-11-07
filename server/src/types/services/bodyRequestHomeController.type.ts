import type { BodyRequestChargeZSF2400AC_Type } from "../bodyRequestZSF2400AC_type/bodyRequestChargeZSF2400AC.type.js";
import type { BodyRequestDischargeZSF2400AC_Type } from "../bodyRequestZSF2400AC_type/bodyRequestDischargeZSF2400AC.type.js";

type BodyRequestHomeController_Type = {
    ZSF2400AC_N1: BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type | null;
    ZSF2400AC_N2: BodyRequestChargeZSF2400AC_Type | BodyRequestDischargeZSF2400AC_Type | null;
};

export type { BodyRequestHomeController_Type }
