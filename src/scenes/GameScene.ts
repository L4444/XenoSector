import GameBackground from "../entities/GameBackground";
import createArena from "../factories/createArena";
import createAsteroidGrid from "../factories/createAsteroidGrid";

import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import Ship from "../entities/Ship";
import loadImage from "../helpers/loadImage";

import ProjectileManager from "../managers/ProjectileManager";
import CollisionManager from "../managers/CollisionManager";
import AlertManager from "../managers/AlertManager";

import UIElement from "../entities/UIElement";
import AIController from "../controllers/AIController";
import KeyboardAndMouseController from "../controllers/KeyboardAndMouseController";

export default class GameScene extends Phaser.Scene {
  private player!: Ship;
  private enemies!: Array<Ship>;
  private camera!: Phaser.Math.Vector2;
  private statics!: Array<StaticPhysicsObject>;
  private pm!: ProjectileManager;
  private cm!: CollisionManager;
  private am!: AlertManager;
  private ui!: Array<UIElement>;

  private versionText!: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  preload() {
    loadImage(this, "/assets/backgrounds/Blue Nebula 4 - 1024x1024.png");
    loadImage(this, "/assets/backgrounds/Blue Nebula 2 - 1024x1024.png");
    loadImage(this, "/assets/ships/Human-Fighter.png", true);
    loadImage(this, "/assets/ships/Alien-Battleship.png", true);
    loadImage(this, "/assets/ships/Alien-Bomber.png", true);

    loadImage(this, "/assets/border/red.png");

    loadImage(this, "/assets/projectiles/pew-yellow.png", true);
    loadImage(this, "/assets/projectiles/pew-big-green.png", true);
    loadImage(this, "/assets/projectiles/pew-blue.png", true);
    loadImage(this, "/assets/projectiles/beam.png", true);

    loadImage(this, "/assets/asteroids/Asteroid.png");

    loadImage(this, "/assets/ships/Shield.png");

    loadImage(this, "/assets/ui/MachineGunPlaceholder.png");

    loadImage(this, "/assets/ui/PlasmaCannonPlaceholder.png");

    loadImage(this, "/assets/ui/RadBlasterPlaceholder.png");

    loadImage(this, "/assets/particles/i_0003.png");
  }

  create() {
    // Create a parallax effect
    new GameBackground(this, "Blue Nebula 4 - 1024x1024", 0.2, 1);
    new GameBackground(this, "Blue Nebula 2 - 1024x1024", 1, 0.3);

    // Create the walls around the world
    createArena(this, 1000, 2000, 50);

    this.statics = [];
    // Create asteroids to help player orient themselves
    createAsteroidGrid(this, -300, -1500, 14, 2, 800);

    this.pm = new ProjectileManager(this);

    // Create Player
    this.player = new Ship(
      this,
      "Player Ship",
      0,
      1800,
      "Human-Fighter",
      new KeyboardAndMouseController(this),
      true,
      {
        thrustPower: 0.03,
        mass: 100,
        rotationSpeed: 0.2,
      },
    );

    this.enemies = new Array<Ship>();

    for (let i = 0; i < 9; i++) {
      this.enemies.push(
        new Ship(
          this,
          "Enemy Ship " + i,
          -500 + i * 150,
          1000,
          "Alien-Bomber",

          new AIController(this, this.player),
          false,
          {
            thrustPower: 0.01,
            mass: 100,
            rotationSpeed: 0.05,
          },
        ),
      );
    }

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    // Create the camera position vector
    this.camera = new Phaser.Math.Vector2(0, 0);

    this.cm = new CollisionManager(this);

    // Create the HUD elements, showing cooldowns, energy costs and keybinds
    this.ui = new Array<UIElement>();
    for (let i = 0; i < 3; i++) {
      this.ui.push(
        new UIElement(this, 400 + i * (64 + 32), 750, this.player.getSystem(i)),
      );
    }

    this.am = new AlertManager(this);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // For testing things out
    // Note the Arrow Function gets the context from the GameScene as opposed to a function()
    this.input.keyboard?.on("keydown-R", (_event: KeyboardEvent) => {
      console.log(" Pressed R");

      console.log(_event);

      this.player.explode();
    });

    this.versionText = this.add.text(5, 5, "Version 0.1");
    this.versionText.setScrollFactor(0);
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

  getCollisionManager(): CollisionManager {
    // Added this so typescript won't complain about this.cm being unused
    throw new Error("Why are you getting collision manager");
    return this.cm;
  }

  getProjectileManager(): ProjectileManager {
    return this.pm;
  }

  getAlertManager(): AlertManager {
    return this.am;
  }
}
