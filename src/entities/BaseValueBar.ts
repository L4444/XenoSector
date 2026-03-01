import type Ship from "./Ship";

import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";
import { ValueBarType } from "../types/ValueBarType";

export default abstract class BaseValueBar extends BaseEntity {
  private barBack!: Phaser.GameObjects.Image;

  private parentShip!: Ship;
  private offset!: number;
  private currentValue: number = -99;
  private maxValue: number = -99;
  private barFrontColour!: number;

  protected BORDER_THICKNESS: number = 3;

  constructor(
    xenoCreator: XenoCreator,
    parentShip: Ship,
    offset: number,
    valueBarType: ValueBarType,
    startingValue: number,
    maxValue: number,
  ) {
    super(xenoCreator);
    this.parentShip = parentShip;
    this.offset = offset;

    this.currentValue = startingValue;
    this.maxValue = maxValue;

    if (valueBarType == ValueBarType.HP) {
      this.barFrontColour = 0xffffff;
    }
    if (valueBarType == ValueBarType.ENERGY) {
      this.barFrontColour = 0x00ff00;
    }

    let barBackColour: string = parentShip.getIsPlayerTeam()
      ? "#66CCFF"
      : "#FF9999";

    this.barBack = xenoCreator.createBasicImage(
      0, // x - Set on update!
      0, // y- Set on update!
      "ValueBar2pxGradient",
      RenderDepth.UI,
      barBackColour,
    );
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

    this.updateFront(
      this.barBack.x,
      this.barBack.y,
      this.parentShip.displayWidth,
      this.currentValue / this.maxValue,
      this.barFrontColour,
    );
  }

  abstract updateFront(
    x: number,
    y: number,
    width: number,
    progress: number,
    colour: number,
  ): void;
}
