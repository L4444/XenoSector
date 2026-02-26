import type XenoGame from "../XenoGame";
import BaseEntity from "./BaseEntity";

export default abstract class PositionalEntity extends BaseEntity {
  constructor(xenoGame: XenoGame) {
    super(xenoGame);
  }

  abstract get x(): number;

  abstract get y(): number;
}
