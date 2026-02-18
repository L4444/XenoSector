import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class BasicWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, parentShip, "Basic weapon", 0.1, 20, 10);
  }

  onActivate() {
    let pd: ProjectileData = new ProjectileData(15, 20, "blue-pew", 10, 0.1);

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
