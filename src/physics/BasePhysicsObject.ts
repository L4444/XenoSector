import type { EntityType } from "../types/EntityType";
import type GameScene from "../scenes/GameScene";

export default abstract class BasePhysicsObject
  extends Phaser.Physics.Matter.Image
{
  physicsObjectName!: string;
  entityType!: EntityType;
  gameScene!: GameScene;

  constructor(
    scene: GameScene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
    entityType: EntityType,
  ) {
    super(scene.matter.world, x, y, textureName, 0, {
      restitution: 1,
      friction: 0,
      frictionStatic: 0,
    });

    this.gameScene = scene;

    if (isCircle) {
      this.setCircle(this.width / 2);
    }

    this.setCollisionCategory(1);

    this.physicsObjectName = physicsObjectID;
    this.entityType = entityType;

    scene.add.existing(this);
  }
}
