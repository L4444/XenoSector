import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";
import type ProjectileData from "../types/ProjectileData";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import SystemEffect from "./SystemEffect";

export default class ShootProjectileEffect extends SystemEffect {
  private projectileData!: ProjectileData;

  constructor(projectileData: ProjectileData) {
    // Firing any projectile has a minimum of a 30 tick (0.5 second) wind down.
    super("Shoot projectile effect", 0);

    this.projectileData = projectileData;
  }

  public onActivate(
    shipSystemUsageOptions: ShipSystemUsageOptions,
    projectileManager: ProjectileManager,
  ): void {
    XenoLog.effe.debug(
      "Shooting projectile!",
      this.projectileData,
      "\n With ShipSystemUsageOptions ",
      shipSystemUsageOptions,
    );

    projectileManager.shoot(shipSystemUsageOptions, this.projectileData);
  }
}
