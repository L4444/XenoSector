import XenoGame from "../XenoGame";

export default class GameScene extends Phaser.Scene {
  private xenoGame!: XenoGame;

  constructor() {
    super("game");
    this.xenoGame = new XenoGame(this);
  }

  preload() {
    this.xenoGame.preloadAssets();
  }

  create() {
    this.xenoGame.createEntities();
  }

  update() {
    this.xenoGame.updateGame();
  }
}
