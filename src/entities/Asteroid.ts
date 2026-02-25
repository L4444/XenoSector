import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import PhysicsEntity from "./PhysicsEntity";

export default class Asteroid extends PhysicsEntity {
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
    super(scene, x, y, "Asteroid", PhysicsEntityType.STATIC, "Asteroid", true);

    // Use phasers nice colour function to convert it to hex
    this.image.tint = tint;

    this.spinSpeed = (Math.random() - 0.5) * 3;
  }

  preUpdate() {
    this.image.angle += this.spinSpeed;
  }
}
