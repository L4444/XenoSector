import Asteroid from "../GameObjects/Asteroid";

class GameScene extends Phaser.Scene {
  p!: Phaser.Physics.Matter.Image;
  asteroids!: Phaser.Physics.Matter.Image;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image("player", "/assets/ships/Human-Fighter.png");
    this.load.image("red", "/assets/border/red.png");
    this.load.image("asteroid", "/assets/asteroids/Asteroid.png");
  }

  create() {
    //this.add.text(100, 100, "Hello Phaser John!");

    // Create Player
    this.p = this.matter.add.image(100, 100, "player");
    this.p.setCircle(this.p.width / 2, {
      restitution: 0.5,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });
    this.p.setMass(30);

    // Create Asteroids
    let a = new Asteroid(this);

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    this.matter.world.setBounds(-400, -300, 800, 600);
  }

  update() {
    let keyboardInput = this.input.keyboard;

    if (keyboardInput == null) {
      console.log("No keyboard detected!");
      return;
    }

    let ko = keyboardInput.addKeys("W,S,A,D") as Keys;
    let force = 0.05;

    if (ko.W.isDown) {
      this.p.thrust(force);
    }
    if (ko.S.isDown) {
      this.p.thrustBack(force);
    }

    if (ko.A.isDown) {
      this.p.thrustLeft(force);
    }
    if (ko.D.isDown) {
      this.p.thrustRight(force);
    }

    this.input.activePointer.updateWorldPoint(this.cameras.main);
    let targetRotation = Phaser.Math.Angle.Between(
      this.p.x,
      this.p.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
    );

    let rotateSpeed = 0.05;

    this.p.rotation = Phaser.Math.Angle.RotateTo(
      this.p.rotation,
      targetRotation,
      rotateSpeed,
    );

    // Set the camera on the ship
    this.cameras.main.centerOn(this.p.x, this.p.y);
  }
}

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

export default GameScene;
