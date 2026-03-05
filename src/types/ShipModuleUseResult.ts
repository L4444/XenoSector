export const ShipModuleUseResult = {
  ON_COOLDOWN: "ON_COOLDOWN",
  LOW_ENERGY: "LOW_ENERGY",
  NO_CHARGES: "NO_CHARGES",
  SUCCESS: "SUCCESS",
};

export type ShipModuleUseResult =
  (typeof ShipModuleUseResult)[keyof typeof ShipModuleUseResult];
