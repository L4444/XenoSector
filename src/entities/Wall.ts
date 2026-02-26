import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type XenoGame from "../XenoGame";
import PhysicsEntity from "./PhysicsEntity";

export default class Wall extends PhysicsEntity {
  constructor(
    xenoGame: XenoGame,
    wallName: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(xenoGame, x, y, "red", wallName, PhysicsEntityType.STATIC, false);

    this.image.width = width;
    this.image.height = height;
    this.image.displayWidth = width;
    this.image.displayHeight = height;
  }

  preUpdate() {}
}
