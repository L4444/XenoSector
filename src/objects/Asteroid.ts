import StaticPhysicsObject from "../physics/StaticPhysicsObject";

export default class Asteroid extends StaticPhysicsObject {
  spinSpeed!: number;

  /**
   * Makes an asteroid
   *
   * @param scene The scene
   *
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    tint: number = 0xffffff,
  ) {
    super(scene, x, y, "asteroid", true);

    // Use phasers nice colour function to convert it to hex
    this.tint = tint;

    this.spinSpeed = (Math.random() - 0.5) * 3;
  }

  preUpdate() {
    this.angle += this.spinSpeed;
  }
}
