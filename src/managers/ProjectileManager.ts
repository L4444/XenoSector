import Projectile from "../objects/Projectile";
import type Ship from "../objects/Ship";

export default class ProjectileManager {
  projectiles: Array<Projectile> = new Array<Projectile>();
  nextProjectile: number = 0;
  scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    for (var i = 0; i < 10; i++) {
      this.projectiles[i] = new Projectile(this.scene);
      this.projectiles[i].tint = Phaser.Display.Color.GetColor32(
        255,
        i * 20,
        i * 20,
        255,
      );
    }
  }

  getProjectiles() {
    return this.projectiles;
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
