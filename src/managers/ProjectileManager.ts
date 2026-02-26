import Projectile from "../entities/Projectile";
import type Ship from "../entities/Ship";

import type XenoGame from "../XenoGame";

export default class ProjectileManager {
  private projectiles: Array<Projectile> = new Array<Projectile>();
  private nextProjectile: number = 0;

  constructor(xenoGame: XenoGame) {
    for (var i = 0; i < 100; i++) {
      this.projectiles[i] = new Projectile(xenoGame, "Projectile" + i);
    }
  }

  shoot(parent: Ship, projectileData: any) {
    this.projectiles[this.nextProjectile].fire(parent, projectileData);

    if (this.nextProjectile < this.projectiles.length - 1) {
      this.nextProjectile++;
    } else {
      this.nextProjectile = 0;
    }
  }
}
