import XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

import BaseEntity from "./BaseEntity";

import type ShipSystem from "./ShipSystem";

export default class CooldownIcon extends BaseEntity {
  private back!: Phaser.GameObjects.Image;
  private icon!: Phaser.GameObjects.Image;
  private swish!: Phaser.GameObjects.Graphics;
  private swishMask!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private keybindText!: Phaser.GameObjects.Text;
  private chargesText!: Phaser.GameObjects.Text;

  private xenoCreator!: XenoCreator;

  private shipSystem!: ShipSystem;

  private SWISH_FILL_COLOUR: number = 0x666666;
  private SWISH_FILL_ALPHA: number = 0.8;

  constructor(
    xenoCreator: XenoCreator,
    x: number,
    y: number,
    shipSystem: ShipSystem,
  ) {
    super(xenoCreator);
    this.xenoCreator = xenoCreator;

    this.shipSystem = shipSystem;

    this.back = this.xenoCreator.createBasicImage(
      x,
      y,
      "Button02",
      RenderDepth.UI,
      "#FFFFFF",
      true,
    );

    this.back.setScale(1.25);

    this.icon = this.xenoCreator.createBasicImage(
      x,
      y,
      shipSystem.getUITextureName(),
      RenderDepth.UI,
      "#669999",
      true,
    );

    // The way this works is the "swish" covers the icon with a greyish filter
    // All it is a circular graphic "cut" into a square with the "swishMask"
    this.swish = this.xenoCreator.createGraphic(x, y, RenderDepth.UI, true);

    // Note: We set the swish's colour in the preupdate() function

    this.swishMask = this.xenoCreator.createGraphic(x, y, RenderDepth.UI, true);

    this.swishMask.fillStyle(0x000000, 0);
    this.swishMask.fillRect(-32, -32, 64, 64);

    this.swish.setMask(this.swishMask.createGeometryMask());

    // Now add the text to the element
    let splitSystemName: string =
      shipSystem.getSystemName().split(" ")[0] +
      "\n" +
      shipSystem.getSystemName().split(" ")[1];

    this.nameText = this.xenoCreator.createText(
      x - 30,
      y + 15,
      splitSystemName,
      RenderDepth.UI,
      "#FFFFFF",
      true,
    );

    this.nameText.setFontSize(8);

    this.keybindText = this.xenoCreator.createText(
      x - 30,
      y - 30,
      shipSystem.getKeybind(),
      RenderDepth.UI,
      "#FFFFFF",
      true,
    );
    this.keybindText.setFontSize(10);

    this.chargesText = this.xenoCreator.createText(
      x - 30,
      y - 50,
      "ERR",
      RenderDepth.UI,
      "#FFFFFF",
      true,
    );
    this.chargesText.setFontSize(20);
  }

  preUpdate() {
    let progress: number = this.shipSystem.getProgress();

    this.swish.clear();
    this.swish.fillStyle(this.SWISH_FILL_COLOUR, this.SWISH_FILL_ALPHA);
    this.swish.beginPath();
    this.swish.moveTo(0, 0);
    this.swish.arc(
      0,
      0,
      64,
      -Math.PI / 2 - Math.PI * 2 * progress,
      -Math.PI / 2,
      false,
    );
    this.swish.closePath();
    this.swish.fillPath();

    this.chargesText.text = this.shipSystem.getCharges().toString();
  }

  get x(): number {
    return this.icon.x;
  }

  get y(): number {
    return this.icon.y;
  }
}
