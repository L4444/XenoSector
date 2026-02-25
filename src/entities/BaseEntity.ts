import type GameScene from "../scenes/GameScene";

export default abstract class BaseEntity {
  protected scene!: GameScene;
  constructor(scene: GameScene) {
    this.scene = scene;

    scene.events.on("postupdate", this.postUpdate, this);

    scene.events.on("preupdate", this.preUpdate, this);
  }

  postUpdate() {}

  preUpdate() {}
}
