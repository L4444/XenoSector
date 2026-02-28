import type XenoCreator from "../helpers/XenoCreator";
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
    xenoCreator: XenoCreator,
    asteroidName: string,
    x: number,
    y: number,
    tint: number = 0xffffff,
  ) {
    super(
      xenoCreator,
      x,
      y,
      "Asteroid",
      asteroidName,
      PhysicsEntityType.STATIC,
      true,
      100,
    );

    this.setTint(tint);

    this.spinSpeed = 0.01;
  }

  preUpdate() {
    this.rotation += this.spinSpeed;
  }
}
