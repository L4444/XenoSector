import type SystemEffect from "../SystemEffects/SystemEffect";

export default interface ShipSystemData {
  systemName: string;
  cooldownDuration: number;
  castDuration: number;
  chargeDuration: number;
  energyCost: number;
  uiTextureName: string;
  playerKeyBind: string;
  maxCharges: number;
  effects: Array<SystemEffect>;
}
