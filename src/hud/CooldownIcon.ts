import XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

import BaseEntity from "../entities/BaseEntity";

import type ShipModule from "../entities/ShipModule";
import { RenderSpace } from "../types/RenderSpace";

export default class CooldownIcon extends BaseEntity {
  private back!: Phaser.GameObjects.Image;
  private icon!: Phaser.GameObjects.Image;
  private swish!: Phaser.GameObjects.Graphics;
  private swishMask!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private keybindText!: Phaser.GameObjects.Text;
  private chargesText!: Phaser.GameObjects.Text;
  private energyText!: Phaser.GameObjects.Text;

  private xenoCreator!: XenoCreator;

  private ShipModule!: ShipModule;

  private SWISH_FILL_COLOUR: number = 0x666666;
  private SWISH_FILL_ALPHA: number = 0.8;

  constructor(
    xenoCreator: XenoCreator,
    x: number,
    y: number,
    ShipModule: ShipModule,
  ) {
    super(xenoCreator);
    this.xenoCreator = xenoCreator;

    this.ShipModule = ShipModule;

    this.back = this.xenoCreator.createBasicImage(
      x,
      y,
      "Button02",
      RenderDepth.UI,
      "#FFFFFF",
      RenderSpace.SCREEN,
    );

    this.back.setScale(1.25);

    this.icon = this.xenoCreator.createBasicImage(
      x,
      y,
      ShipModule.getUITextureName(),
      RenderDepth.UI,
      "#669999",
      RenderSpace.SCREEN,
    );

    // The way this works is the "swish" covers the icon with a greyish filter
    // All it is a circular graphic "cut" into a square with the "swishMask"
    this.swish = this.xenoCreator.createGraphic(
      x,
      y,
      RenderDepth.UI,
      RenderSpace.SCREEN,
    );

    // Note: We set the swish's colour in the preupdate() function

    this.swishMask = this.xenoCreator.createGraphic(
      x,
      y,
      RenderDepth.UI,
      RenderSpace.SCREEN,
    );

    this.swishMask.fillStyle(0x000000, 0);
    this.swishMask.fillRect(-32, -32, 64, 64);

    this.swish.setMask(this.swishMask.createGeometryMask());

    // Now add the text to the element
    let splitModuleName: string =
      ShipModule.getModuleName().split(" ")[0] +
      "\n" +
      ShipModule.getModuleName().split(" ")[1];

    this.nameText = this.xenoCreator.createText(
      x - 30,
      y + 15,
      splitModuleName,
      RenderDepth.UI,
      "#FFFFFF",
      RenderSpace.SCREEN,
    );

    this.nameText.setFontSize(8);

    this.keybindText = this.xenoCreator.createText(
      x - 30,
      y - 30,
      ShipModule.getKeybind(),
      RenderDepth.UI,
      "#FFFFFF",
      RenderSpace.SCREEN,
    );
    this.keybindText.setFontSize(15);

    this.chargesText = this.xenoCreator.createText(
      x - 30,
      y - 50,
      "ERR",
      RenderDepth.UI,
      "#FFFFFF",
      RenderSpace.SCREEN,
    );
    this.chargesText.setFontSize(20);

    // Hide if the ShipModule doesn't "use charges" (e.g it's max chargers are at 1)
    if (this.ShipModule.getMaxCharges() == 1) {
      this.chargesText.setVisible(false);
    }

    this.energyText = this.xenoCreator.createText(
      x + 15,
      y - 30,
      this.ShipModule.getEnergyCost().toString(),
      RenderDepth.UI,
      "#00Cccc",
      RenderSpace.SCREEN,
    );
    this.energyText.setFontSize(15);

    // Hide if the ShipModule has no cost, so the UI looks cleaner
    if (this.ShipModule.getEnergyCost() == 0) {
      this.energyText.setVisible(false);
    }
  }

  preUpdate() {
    let progress: number = this.ShipModule.getCooldownRemainingRatio();

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

    this.chargesText.text =
      this.ShipModule.getCurrentCharges().toString() +
      "\/" +
      this.ShipModule.getMaxCharges().toString();

    this.back.tint = this.ShipModule.hasEnergy() ? 0xffffff : 0xff0000;
  }

  get x(): number {
    return this.icon.x;
  }

  get y(): number {
    return this.icon.y;
  }
}
