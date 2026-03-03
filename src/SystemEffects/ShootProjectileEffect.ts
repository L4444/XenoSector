import type Ship from "../entities/Ship";
import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";
import type ProjectileData from "../types/ProjectileData";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import SystemEffect from "./SystemEffect";

export default class ShootProjectileEffect extends SystemEffect {
  private projectileData!: ProjectileData;

  constructor(projectileData: ProjectileData) {
    super("Shoot projectile effect", 0);

    this.projectileData = projectileData;
  }

  public onActivate(
    _self: Ship,
    shipSystemUsageOptions: ShipSystemUsageOptions,
    projectileManager: ProjectileManager,
  ): void {
    XenoLog.syst.debug(
      "Shooting projectile!",
      this.projectileData,
      "\n With ShipSystemUsageOptions ",
      shipSystemUsageOptions,
    );

    projectileManager.shoot(shipSystemUsageOptions, this.projectileData);
  }
}
