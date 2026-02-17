import GameBackground from "../objects/GameBackground";
import createArena from "../factories/createArena";
import createAsteroidGrid from "../factories/createAsteroidGrid";

import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import Ship from "../objects/Ship";
import loadImage from "../helpers/loadImage";

import ProjectileManager from "../managers/ProjectileManager";
import CollisionManager from "../managers/CollisionManager";

import BasicWeapon from "../shipsystems/BasicWeapon";
import RapidFireWeapon from "../shipsystems/RapidFireWeapon";
import HeavyLongCooldownWeapon from "../shipsystems/HeavyLongCooldownWeapon";

export default class GameScene extends Phaser.Scene {
  player!: Ship;
  enemy!: Ship;
  camera!: Phaser.Math.Vector2;
  statics!: Array<StaticPhysicsObject>;
  pm!: ProjectileManager;
  weapon1!: BasicWeapon;
  weapon2!: RapidFireWeapon;
  weapon3!: HeavyLongCooldownWeapon;

  constructor() {
    super("game");
  }

  preload() {
    loadImage(
      this,
      "background",
      "/assets/backgrounds/Blue Nebula 4 - 1024x1024.png",
      true,
    );
    loadImage(
      this,
      "midground",
      "/assets/backgrounds/Blue Nebula 2 - 1024x1024.png",
      true,
    );
    loadImage(this, "player", "/assets/ships/Human-Fighter.png");
    loadImage(this, "enemy", "/assets/ships/Alien-Battleship.png");

    loadImage(this, "red", "/assets/border/red.png");

    loadImage(this, "yellow-pew", "/assets/projectiles/pew-yellow.png");
    loadImage(this, "green-pew", "/assets/projectiles/pew-big-green.png");
    loadImage(this, "blue-pew", "/assets/projectiles/pew-blue.png");

    loadImage(this, "asteroid", "/assets/asteroids/Asteroid.png");

    loadImage(this, "shield", "/assets/ships/Shield.png", true);
  }

  create() {
    // Create a parallax effect
    new GameBackground(this, "background", 0.2, 1);
    new GameBackground(this, "midground", 1, 0.3);

    this.statics = [];
    // Create asteroids to help player orient themselves
    this.statics.push(...createAsteroidGrid(this, -300, -1500, 14, 2, 500));

    // Create the walls around the world
    this.statics.push(...createArena(this, 500, 2000, 50));

    this.pm = new ProjectileManager(this);

    this.enemy = new Ship(this, "Enemy Ship", 0, 1800, "enemy");

    // Create Player
    this.player = new Ship(this, "Player Ship", -200, 1800, "player");

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    // Create the camera position vector
    this.camera = new Phaser.Math.Vector2(0, 0);

    this.weapon1 = new BasicWeapon(this, this.player);
    this.weapon2 = new RapidFireWeapon(this, this.player);
    this.weapon3 = new HeavyLongCooldownWeapon(this, this.player);

    new CollisionManager(this);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  update() {
    let keyboardInput = this.input.keyboard;

    if (keyboardInput == null) {
      throw new Error("No keyboard detected!");
    }

    let ko = keyboardInput.addKeys("W,S,A,D,F,G") as Keys;
    let force = 0.05;

    if (ko.W.isDown) {
      this.player.thrust(force);
    }
    if (ko.S.isDown) {
      this.player.thrustBack(force);
    }

    if (this.input.mousePointer.leftButtonDown()) {
      this.weapon1.use(this.pm);
    }

    if (this.input.mousePointer.rightButtonDown()) {
      this.weapon2.use(this.pm);
      this.player.useEnergy();
    }

    if (ko.F.isDown) {
      this.weapon3.use(this.pm);
      this.player.dealDamage();
    }

    this.enemy.thrust(force);

    if (ko.A.isDown) {
      this.player.thrustLeft(force);
    }
    if (ko.D.isDown) {
      this.player.thrustRight(force);
    }

    this.input.activePointer.updateWorldPoint(this.cameras.main);
    let targetRotation = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.activePointer.worldX,
      this.input.activePointer.worldY,
    );

    let rotateSpeed = 0.05;

    this.player.rotation = Phaser.Math.Angle.RotateTo(
      this.player.rotation,
      targetRotation,
      rotateSpeed,
    );

    // The camera target is where the camera should be, taking into account the cursor
    let cameraTarget: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    cameraTarget.x =
      this.player.x - this.scale.width / 2 + this.input.activePointer.x;
    cameraTarget.y =
      this.player.y - this.scale.height / 2 + this.input.activePointer.y;

    // move the actual camera focus to the target vector, very smoothly
    this.camera.x -= (this.camera.x - cameraTarget.x) / 20;
    this.camera.y -= (this.camera.y - cameraTarget.y) / 20;

    // Set the camera on the ship
    this.cameras.main.centerOn(this.camera.x, this.camera.y);
  }
}

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  F: Phaser.Input.Keyboard.Key;
  G: Phaser.Input.Keyboard.Key;
}
