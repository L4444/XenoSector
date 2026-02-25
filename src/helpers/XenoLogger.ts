import { Logger } from "tslog";

const baseLogger = new Logger({
  minLevel: 1,
  prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t{{name}}\t",
});

export const XenoLog = {
  coll: baseLogger.getSubLogger({
    name: "Collision Manager",
    minLevel: 5,
  }),
  proj: baseLogger.getSubLogger({
    name: "Projectile Manager",
    minLevel: 4,
  }),
  ship: baseLogger.getSubLogger({
    name: "Ship",
    minLevel: 4,
  }),
  load: baseLogger.getSubLogger({
    name: "loadImage",
    minLevel: 4,
  }),
};
