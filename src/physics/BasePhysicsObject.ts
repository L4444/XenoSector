import type GameScene from "../scenes/GameScene";

export default abstract class BasePhysicsObject
  extends Phaser.Physics.Matter.Image
{
  physicsObjectName!: string;

  gameScene!: GameScene;

  constructor(
    scene: GameScene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
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

    scene.add.existing(this);
  }
}
