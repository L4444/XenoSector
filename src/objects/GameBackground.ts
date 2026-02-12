export default class GameBackground extends Phaser.GameObjects.TileSprite {
  constructor(
    scene: Phaser.Scene,
    textureName: string,
    scrollFactor: number,
    alphaFactor: number,
  ) {
    super(scene, 0, 0, 1024 * 9, 1024 * 9, textureName);

    // Add this or it won't render
    scene.add.existing(this);

    this.setScrollFactor(scrollFactor);
    this.setAlpha(alphaFactor);
  }
}
