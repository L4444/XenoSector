export const VehicleModuleUseResult = {
  ON_COOLDOWN: "ON_COOLDOWN",
  LOW_ENERGY: "LOW_ENERGY",
  NO_CHARGES: "NO_CHARGES",
  SUCCESS: "SUCCESS",
};

export type VehicleModuleUseResult =
  (typeof VehicleModuleUseResult)[keyof typeof VehicleModuleUseResult];
