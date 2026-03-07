import type ModuleAction from "../actions/ModuleAction";

export default interface VehicleModuleData {
  moduleName: string;
  cooldownDuration: number;
  chargeDuration: number;
  energyCost: number;
  uiTextureName: string;
  playerKeyBind: string;
  maxCharges: number;
  actions: Array<ModuleAction>;
}
