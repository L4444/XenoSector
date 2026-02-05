//import Phaser from "phaser";

class Wall extends Phaser.Physics.Matter.Image {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene.matter.world, x, y, "red");

    this.displayWidth = width;
    this.displayHeight = height;

    this.setRectangle(width, height, {
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

  preUpdate() {}
}

export default Wall;
