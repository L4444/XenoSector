import Projectile from "../entities/Projectile";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import XenoCreator from "../helpers/XenoCreator";

export default class ProjectileManager {
  private projectiles: Array<Projectile> = new Array<Projectile>();
  private nextProjectile: number = 0;

  constructor(xenoCreator: XenoCreator) {
    for (var i = 0; i < 100; i++) {
      this.projectiles[i] = new Projectile(xenoCreator, "Projectile" + i);
    }
  }

  shoot(useShipSystemData: ShipSystemUsageOptions, projectileData: any) {
    this.projectiles[this.nextProjectile].fire(
      useShipSystemData,
      projectileData,
    );

    if (this.nextProjectile < this.projectiles.length - 1) {
      this.nextProjectile++;
    } else {
      this.nextProjectile = 0;
    }
  }
}
