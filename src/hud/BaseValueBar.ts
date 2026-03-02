import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";
import { ValueBarType } from "../types/ValueBarType";

export default abstract class BaseValueBar {
  private barBack!: Phaser.GameObjects.Image;

  private offsetX!: number;
  private offsetY!: number;

  private barFrontColour!: number;

  protected BORDER_THICKNESS: number = 3;

  private readonly PLAYER_BORDER_COLOUR: string = "#66CCFF";

  private readonly HP_FRONT_COLOUR: number = 0xffffff;
  private readonly ENERGY_FRONT_COLOUR: number = 0x00ff00;

  constructor(
    xenoCreator: XenoCreator,

    offsetX: number,
    offsetY: number,
    valueBarType: ValueBarType,
  ) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    if (valueBarType == ValueBarType.HP) {
      this.barFrontColour = this.HP_FRONT_COLOUR;
    }
    if (valueBarType == ValueBarType.ENERGY) {
      this.barFrontColour = this.ENERGY_FRONT_COLOUR;
    }

    let barBackColour: string = this.PLAYER_BORDER_COLOUR;

    this.barBack = xenoCreator.createBasicImage(
      0, // x - Set on update!
      0, // y- Set on update!
      "ValueBar2pxGradient",
      RenderDepth.UI,
      barBackColour,
    );
  }

  // value is between 0 and 1
  updateValue(x: number, y: number, value: number, desiredWidth: number) {
    // This ValueBar should follow the parent ship while displaying the value
    this.barBack.x = x + this.offsetX;
    this.barBack.y = y + this.offsetY;

    this.updateFront(
      this.barBack.x,
      this.barBack.y,
      desiredWidth,
      value,
      this.barFrontColour,
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
