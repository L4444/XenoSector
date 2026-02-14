import BasePhysicsObject from "./BasePhysicsObject";

export default abstract class DynamicPhysicsObject extends BasePhysicsObject {
  constructor(
    scene: Phaser.Scene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
    mass: number,
    airFriction: number = 0,
  ) {
    super(scene, physicsObjectID, x, y, textureName, isCircle);
    this.setFrictionAir(airFriction);
    this.setMass(mass);
  }
}
