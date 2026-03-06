import ModuleAction from "./ModuleAction";

import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";
import type Ship from "../entities/Ship";

export default class FooAction extends ModuleAction {
  constructor() {
    super("Foo", 0);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    _sourceShip: Ship,
    _targetShip: Ship,
  ): void {
    XenoLog.mode.debug("Foo action triggered");
  }
}
