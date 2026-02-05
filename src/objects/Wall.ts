import StaticPhysicsObject from "../physics/StaticPhysicsObject";

export default class Wall extends StaticPhysicsObject {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene, x, y, "red", false);

    this.displayWidth = width;
    this.displayHeight = height;
  }

  preUpdate() {}
}
