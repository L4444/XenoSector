import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";

export default class Asteroid extends StaticPhysicsObject {
  private spinSpeed!: number;

  /**
   * Makes an asteroid
   *
   * @param scene The scene
   *
   */
  constructor(
    scene: GameScene,
    asteroidName: string,
    x: number,
    y: number,
    tint: number = 0xffffff,
  ) {
    super(scene, asteroidName, x, y, "Asteroid", true);

    // Use phasers nice colour function to convert it to hex
    this.tint = tint;

    this.spinSpeed = (Math.random() - 0.5) * 3;
  }

  preUpdate() {
    this.angle += this.spinSpeed;
  }
}
