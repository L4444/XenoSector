import Phaser from "phaser";

class Asteroid extends Phaser.Physics.Matter.Image {
  spinSpeed!: number;

  /**
   * Makes an asteroid
   *
   * @param scene The scene
   *
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    tint: number = 0xffffff,
  ) {
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

    // Use phasers nice colour function to convert it to hex
    this.tint = tint;

    this.spinSpeed = Math.random();
  }

  preUpdate() {
    this.angle += this.spinSpeed;
  }
}

export default Asteroid;
