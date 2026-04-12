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
  vehi: baseLogger.getSubLogger({
    name: "Vehicle",
    minLevel: 3,
  }),
  load: baseLogger.getSubLogger({
    name: "loadImage",
    minLevel: 3,
  }),
  gene: baseLogger.getSubLogger({
    name: "General",
    minLevel: 3,
  }),
  mode: baseLogger.getSubLogger({
    name: "Vehicle Modules",
    minLevel: 2,
  }),
  unit: baseLogger.getSubLogger({
    name: "Unit tests",
    minLevel: 3,
  }),
};
