export const PhysicsEntityType = {
  STATIC: "STATIC",
  PROJECTILE: "PROJECTILE",
  Vehicle: "Vehicle",
};

export type PhysicsEntityType =
  (typeof PhysicsEntityType)[keyof typeof PhysicsEntityType];
