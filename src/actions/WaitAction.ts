import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";
import ModuleAction from "./ModuleAction";
import type Vehicle from "../entities/Vehicle";

export default class WaitAction extends ModuleAction {
  constructor(ticksDelay: number) {
    super("Wait", ticksDelay);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    sourceVehicle: Vehicle,
    _targetVehicle: Vehicle,
  ): void {
    XenoLog.mode.debug(
      "Delaying Vehicle ID \'" +
        sourceVehicle.physicsEntityName +
        "\' ticks delay: " +
        this.getWindDown(),
    );
  }
}
