export const KeyboardControlStyle = {
  RELATIVE: "RELATIVE",
  ABSOLUTE: "ABSOLUTE",
  TANKCONTROLS: "TANKCONTROLS",
};
export type KeyboardControlStyle =
  (typeof KeyboardControlStyle)[keyof typeof KeyboardControlStyle];
