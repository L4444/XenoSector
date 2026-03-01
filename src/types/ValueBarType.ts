export const ValueBarType = {
  HP: "HP",
  ENERGY: "ENERGY",
  COOLDOWN: "COOLDOWN",
};

export type ValueBarType = (typeof ValueBarType)[keyof typeof ValueBarType];
