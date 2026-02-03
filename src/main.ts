import Phaser from "phaser";

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

class GameScene extends Phaser.Scene {
  p!: Phaser.Physics.Matter.Image;
  ta!: number;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image("player", "/assets/ships/Human-Fighter.png");
  }

  create() {
    //this.add.text(100, 100, "Hello Phaser John!");

    this.p = this.matter.add.image(100, 100, "player");
    this.p.setCircle(this.p.width / 2, {
      restitution: 0.5,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });
    this.p.setMass(30);

    this.matter.world.setGravity(0, 0);
    this.matter.world.setBounds(0, 0, 800, 600);

    this.ta = 0;
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
      this.p.thrustLeft(force);
    }
    if (ko.S.isDown) {
      this.p.thrustRight(force);
    }

    /// Give the illusion of weight by slowing the rotation of the ship
    /// when it gets close to 0 anglular velocity by using, auxThrusterPower
    let auxThrusterPower = 0.05;
    let targetAngularVelocity = 0;

    let rotateSpeed = 0.1;

    if (ko.D.isDown) {
      targetAngularVelocity = rotateSpeed;
    }

    if (ko.A.isDown) {
      targetAngularVelocity = -rotateSpeed;
    }

    // If we haven't been trying to rotate the ship, activate the
    // "auxThruster" to stabilise the rotation enough to give the ship
    // some weight behind it without it feeling sluggish
    if (targetAngularVelocity != 0) {
      this.p.setAngularVelocity(targetAngularVelocity);
    } else {
      this.p.setAngularVelocity(
        this.p.getAngularVelocity() * (1 - auxThrusterPower),
      );
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: GameScene,
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
});
