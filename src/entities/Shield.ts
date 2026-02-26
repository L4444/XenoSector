import type Ship from "./Ship";

import BaseEntity from "./BaseEntity";
import XenoGame from "../XenoGame";

export default class Shield extends BaseEntity {
  private shieldImage!: Phaser.GameObjects.Image;
  private parentShip!: Ship;

  constructor(xenoGame: XenoGame, parentShip: Ship) {
    super(xenoGame);
    this.parentShip = parentShip;

    this.shieldImage = xenoGame.createBasicImage({
      x: 0,
      y: 0,
      textureKey: "Shield",
    });
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
