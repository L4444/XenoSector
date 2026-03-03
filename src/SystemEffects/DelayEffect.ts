import type Ship from "../entities/Ship";
import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";

export default class DelayEffect extends SystemEffect {
  constructor(ticksDelay: number) {
    super("Delay effect", ticksDelay);
  }

  public onActivate(
    self: Ship,
    _shipSystemUsageOptions: ShipSystemUsageOptions,
    _projectileManager: ProjectileManager,
  ): void {
    XenoLog.syst.debug(
      "Delaying for " +
        self.physicsEntityName +
        " ticks delay: " +
        this.getWindDown(),
    );
  }
}
