import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import type ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class BasicWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, "Basic weapon", parentShip, "sound", 0.1, 20, 20, 10);
  }

  onActivate() {
    let pd: ProjectileData = {
      range: 15,
      speed: 20,
      textureName: "blue-pew",
      damage: 10,
      mass: 0.01,
    };

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
