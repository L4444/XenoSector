import { Logger } from "tslog";

const baseLogger = new Logger({
  minLevel: 1,
  prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t{{name}}\t",
});

export const cmLogger = baseLogger.getSubLogger({
  name: "Collision Manager",
});

export const pmLogger = baseLogger.getSubLogger({
  name: "Projectile Manager",
});

export const shipLogger = baseLogger.getSubLogger({
  name: "Ship",
  minLevel: 3,
});
