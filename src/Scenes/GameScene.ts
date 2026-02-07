import GameBackground from "../objects/GameBackground";
import createArena from "../factories/createArena";
import createAsteroids from "../factories/createAsteroids";
import rotateTexture from "../helpers/rotateTexture";

export default class GameScene extends Phaser.Scene {
  p!: Phaser.Physics.Matter.Image;
  e!: Phaser.Physics.Matter.Image;
  statics!: Array<Phaser.Physics.Matter.Image>;

  constructor() {
    super("game");
  }

  preload() {
    this.load.image(
      "background",
      "/assets/backgrounds/Blue Nebula/Blue Nebula 1 - 1024x1024.png",
    );
    this.load.image("player_old", "/assets/ships/Human-Fighter.png");
    this.load.image("enemy_old", "/assets/ships/Alien-Battleship.png");

    this.load.image("red", "/assets/border/red.png");
    this.load.image("asteroid", "/assets/asteroids/Asteroid.png");
  }

  create() {
    let g = new GameBackground(this);

    rotateTexture(this, "player_old", "player");
    rotateTexture(this, "enemy_old", "enemy");

    this.e = this.matter.add.image(-300, 1600, "enemy");

    // Create Player
    this.p = this.matter.add.image(0, 1800, "player");
    this.p.setCircle(this.p.width / 2, {
      restitution: 0.1,
      friction: 0,
      frictionAir: 0.01,
      frictionStatic: 0,
    });
    this.p.setMass(100);

    this.statics = [];
    // Create asteroids to help player orient themselves
    this.statics.push(...createAsteroids(this, 16, 4, 500));

    // Create the walls around the world
    this.statics.push(...createArena(this, 500, 2000, 50));

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);
  }

  update() {
    let keyboardInput = this.input.keyboard;

    if (keyboardInput == null) {
      console.log("No keyboard detected!");
      return;
    }

    let ko = keyboardInput.addKeys("W,S,A,D,F") as Keys;
    let force = 0.05;

    if (ko.W.isDown) {
      this.p.thrust(force);
    }
    if (ko.S.isDown) {
      this.p.thrustBack(force);
    }

    this.e.thrust(force);

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
