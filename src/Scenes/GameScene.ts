import Asteroid from "../GameObjects/Asteroid";
import GameBackground from "../GameObjects/GameBackground";
import { CreateArena } from "../Helpers/CreateArena";

class GameScene extends Phaser.Scene {
  p!: Phaser.Physics.Matter.Image;
  statics!: Array<Phaser.Physics.Matter.Image>;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image(
      "background",
      "/assets/backgrounds/Blue Nebula/Blue Nebula 1 - 1024x1024.png",
    );
    this.load.image("player", "/assets/ships/Human-Fighter.png");
    this.load.image("red", "/assets/border/red.png");
    this.load.image("asteroid", "/assets/asteroids/Asteroid.png");
  }

  create() {
    let g = new GameBackground(this);

    // Create Player
    this.p = this.matter.add.image(100, 100, "player");
    this.p.setCircle(this.p.width / 2, {
      restitution: 0.1,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });
    this.p.setMass(100);

    // Create asteroids to help player orient themselves
    for (let i = 0; i < 16; i++) {
      var x = i % 4;
      var y = Math.floor(i / 4);

      new Asteroid(this, x * 600, y * 600);
    }

    this.statics = [];

    this.statics.push(...CreateArena(this, 1000, 50));

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);
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
