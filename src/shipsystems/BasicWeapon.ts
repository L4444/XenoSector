import type ProjectileManager from "../managers/ProjectileManager";
import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";

export default class BasicWeapon extends ShipSystem {
  constructor(scene: Phaser.Scene, parentShip: Ship) {
    super(scene, parentShip, "Basic weapon", 0.1, 20, 10);
  }

  onActivate(pm: ProjectileManager) {
    let pd: ProjectileData = new ProjectileData(15, 20, "blue-pew", 10, 0.1);

    pm.shoot(this.getParentShip(), pd);
  }
}
