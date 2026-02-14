export default abstract class BasePhysicsObject
  extends Phaser.Physics.Matter.Image
{
  objID!: string;

  constructor(
    scene: Phaser.Scene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(scene.matter.world, x, y, textureName, 0, {
      restitution: 0.1,
      friction: 0,
      frictionStatic: 0,
    });

    if (isCircle) {
      this.setCircle(this.width / 2);
    }

    this.setCollisionCategory(1);

    this.objID = physicsObjectID;

    // Have to add this or it doesn't render
    scene.add.existing(this);
  }

  onHit(): void {}
}
