import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import type ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class HeavyLongCooldownWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, "Plasma Cannon", parentShip, "sound", 0.1, 60, 20, 10);
  }

  onActivate() {
    let pd: ProjectileData = {
      range: 15,
      speed: 10,
      textureName: "green-pew",
      damage: 33,
      mass: 6400,
    };

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
