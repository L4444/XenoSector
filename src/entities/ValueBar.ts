import type Ship from "./Ship";

import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

export default class ValueBar extends BaseEntity {
  private barBack!: Phaser.GameObjects.Image;

  private barFront!: Phaser.GameObjects.Rectangle;
  private parentShip!: Ship;
  private offset!: number;
  private currentValue: number = -99;
  private maxValue: number = -99;

  constructor(
    xenoCreator: XenoCreator,
    parentShip: Ship,
    offset: number,
    colour: number,
    borderColour: string,
    startingValue: number,
    maxValue: number,
  ) {
    super(xenoCreator);
    this.barBack = xenoCreator.createBasicImage(
      0, // x - Set on update!
      0, // y- Set on update!
      "ValueBar2pxGradient",
      RenderDepth.UI,
      borderColour,
    );

    this.barFront = xenoCreator.createRectangle(
      0, // x - Set on update!
      0, // y- Set on update!
      2, // width - Set on update!
      3, // height
      colour, // rgb colour
      1,
      RenderDepth.UI,
    );

    this.parentShip = parentShip;
    this.offset = offset;

    this.currentValue = startingValue;
    this.maxValue = maxValue;
  }

  reduceBy(value: number) {
    this.currentValue -= value;
  }

  increaseBy(value: number) {
    this.currentValue += value;
  }

  reset() {
    this.currentValue = this.maxValue;
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  postUpdate() {
    // Cap currentValue, it should never be negative
    this.currentValue = Phaser.Math.Clamp(this.currentValue, 0, this.maxValue);

    // This ValueBar should follow the parent ship while displaying the value
    this.barBack.x = this.parentShip.x;
    this.barBack.y =
      this.parentShip.y + this.offset - this.parentShip.displayHeight / 2;

    this.barFront.x =
      this.parentShip.x +
      ((this.currentValue / this.maxValue) * this.parentShip.displayWidth) / 2 -
      this.parentShip.displayWidth / 2;

    this.barFront.y = this.barBack.y;
    this.barFront.displayWidth =
      (this.currentValue / this.maxValue) * this.parentShip.displayWidth - 6;
  }
}
