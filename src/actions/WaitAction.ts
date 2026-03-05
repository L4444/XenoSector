import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";
import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";
import ModuleAction from "./ModuleAction";

export default class WaitAction extends ModuleAction {
  constructor(ticksDelay: number) {
    super("Wait", ticksDelay);
  }

  public onExecute(
    ShipModuleUsageOptions: ShipModuleUsageOptions,
    _projectileManager: ProjectileManager,
  ): void {
    XenoLog.mode.debug(
      "Delaying ship ID \'" +
        ShipModuleUsageOptions.shipID +
        "\' ticks delay: " +
        this.getWindDown(),
    );
  }
}
