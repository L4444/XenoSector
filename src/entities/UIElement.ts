import type XenoGame from "../XenoGame";
import PositionalEntity from "./PositionalEntity";

import type ShipSystem from "./ShipSystem";

export default class UIElement extends PositionalEntity {
  private icon!: Phaser.GameObjects.Image;
  private swish!: Phaser.GameObjects.Graphics;
  private swishMask!: Phaser.GameObjects.Graphics;
  private nameText!: Phaser.GameObjects.Text;
  private keybindText!: Phaser.GameObjects.Text;
  private energyCostText!: Phaser.GameObjects.Text;

  private shipSystem!: ShipSystem;

  constructor(
    xenoGame: XenoGame,
    x: number,
    y: number,
    shipSystem: ShipSystem,
  ) {
    super(xenoGame);

    this.icon = xenoGame.createBasicImage(x, y, shipSystem.getUITextureName());
    this.icon.setScrollFactor(0);
    this.icon.setScale(2);

    this.shipSystem = shipSystem;

    // The way this works is the "swish" covers the icon with a greyish filter
    // All it is a circular graphic "cut" into a square with the "swishMask"
    this.swish = xenoGame.createGraphic();
    this.swish.setScrollFactor(0);
    this.swish.x = this.x;
    this.swish.y = this.y;

    this.swishMask = xenoGame.createGraphic();
    this.swishMask.setScrollFactor(0);
    this.swishMask.x = this.x;
    this.swishMask.y = this.y;

    this.swishMask.fillStyle(0x000000, 0);
    this.swishMask.fillRect(-32, -32, 64, 64);

    this.swish.setMask(this.swishMask.createGeometryMask());

    // Now add the text to the element
    this.nameText = xenoGame.createText(
      this.x - 32,
      this.y + 32,
      shipSystem.getSystemName(),
    );
    this.nameText.setScrollFactor(0);

    this.keybindText = xenoGame.createText(
      this.x - 32,
      this.y - 32,
      shipSystem.getKeybind(),
    );
    this.keybindText.setScrollFactor(0);

    this.energyCostText = xenoGame.createText(
      this.x + 16,
      this.y - 32,
      shipSystem.getEnergyCost().toString(),
    );
    this.energyCostText.setColor("#00ffaa");
    this.energyCostText.setScrollFactor(0);
  }

  preUpdate() {
    let progress: number = this.shipSystem.getProgress();

    this.swish.clear();
    this.swish.fillStyle(0x999999, 0.6);

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
