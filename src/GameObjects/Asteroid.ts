import Phaser from "phaser";

class Asteroid extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene) {
    super(scene.matter.world, 0, 0, "asteroid");

    this.setCircle(this.width / 4, {
      restitution: 0.5,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });
    scene.add.existing(this);

    //scene.matter.add.existing(this); Do I need this line???
  }
}

export default Asteroid;
