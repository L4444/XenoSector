import type ModuleAction from "../actions/ModuleAction";

export default interface ShipModuleData {
  moduleName: string;
  cooldownDuration: number;
  chargeDuration: number;
  energyCost: number;
  uiTextureName: string;
  playerKeyBind: string;
  maxCharges: number;
  actions: Array<ModuleAction>;
}
