import type XenoCreator from "../helpers/XenoCreator";

import BaseEntity from "./BaseEntity";

export default abstract class PositionalEntity extends BaseEntity {
  constructor(xenoCreator: XenoCreator) {
    super(xenoCreator);
  }

  abstract get x(): number;

  abstract get y(): number;
}
