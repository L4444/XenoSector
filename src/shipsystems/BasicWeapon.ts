import type ProjectileManager from "../managers/ProjectileManager";
import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";

export default class BasicWeapon extends ShipSystem {
  constructor(scene: Phaser.Scene, parentShip: Ship) {
    super(scene, parentShip, "Basic weapon", 0.1, 10);
  }

  onActivate(pm: ProjectileManager) {
    let pd: ProjectileData = new ProjectileData(15, 10, "blue-pew");

    pm.shoot(this.parentShip, pd);
  }
}
