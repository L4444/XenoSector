import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import type ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class RapidFireWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, "Machine gun", parentShip, "sound", 0.1, 3, 3, 15);
  }

  onActivate() {
    let pd: ProjectileData = {
      range: 15,
      speed: 20,
      textureName: "yellow-pew",
      damage: 3,
      mass: 0,
    };

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
