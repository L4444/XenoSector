import type ProjectileManager from "../managers/ProjectileManager";
import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";

export default class RapidFireWeapon extends ShipSystem {
  constructor(scene: Phaser.Scene, parentShip: Ship) {
    super(scene, parentShip, "Machine gun", 0.1, 5);
  }

  onActivate(pm: ProjectileManager) {
    let pd: ProjectileData = new ProjectileData(15, 10, "yellow-pew");

    pm.shoot(this.parentShip, pd);
  }
}
