import type GameScene from "../scenes/GameScene";

export default class LabelManager {
  private textBoxes!: Array<Phaser.GameObjects.Text>;
  private nextTextbox: number = 0;

  constructor(scene: GameScene) {
    this.textBoxes = new Array<Phaser.GameObjects.Text>();

    // Create them and then make the invisible
    for (let i: number = 0; i < 100; i++) {
      this.textBoxes[i] = scene.add.text(0, 0, "This is text");
      this.textBoxes[i].alpha = 0;
    }

    scene.events.on("postupdate", this.postUpdate, this);
  }

  textPop(x: number, y: number, message: string) {
    this.textBoxes[this.nextTextbox].text = message;
    this.textBoxes[this.nextTextbox].x = x;
    this.textBoxes[this.nextTextbox].y = y;
    this.textBoxes[this.nextTextbox].alpha = 1;

    if (this.nextTextbox < this.textBoxes.length - 1) {
      this.nextTextbox++;
    } else {
      this.nextTextbox = 0;
    }
  }

  postUpdate() {
    for (let i: number = 0; i < this.textBoxes.length; i++) {
      this.textBoxes[i].y -= 0.5;
      this.textBoxes[i].alpha -= 0.01;
    }
  }
}
