import Phaser from "phaser";

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}

class GameScene extends Phaser.Scene {
  p!: Phaser.Physics.Matter.Image;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image("player", "/assets/ships/Human-Fighter.png");
  }

  create() {
    //this.add.text(100, 100, "Hello Phaser John!");

    this.p = this.matter.add.image(100, 100, "player");
    this.p.setCircle(this.p.width / 2);

    this.matter.world.setGravity(0, 0);
    this.matter.world.setBounds(0, 0, 800, 600);
  }

  update() {
    let keyboardInput = this.input.keyboard;

    if (keyboardInput == null) {
      console.log("No keyboard detected!");
      return;
    }

    let ko = keyboardInput.addKeys("W,S,A,D") as Keys;
    let force = 0.02;

    if (ko.D.isDown) {
      console.log("boop2");
      this.p.applyForce(new Phaser.Math.Vector2(force, 0));
    }

    if (ko.W.isDown) {
      console.log("boop2");
      //this.p.applyForce(new Phaser.Math.Vector2(0, -force));

      this.p.thrustLeft(force);
    }

    if (ko.A.isDown) {
      console.log("boop2");
      this.p.applyForce(new Phaser.Math.Vector2(-force, 0));
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
