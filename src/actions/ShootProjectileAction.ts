import type Ship from "../entities/Ship";
import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";
import type ProjectileData from "../types/ProjectileData";

import ModuleAction from "./ModuleAction";

export default class ShootProjectileAction extends ModuleAction {
  private projectileData!: ProjectileData;

  constructor(projectileData: ProjectileData) {
    // Firing any projectile has a minimum of a 30 tick (0.5 second) wind down.
    super("Shoot projectile", 0);

    this.projectileData = projectileData;
  }

  public onExecute(
    projectileManager: ProjectileManager,
    sourceShip: Ship,
    _targetShip: Ship,
  ): void {
    XenoLog.mode.debug(
      "Shooting projectile!",
      this.projectileData,
      "\n from ship " + sourceShip.physicsEntityName,
    );

    projectileManager.shoot(
      sourceShip.getShipModuleUsageOptions(),
      this.projectileData,
    );
  }
}
