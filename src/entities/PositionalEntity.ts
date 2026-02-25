import type GameScene from "../scenes/GameScene";
import BaseEntity from "./BaseEntity";

export default abstract class PositionalEntity extends BaseEntity {
  constructor(scene: GameScene) {
    super(scene);
  }

  abstract get x(): number;

  abstract get y(): number;
}
