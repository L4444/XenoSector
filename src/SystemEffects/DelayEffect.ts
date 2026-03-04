import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";

export default class DelayEffect extends SystemEffect {
  constructor(ticksDelay: number) {
    super("Delay effect", ticksDelay);
  }

  public onActivate(
    shipSystemUsageOptions: ShipSystemUsageOptions,
    _projectileManager: ProjectileManager,
  ): void {
    XenoLog.effe.debug(
      "Delaying ship ID \'" +
        shipSystemUsageOptions.shipID +
        "\' ticks delay: " +
        this.getWindDown(),
    );
  }
}
