import type XenoCreator from "../helpers/XenoCreator";

export default abstract class BaseEntity {
  constructor(xenoCreator: XenoCreator) {
    xenoCreator.setupPostUpdate(this.postUpdate, this);
    xenoCreator.setupPreUpdate(this.preUpdate, this);
  }

  postUpdate() {}

  preUpdate() {}
}
