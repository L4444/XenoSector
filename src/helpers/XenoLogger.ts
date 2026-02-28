import { Logger } from "tslog";

const baseLogger = new Logger({
  minLevel: 1,
  prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t{{name}}\t",
});

export const XenoLog = {
  coll: baseLogger.getSubLogger({
    name: "Collision Manager",
    minLevel: 3,
  }),
  proj: baseLogger.getSubLogger({
    name: "Projectile Manager",
    minLevel: 3,
  }),
  ship: baseLogger.getSubLogger({
    name: "Ship",
    minLevel: 3,
  }),
  load: baseLogger.getSubLogger({
    name: "loadImage",
    minLevel: 1,
  }),
  gene: baseLogger.getSubLogger({
    name: "General",
    minLevel: 1,
  }),
};
