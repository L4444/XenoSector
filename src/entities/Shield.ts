import type Ship from "./Ship";

import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

export default class Shield extends BaseEntity {
  private shieldImage!: Phaser.GameObjects.Image;
  private parentShip!: Ship;

  constructor(xenoCreator: XenoCreator, parentShip: Ship) {
    super(xenoCreator);
    this.parentShip = parentShip;

    this.shieldImage = xenoCreator.createBasicImage(
      0,
      0,
      "Shield",
      RenderDepth.SHIELDS,
    );
    this.shieldImage.displayWidth = parentShip.displayWidth;
    this.shieldImage.displayHeight = parentShip.displayHeight;
    this.shieldImage.alpha = 0.3;
  }

  postUpdate() {
    if (this.shieldImage.alpha > 0.3) {
      this.shieldImage.alpha -= 0.01;
    }
    this.shieldImage.x = this.parentShip.x;
    this.shieldImage.y = this.parentShip.y;
  }

  hit() {
    this.shieldImage.alpha = 1;
  }
}
