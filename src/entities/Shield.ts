import type Vehicle from "./Vehicle";

import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

export default class Shield extends BaseEntity {
  private shieldImage!: Phaser.GameObjects.Image;
  private parentVehicle!: Vehicle;

  constructor(xenoCreator: XenoCreator, parentVehicle: Vehicle) {
    super(xenoCreator);
    this.parentVehicle = parentVehicle;

    this.shieldImage = xenoCreator.createBasicImage(
      0,
      0,
      "Shield",
      RenderDepth.SHIELDS,
    );
    this.shieldImage.displayWidth = parentVehicle.displayWidth;
    this.shieldImage.displayHeight = parentVehicle.displayHeight;
    this.shieldImage.alpha = 0.3;
  }

  postUpdate() {
    if (this.shieldImage.alpha > 0.3) {
      this.shieldImage.alpha -= 0.01;
    }
    this.shieldImage.x = this.parentVehicle.x;
    this.shieldImage.y = this.parentVehicle.y;
  }

  hit() {
    this.shieldImage.alpha = 1;
  }
}
