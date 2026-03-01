import type Ship from "./Ship";

import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";
import { ValueBarType } from "../types/ValueBarType";
import BaseValueBar from "./BaseValueBar";

export default class SmoothValueBar extends BaseValueBar {
  private barFront!: Phaser.GameObjects.Rectangle;

  constructor(
    xenoCreator: XenoCreator,
    parentShip: Ship,
    offset: number,
    valueBarType: ValueBarType,
    startingValue: number,
    maxValue: number,
  ) {
    super(
      xenoCreator,
      parentShip,
      offset,
      valueBarType,
      startingValue,
      maxValue,
    );
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

  updateFront(
    x: number,
    y: number,
    width: number,
    progress: number,
    colour: number,
  ) {
    this.barFront.fillColor = colour;
    this.barFront.x = x + (progress * width) / 2 - width / 2;
    this.barFront.displayWidth = progress * (width - this.BORDER_THICKNESS * 2);

    this.barFront.y = y;
  }
}
