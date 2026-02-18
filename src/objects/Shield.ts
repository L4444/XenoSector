import type Ship from "./Ship";
import type GameScene from "../scenes/GameScene";

export default class Shield {
  parentShip!: Ship;
  shieldImage!: Phaser.GameObjects.Image;
  constructor(scene: GameScene, parentShip: Ship) {
    this.parentShip = parentShip;

    this.shieldImage = scene.add.image(0, 0, "shield");
    this.shieldImage.displayWidth = parentShip.displayWidth;
    this.shieldImage.displayHeight = parentShip.displayHeight;
    this.shieldImage.alpha = 0.3;

    // Post update, the preUpdate() function calls BEFORE physics update so if I sync
    // the other elements (e.g. shield/thruster) they will lag slightly behind.
    scene.events.on("postupdate", this.postUpdate, this);
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
