import BaseEntity from "../entities/BaseEntity";

import type GameScene from "../scenes/GameScene";

export default class AlertManager extends BaseEntity {
  private textboxes!: Array<Phaser.GameObjects.Text>;
  private nextTextboxID: number = 0;

  constructor(scene: GameScene) {
    super(scene);
    this.textboxes = new Array<Phaser.GameObjects.Text>();

    // Create them and then make the invisible
    for (let i: number = 0; i < 100; i++) {
      this.textboxes[i] = scene.add.text(0, 0, "This is text");
      this.textboxes[i].alpha = 0;
    }
  }

  textPop(x: number, y: number, message: string) {
    let nextTextbox: Phaser.GameObjects.Text =
      this.textboxes[this.nextTextboxID];
    nextTextbox.text = message;
    nextTextbox.x = x;
    nextTextbox.y = y;
    nextTextbox.alpha = 1;

    if (this.nextTextboxID < this.textboxes.length - 1) {
      this.nextTextboxID++;
    } else {
      this.nextTextboxID = 0;
    }
  }

  postUpdate() {
    // After the textbox is "popped", fade out and move up.
    for (let i: number = 0; i < this.textboxes.length; i++) {
      this.textboxes[i].y -= 0.5;
      this.textboxes[i].alpha -= 0.01;
    }
  }
}
