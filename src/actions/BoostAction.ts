import type ProjectileManager from "../managers/ProjectileManager";

import ModuleAction from "./ModuleAction";
import type Vehicle from "../entities/Vehicle";

export default class BoostAction extends ModuleAction {
  constructor() {
    super("Boost", 0);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    sourceVehicle: Vehicle,
    _targetVehicle: Vehicle,
  ): void {
    sourceVehicle.thrustForward(10);
  }
}
