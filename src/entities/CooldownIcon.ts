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

  private xenoCreator!: XenoCreator;

  private shipSystem!: ShipSystem;

  private SWISH_FILL_COLOUR: number = 0x666666;
  private SWISH_FILL_ALPHA: number = 0.8;

  private posX: number = 0;
  private posY: number = 0;

  constructor(
    xenoCreator: XenoCreator,
    x: number,
    y: number,
    shipSystem: ShipSystem,
  ) {
    super(xenoCreator);
    this.xenoCreator = xenoCreator;
    this.posX = x;
    this.posY = y;

    this.shipSystem = shipSystem;

    this.back = this.quickImage(0, 0, "Button02", "#FFFFFF");

    this.back.setScale(1.25);

    this.icon = this.quickImage(0, 0, shipSystem.getUITextureName(), "#669999");

    // The way this works is the "swish" covers the icon with a greyish filter
    // All it is a circular graphic "cut" into a square with the "swishMask"
    this.swish = this.xenoCreator.createGraphic(0, 0, RenderDepth.UI, true);

    // Note: We set the swish's colour in the preupdate() function

    this.swishMask = this.xenoCreator.createGraphic(0, 0, RenderDepth.UI, true);

    this.swishMask.fillStyle(0x000000, 0);
    this.swishMask.fillRect(-32, -32, 64, 64);

    this.swish.setMask(this.swishMask.createGeometryMask());

    // Now add the text to the element
    this.nameText = this.xenoCreator.createText(
      -30,
      +15,
      shipSystem.getSystemName().split(" ")[0] +
        "\n" +
        shipSystem.getSystemName().split(" ")[1],
      RenderDepth.UI,
      true,
    );

    this.nameText.setFontSize(8);

    this.keybindText = this.xenoCreator.createText(
      -30,
      -30,
      shipSystem.getKeybind(),
      RenderDepth.UI,
      true,
    );
    this.keybindText.setFontSize(10);
  }

  quickImage(
    offsetX: number,
    offsetY: number,
    textureKey: string,
    _colour: string,
  ): Phaser.GameObjects.Image {
    let obj: Phaser.GameObjects.Image = this.xenoCreator.createBasicImage(
      this.posX + offsetX,
      this.posY + offsetY,
      textureKey,
      RenderDepth.UI,
      true,
    );
    let convertedToHex: string = _colour.split("#")[1];

    obj.tint = Number.parseInt(convertedToHex, 16);

    return obj;
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
  }

  get x(): number {
    return this.icon.x;
  }

  get y(): number {
    return this.icon.y;
  }
}
