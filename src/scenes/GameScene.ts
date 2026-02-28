import AIController from "../controllers/AIController";
import KeyboardAndMouseController from "../controllers/KeyboardAndMouseController";

import GameBackground from "../entities/GameBackground";
import createArena from "../factories/createArena";
import createAsteroidGrid from "../factories/createAsteroidGrid";

import XenoAssetLoader from "../helpers/XenoAssetLoader";
import XenoCreator from "../helpers/XenoCreator";

import Ship from "../entities/Ship";

import ProjectileManager from "../managers/ProjectileManager";
import CollisionManager from "../managers/CollisionManager";
import AlertManager from "../managers/AlertManager";

import UIElement from "../entities/UIElement";

import XenoInput from "../helpers/XenoInput";

export default class GameScene extends Phaser.Scene {
  private player!: Ship;
  private enemies!: Array<Ship>;
  private camera!: Phaser.Math.Vector2;

  private pm!: ProjectileManager;
  private am!: AlertManager;
  private ui!: Array<UIElement>;
  private xi!: XenoInput;
  private xenoCreator: XenoCreator = new XenoCreator(this);

  private versionText!: Phaser.GameObjects.Text;

  constructor() {
    super("game");
  }

  preload() {
    XenoAssetLoader.loadAssets(this);
  }

  create() {
    this.xi = new XenoInput(this);
    // Create a parallax effect
    new GameBackground(this, "Blue Nebula 4 - 1024x1024", 0.2, 1);
    new GameBackground(this, "Blue Nebula 2 - 1024x1024", 1, 0.3);

    // Create the walls around the world
    createArena(this.xenoCreator, 1000, 2000, 50);

    // Create asteroids to help player orient themselves
    createAsteroidGrid(this.xenoCreator, -300, -1500, 14, 2, 800);

    this.pm = new ProjectileManager(this.xenoCreator);
    this.am = new AlertManager(this.xenoCreator);

    // Create Player
    this.player = new Ship(
      this.xenoCreator,
      this.pm,
      this.am,
      "Player Ship",
      0,
      1800,
      "Human-Fighter",
      new KeyboardAndMouseController(this.xi),
      true,
      {
        thrustPower: 0.02,
        mass: 100,
        rotationSpeed: 0.05,
        maxSpeed: 6,
      },
    );

    this.enemies = new Array<Ship>();

    for (let i = 0; i < 1; i++) {
      this.enemies.push(
        new Ship(
          this.xenoCreator,
          this.pm,
          this.am,
          "Enemy Ship " + i,
          i * 300,
          1000,
          "Alien-Bomber",

          new AIController(this.xi, this.player),
          false,
          {
            thrustPower: 0.02,
            mass: 100,
            rotationSpeed: 0.05,
            maxSpeed: 3,
          },
        ),
      );
    }

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    // Create the camera position vector
    this.camera = new Phaser.Math.Vector2(0, 0);

    // Create the HUD elements, showing cooldowns, energy costs and keybinds
    this.ui = new Array<UIElement>();
    for (let i = 0; i < 3; i++) {
      this.ui.push(
        new UIElement(
          this.xenoCreator,
          400 + i * (64 + 32),
          750,
          this.player.getSystem(i),
        ),
      );
    }
    /// All the game objects are created, setup collision bindings
    CollisionManager.setupCollisions(this);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    this.versionText = this.add.text(5, 5, "Version 0.2.1");
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
}
