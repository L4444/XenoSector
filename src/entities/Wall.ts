import type XenoCreator from "../helpers/XenoCreator";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import PhysicsEntity from "./PhysicsEntity";

export default class Wall extends PhysicsEntity {
  constructor(
    xenoCreator: XenoCreator,
    wallName: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(xenoCreator, x, y, "red", wallName, PhysicsEntityType.STATIC, false);

    this.image.width = width;
    this.image.height = height;
    this.image.displayWidth = width;
    this.image.displayHeight = height;
  }

  preUpdate() {}
}
