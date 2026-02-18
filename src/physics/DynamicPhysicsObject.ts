import type GameScene from "../scenes/GameScene";
import type { EntityType } from "../types/EntityType";
import BasePhysicsObject from "./BasePhysicsObject";

export default abstract class DynamicPhysicsObject extends BasePhysicsObject {
  constructor(
    scene: GameScene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
    mass: number,
    airFriction: number,
    entityType: EntityType,
  ) {
    super(scene, physicsObjectID, x, y, textureName, isCircle, entityType);
    this.setFrictionAir(airFriction);
    this.setMass(mass);
  }
}
