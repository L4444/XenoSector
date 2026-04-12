export const PhysicsEntityType = {
  STATIC: "STATIC",
  PROJECTILE: "PROJECTILE",
  VEHICLE: "VEHICLE",
};

export type PhysicsEntityType =
  (typeof PhysicsEntityType)[keyof typeof PhysicsEntityType];
