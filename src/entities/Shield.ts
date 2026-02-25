import type Ship from "./Ship";
import type GameScene from "../scenes/GameScene";

import BaseEntity from "./BaseEntity";

export default class Shield extends BaseEntity {
  private shieldImage!: Phaser.GameObjects.Image;
  private parentShip!: Ship;

  constructor(scene: GameScene, parentShip: Ship) {
    super(scene);
    this.parentShip = parentShip;

    this.shieldImage = scene.add.image(0, 0, "Shield");
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
