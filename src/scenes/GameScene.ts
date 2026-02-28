import AIController from "../controllers/AIController";
import KeyboardAndMouseController from "../controllers/KeyboardAndMouseController";
import { XenoLog } from "../helpers/XenoLogger";

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

import { KeyboardControlStyle } from "../types/GameSettings";

export default class GameScene extends Phaser.Scene {
  private player!: Ship;
  private enemies!: Array<Ship>;
  private camera!: Phaser.Math.Vector2;

  private pm!: ProjectileManager;
  private cm!: CollisionManager;
  private am!: AlertManager;
  private ui!: Array<UIElement>;
  private xenoCreator: XenoCreator = new XenoCreator(this);

  private enemyAutoFire: boolean = false;

  private versionText!: Phaser.GameObjects.Text;

  private keyboardControlStyle: KeyboardControlStyle =
    KeyboardControlStyle.RELATIVE;
  private mouseLook: boolean = true;
  constructor() {
    super("game");
  }

  preload() {
    XenoAssetLoader.loadAssets(this);
  }

  create() {
    // Create a parallax effect
    new GameBackground(this, "Blue Nebula 4 - 1024x1024", 0.2, 1);
    new GameBackground(this, "Blue Nebula 2 - 1024x1024", 1, 0.3);

    // Create the walls around the world
    createArena(this.xenoCreator, 1000, 2000, 50);

    // Create asteroids to help player orient themselves
    createAsteroidGrid(this.xenoCreator, -300, -1500, 14, 2, 800);

    this.pm = new ProjectileManager(this.xenoCreator);

    // Create Player
    this.player = new Ship(
      this.xenoCreator,
      this.pm,
      this.am,
      "Player Ship",
      0,
      1800,
      "Human-Fighter",
      new KeyboardAndMouseController(this),
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

          new AIController(this, this.player),
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

    this.cm = new CollisionManager(this);

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

    this.am = new AlertManager(this.xenoCreator);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // For testing things out
    // Note the Arrow Function gets the context from the GameScene as opposed to a function()
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key == "1") {
        this.keyboardControlStyle = KeyboardControlStyle.ABSOLUTE;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "2") {
        this.keyboardControlStyle = KeyboardControlStyle.RELATIVE;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "3") {
        this.keyboardControlStyle = KeyboardControlStyle.TANKCONTROLS;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "4") {
        this.mouseLook = !this.mouseLook;
        XenoLog.ship.info("mouseLook set to " + this.mouseLook);
      }

      if (event.key == "r") {
        this.player.explode();
        XenoLog.ship.info("Test explosion");
      }

      if (event.key == "q") {
        this.enemyAutoFire = !this.enemyAutoFire;
        XenoLog.ship.info("Enemy autofire set to " + this.enemyAutoFire);
      }
    });

    this.versionText = this.add.text(5, 5, "Version 0.2.1");
    this.versionText.setScrollFactor(0);
  }

  getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin | null {
    return this.input.keyboard;
  }

  getMouse(): Phaser.Input.Pointer {
    return this.input.activePointer;
  }

  getMainCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.cameras.main;
  }

  onCollisionStart(
    colStart: (
      event: Phaser.Physics.Matter.Events.CollisionStartEvent,
      _bodyA: MatterJS.BodyType,
      _bodyB: MatterJS.BodyType,
    ) => void,
  ) {
    this.matter.world.on("collisionstart", colStart);
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

  getEnemyAutoFire(): boolean {
    return this.enemyAutoFire;
  }

  getAlertManager(): AlertManager {
    return this.am;
  }

  getKeyboardControlStyle(): KeyboardControlStyle {
    return this.keyboardControlStyle;
  }

  getMouseLook(): boolean {
    return this.mouseLook;
  }
}
