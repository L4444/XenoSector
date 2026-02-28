import type Ship from "./Ship";

import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";

export default class Shield extends BaseEntity {
  private shieldImage!: Phaser.GameObjects.Image;
  private parentShip!: Ship;

  constructor(xnoCreator: XenoCreator, parentShip: Ship) {
    super(xnoCreator);
    this.parentShip = parentShip;

    this.shieldImage = xnoCreator.createBasicImage(0, 0, "Shield");
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
