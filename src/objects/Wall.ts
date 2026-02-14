import StaticPhysicsObject from "../physics/StaticPhysicsObject";

export default class Wall extends StaticPhysicsObject {
  constructor(
    scene: Phaser.Scene,
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
