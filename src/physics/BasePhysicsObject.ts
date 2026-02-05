export default abstract class BasePhysicsObject
  extends Phaser.Physics.Matter.Image
{
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(scene.matter.world, x, y, textureName, 0, {
      restitution: 0.1,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });

    if (isCircle) {
      this.setCircle(this.width / 4);
    }

    // Have to add this or it doesn't render
    scene.add.existing(this);
  }
}
