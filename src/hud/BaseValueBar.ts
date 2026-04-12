import XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

export default abstract class BaseValueBar {
  private barBack!: Phaser.GameObjects.Image;

  private offsetX!: number;
  private offsetY!: number;

  protected xenoCreator: XenoCreator;
  protected BORDER_THICKNESS: number = 3;

  constructor(xenoCreator: XenoCreator, offsetX: number, offsetY: number) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.xenoCreator = xenoCreator;

    this.barBack = xenoCreator.createBasicImage(
      0, // x - Set on update!
      0, // y- Set on update!
      "ValueBar2pxGradient",
      RenderDepth.UI,
    );
  }

  setVisible(isVisible: boolean) {
    this.barBack.visible = isVisible;
  }

  // value is between 0 and 1
  updateValue(
    x: number,
    y: number,
    value: number,
    desiredWidth: number,
    borderColour: string,
    barColour: string,
  ) {
    // This ValueBar should follow the parent vehicle while displaying the value
    this.barBack.x = x + this.offsetX;
    this.barBack.y = y + this.offsetY;
    this.barBack.tint =
      this.xenoCreator.convertStringColourToTint(borderColour);

    this.barBack.displayWidth = desiredWidth;

    this.updateFront(
      this.barBack.x,
      this.barBack.y,
      desiredWidth,
      value,
      this.xenoCreator.convertStringColourToTint(barColour),
    );
  }

  protected abstract updateFront(
    x: number,
    y: number,
    desiredWidth: number,
    progress: number,
    colour: number,
  ): void;
}
