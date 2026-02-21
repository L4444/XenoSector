import type GameScene from "../scenes/GameScene";

import type ShipSystem from "./ShipSystem";

export default class UIElement extends Phaser.GameObjects.Image {
  swish!: Phaser.GameObjects.Graphics;
  swishMask!: Phaser.GameObjects.Graphics;
  nameText!: Phaser.GameObjects.Text;
  keybindText!: Phaser.GameObjects.Text;
  energyCostText!: Phaser.GameObjects.Text;

  shipSystem!: ShipSystem;

  constructor(scene: GameScene, x: number, y: number, shipSystem: ShipSystem) {
    super(scene, x, y, shipSystem.getUITextureName());
    // Add to scene or it doesn't render/update
    scene.add.existing(this);

    this.setScrollFactor(0);
    this.setScale(2);

    this.shipSystem = shipSystem;

    // The way this works is the "swish" covers the icon with a greyish filter
    // All it is a circular graphic "cut" into a square with the "swishMask"
    this.swish = scene.add.graphics();
    this.swish.setScrollFactor(0);
    this.swish.x = this.x;
    this.swish.y = this.y;

    this.swishMask = scene.add.graphics();
    this.swishMask.setScrollFactor(0);
    this.swishMask.x = this.x;
    this.swishMask.y = this.y;

    this.swishMask.fillStyle(0x000000, 0);
    this.swishMask.fillRect(-32, -32, 64, 64);

    this.swish.setMask(this.swishMask.createGeometryMask());

    // Now add the text to the element
    this.nameText = scene.add.text(
      this.x - 32,
      this.y + 32,
      shipSystem.getSystemName(),
      { fontSize: 10 },
    );
    this.nameText.setScrollFactor(0);

    this.keybindText = scene.add.text(
      this.x - 32,
      this.y - 32,
      shipSystem.getKeybind(),
      { fontSize: 15 },
    );
    this.keybindText.setScrollFactor(0);

    this.energyCostText = scene.add.text(
      this.x + 16,
      this.y - 32,
      shipSystem.getEnergyCost().toString(),
      { fontSize: 15 },
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
}
