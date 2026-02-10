import GameBackground from "../objects/GameBackground";
import createArena from "../factories/createArena";
import createAsteroidGrid from "../factories/createAsteroidGrid";
import rotateTexture from "../helpers/rotateTexture";
import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import Ship from "../objects/Ship";

export default class GameScene extends Phaser.Scene {
  p!: Ship;
  e!: Ship;
  c!: Phaser.Math.Vector2;
  statics!: Array<StaticPhysicsObject>;

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

    this.e = new Ship(this, 0, 1800, "enemy");

    // Create Player
    this.p = new Ship(this, -200, 1800, "player");

    this.statics = [];
    // Create asteroids to help player orient themselves
    this.statics.push(...createAsteroidGrid(this, -300, -1500, 14, 2, 500));

    // Create the walls around the world
    this.statics.push(...createArena(this, 500, 2000, 50));

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    this.c = new Phaser.Math.Vector2(0, 0);
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

    // The camera target is where the camera should be, taking into account the cursor
    let cameraTarget: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    cameraTarget.x =
      this.p.x - this.scale.width / 2 + this.input.activePointer.x;
    cameraTarget.y =
      this.p.y - this.scale.height / 2 + this.input.activePointer.y;

    // move the actual camera focus to the target vector, very smoothly
    this.c.x -= (this.c.x - cameraTarget.x) / 20;
    this.c.y -= (this.c.y - cameraTarget.y) / 20;

    // Set the camera on the ship
    this.cameras.main.centerOn(this.c.x, this.c.y);
  }
}

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
}
