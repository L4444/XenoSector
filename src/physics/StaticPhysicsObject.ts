import { EntityType } from "../types/EntityType";
import BasePhysicsObject from "./BasePhysicsObject";

export default abstract class StaticPhysicsObject extends BasePhysicsObject {
  constructor(
    scene: Phaser.Scene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(
      scene,
      physicsObjectID,
      x,
      y,
      textureName,
      isCircle,
      EntityType.STATIC,
    );

    this.setStatic(true);
  }
}
