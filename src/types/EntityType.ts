export const EntityType = {
  SHIP: "SHIP",
  PROJECTILE: "PROJECTILE",
  STATIC: "STATIC",
} as const;

export type EntityType = (typeof EntityType)[keyof typeof EntityType];
