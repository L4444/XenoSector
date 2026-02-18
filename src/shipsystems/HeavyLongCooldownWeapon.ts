import type ProjectileManager from "../managers/ProjectileManager";
import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";

export default class HeavyLongCooldownWeapon extends ShipSystem {
  constructor(scene: Phaser.Scene, parentShip: Ship) {
    super(scene, parentShip, "Plasma Cannon", 0.1, 60, 10);
  }

  onActivate(pm: ProjectileManager) {
    let pd: ProjectileData = new ProjectileData(15, 10, "green-pew", 33, 200);

    pm.shoot(this.getParentShip(), pd);
  }
}
