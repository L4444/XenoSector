import type XenoGame from "../XenoGame";

export default abstract class BaseEntity {
  protected xenoGame!: XenoGame;
  constructor(xenoGame: XenoGame) {
    this.xenoGame = xenoGame;

    xenoGame.setupPostUpdate(this.postUpdate, this);
    xenoGame.setupPreUpdate(this.preUpdate, this);
  }

  postUpdate() {}

  preUpdate() {}
}
