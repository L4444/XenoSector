import ShipSystem from "./ShipSystem";
import type Ship from "../objects/Ship";
import ProjectileData from "../types/ProjectileData";
import type GameScene from "../scenes/GameScene";

export default class HeavyLongCooldownWeapon extends ShipSystem {
  constructor(scene: GameScene, parentShip: Ship) {
    super(scene, "Plasma Cannon", parentShip, "sound", 0.1, 60, 20, 10);
  }

  onActivate() {
    let pd: ProjectileData = new ProjectileData(15, 10, "green-pew", 33, 200);

    this.scene.getProjectileManager().shoot(this.getParentShip(), pd);
  }
}
