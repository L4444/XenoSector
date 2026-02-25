import type GameScene from "../scenes/GameScene";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import PhysicsEntity from "./PhysicsEntity";

export default class Wall extends PhysicsEntity {
  constructor(
    scene: GameScene,
    wallName: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene, x, y, wallName, PhysicsEntityType.STATIC, "red", false);

    this.image.width = width;
    this.image.height = height;
    this.image.displayWidth = width;
    this.image.displayHeight = height;
  }

  preUpdate() {}
}
