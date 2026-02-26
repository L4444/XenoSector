import type IEntityCreator from "../interfaces/IEntityCreator";

export default abstract class BaseEntity {
  protected scene!: IEntityCreator;
  constructor(scene: IEntityCreator) {
    this.scene = scene;

    scene.setupPostUpdate(this.postUpdate, this);
    scene.setupPreUpdate(this.preUpdate, this);

    //scene.events.on("preupdate", this.preUpdate, this);
  }

  postUpdate() {}

  preUpdate() {}
}
