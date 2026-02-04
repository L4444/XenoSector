import Phaser from "phaser";

class Asteroid extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, "asteroid");

    this.setCircle(this.width / 4, {
      restitution: 0.1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
    });

    // Have to add this or it doesn't render
    scene.add.existing(this);

    // Make the asteroid immovable
    this.setMass(1000);
    this.setStatic(true);
  }

  preUpdate() {
    this.angle++;
  }
}

export default Asteroid;
