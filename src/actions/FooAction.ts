import ModuleAction from "./ModuleAction";

import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";
import type Vehicle from "../entities/Vehicle";

export default class FooAction extends ModuleAction {
  constructor() {
    super("Foo", 0);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    _sourceVehicle: Vehicle,
    _targetVehicle: Vehicle,
  ): void {
    XenoLog.mode.debug("Foo action triggered");
  }
}
