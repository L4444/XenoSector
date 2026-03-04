export const ShipSystemUseResult = {
  ON_COOLDOWN: "ON_COOLDOWN",
  LOW_ENERGY: "LOW_ENERGY",
  NO_CHARGES: "NO_CHARGES",
  SUCCESS: "SUCCESS",
};

export type ShipSystemUseResult =
  (typeof ShipSystemUseResult)[keyof typeof ShipSystemUseResult];
