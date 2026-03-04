import XenoCreator from "../helpers/XenoCreator";
import { RenderDepth } from "../types/RenderDepth";

import BaseEntity from "../entities/BaseEntity";

import type ShipSystem from "../entities/ShipSystem";

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
    this.keybindText.setFontSize(15);

    this.chargesText = this.xenoCreator.createText(
      x - 30,
      y - 50,
      "ERR",
      RenderDepth.UI,
      "#FFFFFF",
      true,
    );
    this.chargesText.setFontSize(20);

    // Hide if the shipsystem doesn't "use charges" (e.g it's max chargers are at 1)
    if (this.shipSystem.getMaxCharges() == 1) {
      this.chargesText.setVisible(false);
    }

    this.energyText = this.xenoCreator.createText(
      x + 15,
      y - 30,
      this.shipSystem.getEnergyCost().toString(),
      RenderDepth.UI,
      "#00Cccc",
      true,
    );
    this.energyText.setFontSize(15);

    // Hide if the shipsystem has no cost, so the UI looks cleaner
    if (this.shipSystem.getEnergyCost() == 0) {
      this.energyText.setVisible(false);
    }
  }

  preUpdate() {
    let progress: number = this.shipSystem.getCooldownRemainingRatio();

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
      this.shipSystem.getCurrentCharges().toString() +
      "\/" +
      this.shipSystem.getMaxCharges().toString();

    this.back.tint = this.shipSystem.hasEnergy() ? 0xffffff : 0xff0000;
  }

  get x(): number {
    return this.icon.x;
  }

  get y(): number {
    return this.icon.y;
  }
}
