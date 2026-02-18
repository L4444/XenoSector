import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class RapidFireWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, parentShip, "Machine gun", 0.1, 3, 15);
  }

  onActivate() {
    let pd: ProjectileData = new ProjectileData(
      15,
      20,
      "yellow-pew",
      10,
      0.001,
    );

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
