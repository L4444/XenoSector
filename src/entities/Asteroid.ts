import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type XenoGame from "../XenoGame";
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
    xenoGame: XenoGame,
    asteroidName: string,
    x: number,
    y: number,
    tint: number = 0xffffff,
  ) {
    super(
      xenoGame,
      x,
      y,
      "Asteroid",
      asteroidName,
      PhysicsEntityType.STATIC,
      true,
    );

    // Use phasers nice colour function to convert it to hex
    this.image.tint = tint;

    this.spinSpeed = (Math.random() - 0.5) * 3;
  }

  preUpdate() {
    console.log(this);
    this.image.angle += this.spinSpeed;
  }
}
