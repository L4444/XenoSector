import { Logger } from "tslog";

const baseLogger = new Logger({
  minLevel: 1,
  prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t{{name}}\t",
});

export const cmLogger = baseLogger.getSubLogger({
  name: "Collision Manager",
  minLevel: 5,
});

export const pmLogger = baseLogger.getSubLogger({
  name: "Projectile Manager",
  minLevel: 4,
});

export const shipLogger = baseLogger.getSubLogger({
  name: "Ship",
  minLevel: 4,
});

export const loadLogger = baseLogger.getSubLogger({
  name: "loadImage",
  minLevel: 2,
});
