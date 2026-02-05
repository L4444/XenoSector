export default class GameBackground extends Phaser.GameObjects.TileSprite {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 1024 * 3, 1024 * 3, "background");

    // Add this or it won't render
    scene.add.existing(this);

    this.setScrollFactor(0.2);
  }
}
