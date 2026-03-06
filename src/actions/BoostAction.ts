import type ProjectileManager from "../managers/ProjectileManager";

import ModuleAction from "./ModuleAction";
import type Ship from "../entities/Ship";

export default class BoostAction extends ModuleAction {
  constructor() {
    super("Boost", 0);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    sourceShip: Ship,
    _targetShip: Ship,
  ): void {
    sourceShip.thrustForward(10);
  }
}
