import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";

export default class Ship extends DynamicPhysicsObject {
  constructor(scene: Phaser.Scene, x: number, y: number, textureName: string) {
    super(scene, x, y, textureName, true, 100);
  }
}
