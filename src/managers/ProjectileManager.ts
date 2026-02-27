import Projectile from "../entities/Projectile";
import type UseShipSystemData from "../types/UseShipSystemData";

import type XenoGame from "../XenoGame";

export default class ProjectileManager {
  private projectiles: Array<Projectile> = new Array<Projectile>();
  private nextProjectile: number = 0;

  constructor(xenoGame: XenoGame) {
    for (var i = 0; i < 100; i++) {
      this.projectiles[i] = new Projectile(xenoGame, "Projectile" + i);
    }
  }

  shoot(useShipSystemData: UseShipSystemData, projectileData: any) {
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
