import BasePhysicsObject from "./BasePhysicsObject";

export default abstract class DynamicPhysicsObject extends BasePhysicsObject {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(scene, x, y, textureName, isCircle);
  }
}
