import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";
import ModuleAction from "./ModuleAction";
import type Ship from "../entities/Ship";

export default class WaitAction extends ModuleAction {
  constructor(ticksDelay: number) {
    super("Wait", ticksDelay);
  }

  public onExecute(
    _projectileManager: ProjectileManager,
    sourceShip: Ship,
    _targetShip: Ship,
  ): void {
    XenoLog.mode.debug(
      "Delaying ship ID \'" +
        sourceShip.physicsEntityName +
        "\' ticks delay: " +
        this.getWindDown(),
    );
  }
}
