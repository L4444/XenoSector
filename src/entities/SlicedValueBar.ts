import type Ship from "./Ship";

import type XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";
import { ValueBarType } from "../types/ValueBarType";
import BaseValueBar from "./BaseValueBar";

export default class SlicedValueBar extends BaseValueBar {
  private barSlices!: Array<Phaser.GameObjects.Rectangle>;

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
    this.barSlices = [];

    let sliceColour: number = 0xffffff;
    let numberOfSlices: number = (128 - 3) / 3;
    for (let i = 0; i < numberOfSlices; i++) {
      this.barSlices.push(
        xenoCreator.createRectangle(
          0, // x - Set on update!
          0, // y- Set on update!
          2, // width
          3, // height
          sliceColour, // rgb colour
          1,
          RenderDepth.UI,
        ),
      );
    }
  }

  updateFront(
    x: number,
    y: number,
    width: number,
    progress: number,
    colour: number,
  ) {
    // First hide all the slices
    for (let i = 0; i < this.barSlices.length; i++) {
      this.barSlices[i].alpha = 0;
      this.barSlices[i].fillColor = colour;
    }

    // Then calculate how many slices I need to display.
    let barLength: number = progress * this.barSlices.length;

    for (let i = 0; i < barLength - 1; i++) {
      this.barSlices[i].x = x + this.BORDER_THICKNESS - width / 2 + i * 3;
      this.barSlices[i].y = y;
      this.barSlices[i].alpha = 1;
    }
  }
}
