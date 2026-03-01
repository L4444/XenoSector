import type ProjectileData from "./ProjectileData";

export default interface ShipSystemData {
  systemName: string;
  cooldownDuration: number;
  reuseDuration: number;
  chargeDuration: number;
  energyCost: number;
  projectileData: ProjectileData;
  uiTextureName: string;
  playerKeyBind: string;
  maxCharges: number;
}
