import type { AclRuleBroker_Type } from "./aclRuleBroker.type.js";
import type { UserBroker_Type } from "./userBroker.type.js";

type MqttConfigBrocker_Type = {
    enabled: boolean;
    port: number;
    clientsMax?: number;
    users: UserBroker_Type[];
    acl: AclRuleBroker_Type[];
};

export type { MqttConfigBrocker_Type };
