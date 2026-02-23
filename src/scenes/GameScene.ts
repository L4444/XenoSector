import GameBackground from "../objects/GameBackground";
import createArena from "../factories/createArena";
import createAsteroidGrid from "../factories/createAsteroidGrid";

import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import Ship from "../objects/Ship";
import loadImage from "../helpers/loadImage";

import ProjectileManager from "../managers/ProjectileManager";
import CollisionManager from "../managers/CollisionManager";
import AlertManager from "../managers/AlertManager";

import UIElement from "../objects/UIElement";
import AIController from "../controllers/AIController";
import KeyboardAndMouseController from "../controllers/KeyboardAndMouseController";

export default class GameScene extends Phaser.Scene {
  player!: Ship;
  enemies!: Array<Ship>;
  camera!: Phaser.Math.Vector2;
  statics!: Array<StaticPhysicsObject>;
  pm!: ProjectileManager;
  cm!: CollisionManager;
  am!: AlertManager;
  ui!: UIElement;

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
    loadImage(this, "bigEnemy", "/assets/ships/Alien-Battleship.png");
    loadImage(this, "enemy", "/assets/ships/Alien-Bomber.png");

    loadImage(this, "red", "/assets/border/red.png");

    loadImage(this, "yellow-pew", "/assets/projectiles/pew-yellow.png");
    loadImage(this, "green-pew", "/assets/projectiles/pew-big-green.png");
    loadImage(this, "blue-pew", "/assets/projectiles/pew-blue.png");
    loadImage(this, "beam", "/assets/projectiles/beam.png");

    loadImage(this, "asteroid", "/assets/asteroids/Asteroid.png");

    loadImage(this, "shield", "/assets/ships/Shield.png", true);

    loadImage(
      this,
      "MachineGunPlaceholder",
      "/assets/ui/MachineGunPlaceholder.png",
      true,
    );

    loadImage(
      this,
      "PlasmaCannonPlaceholder",
      "/assets/ui/PlasmaCannonPlaceholder.png",
      true,
    );

    loadImage(
      this,
      "RadBlasterPlaceholder",
      "/assets/ui/RadBlasterPlaceholder.png",
      true,
    );
  }

  create() {
    // Create a parallax effect
    new GameBackground(this, "background", 0.2, 1);
    new GameBackground(this, "midground", 1, 0.3);

    this.statics = [];
    // Create asteroids to help player orient themselves
    this.statics.push(...createAsteroidGrid(this, -300, -1500, 14, 2, 800));

    // Create the walls around the world
    this.statics.push(...createArena(this, 1000, 2000, 50));

    this.pm = new ProjectileManager(this);

    // Create Player
    this.player = new Ship(
      this,
      "Player Ship",
      0,
      1800,
      "player",
      this.pm,
      new KeyboardAndMouseController(this),
      true,
    );

    this.enemies = new Array<Ship>();

    for (let i = 0; i < 9; i++) {
      this.enemies.push(
        new Ship(
          this,
          "Enemy Ship " + i,
          i * 100,
          1000,
          "enemy",
          this.pm,
          new AIController(this, this.player),
          false,
        ),
      );
    }

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    // Create the camera position vector
    this.camera = new Phaser.Math.Vector2(0, 0);

    this.cm = new CollisionManager(this);

    // Create the HUD elements, showing cooldowns, energy costs and keybinds
    for (let i = 0; i < 3; i++) {
      this.ui = new UIElement(
        this,
        400 + i * (64 + 32),
        750,
        this.player.getSystem(i),
      );
    }

    this.am = new AlertManager(this);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  update() {
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

  getProjectileManager(): ProjectileManager {
    return this.pm;
  }

  getCollisionManager(): CollisionManager {
    throw new Error("Why do you want the collision manager?");
    return this.cm;
  }

  getAlertManager(): AlertManager {
    return this.am;
  }
}
