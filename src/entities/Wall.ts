import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";

export default class Wall extends StaticPhysicsObject {
  constructor(
    scene: GameScene,
    wallName: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene, wallName, x, y, "red", false);

    this.displayWidth = width;
    this.displayHeight = height;
  }

  preUpdate() {}
}
