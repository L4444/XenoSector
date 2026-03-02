import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";
import { ValueBarType } from "../types/ValueBarType";
import BaseValueBar from "./BaseValueBar";

export default class SmoothValueBar extends BaseValueBar {
  private barFront!: Phaser.GameObjects.Rectangle;

  constructor(
    xenoCreator: XenoCreator,

    offsetX: number,
    offsetY: number,
    valueBarType: ValueBarType,
  ) {
    super(xenoCreator, offsetX, offsetY, valueBarType);
    this.barFront = xenoCreator.createRectangle(
      0, // x - Set on update!
      0, // y- Set on update!
      2, // width - Set on update!
      3, // height
      0xffffff, // rgb colour
      1,
      RenderDepth.UI,
    );
  }

  protected updateFront(
    x: number,
    y: number,
    desiredWidth: number,
    progress: number,
    colour: number,
  ) {
    this.barFront.fillColor = colour;

    // The width is perfect and works fine
    this.barFront.displayWidth =
      progress * (desiredWidth - this.BORDER_THICKNESS * 2);

    // Base the X position off the width
    this.barFront.x =
      x +
      this.barFront.displayWidth / 2 -
      desiredWidth / 2 +
      this.BORDER_THICKNESS;

    this.barFront.y = y;
  }
}
