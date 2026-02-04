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

    let targetRotation = Phaser.Math.Angle.Between(
      this.p.x,
      this.p.y,
      this.input.activePointer.x,
      this.input.activePointer.y,
    );

    let rotateSpeed = 0.05;

    this.p.rotation = Phaser.Math.Angle.RotateTo(
      this.p.rotation,
      targetRotation,
      rotateSpeed,
    );
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
