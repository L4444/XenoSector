import type GameScene from "../scenes/GameScene";

import BasePhysicsObject from "./BasePhysicsObject";

export default class StaticPhysicsObject extends BasePhysicsObject {
  constructor(
    scene: GameScene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(scene, physicsObjectID, x, y, textureName, isCircle);

    this.setStatic(true);
  }
}
