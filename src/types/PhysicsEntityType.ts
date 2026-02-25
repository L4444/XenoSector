export const PhysicsEntityType = {
  STATIC: "STATIC",
  PROJECTILE: "PROJECTILE",
  SHIP: "SHIP",
};

export type PhysicsEntityType =
  (typeof PhysicsEntityType)[keyof typeof PhysicsEntityType];
