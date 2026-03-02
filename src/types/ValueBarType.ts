export const ValueBarType = {
  HP: "HP",
  ENERGY: "ENERGY",
  WAIT: "WAIT",
};

export type ValueBarType = (typeof ValueBarType)[keyof typeof ValueBarType];
