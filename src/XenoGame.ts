import type GameScene from "./scenes/GameScene";

import GameBackground from "./entities/GameBackground";
import createArena from "./factories/createArena";
import createAsteroidGrid from "./factories/createAsteroidGrid";

import Ship from "./entities/Ship";
import loadImage from "./helpers/loadImage";

import ProjectileManager from "./managers/ProjectileManager";
import CollisionManager from "./managers/CollisionManager";
import AlertManager from "./managers/AlertManager";

import UIElement from "./entities/UIElement";
import AIController from "./controllers/AIController";
import KeyboardAndMouseController from "./controllers/KeyboardAndMouseController";
import { XenoLog } from "./helpers/XenoLogger";
import type BaseEntity from "./entities/BaseEntity";
import { KeyboardControlStyle } from "./types/GameSettings";

export default class XenoGame {
  private scene!: GameScene;
  private player!: Ship;
  private enemies!: Array<Ship>;
  private camera!: Phaser.Math.Vector2;

  private pm!: ProjectileManager;
  private cm!: CollisionManager;
  private am!: AlertManager;
  private ui!: Array<UIElement>;
  private enemyAutoFire: boolean = true;

  private versionText!: Phaser.GameObjects.Text;

  private keyboardControlStyle: KeyboardControlStyle =
    KeyboardControlStyle.RELATIVE;
  private mouseLook: boolean = true;

  constructor(scene: GameScene) {
    this.scene = scene;
  }

  createBasicImage(
    x: number,
    y: number,
    textureKey: string,
  ): Phaser.GameObjects.Image {
    return this.scene.add.image(x, y, textureKey);
  }

  createMatterImage(
    x: number,
    y: number,
    textureKey: string,
  ): Phaser.Physics.Matter.Image {
    return this.scene.matter.add.image(x, y, textureKey);
  }

  createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColour: number,
    fillAlpha: number,
  ): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(
      x, // x
      y, // y
      width, // width
      height, // height
      fillColour, // rgb colour
      fillAlpha,
    );
  }

  createText(x: number, y: number, text: string): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, text);
  }

  createGraphic(): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics();
  }

  createParticleEmitter(
    x: number,
    y: number,
    textureKey: string,
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    return this.scene.add.particles(x, y, textureKey, config);
  }

  getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin | null {
    return this.scene.input.keyboard;
  }

  getMouse(): Phaser.Input.Pointer {
    return this.scene.input.activePointer;
  }

  getMainCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.scene.cameras.main;
  }

  onCollisionStart(
    colStart: (
      event: Phaser.Physics.Matter.Events.CollisionStartEvent,
      _bodyA: MatterJS.BodyType,
      _bodyB: MatterJS.BodyType,
    ) => void,
  ) {
    this.scene.matter.world.on("collisionstart", colStart);
  }

  preloadAssets() {
    loadImage(this.scene, "/assets/backgrounds/Blue Nebula 4 - 1024x1024.png");
    loadImage(this.scene, "/assets/backgrounds/Blue Nebula 2 - 1024x1024.png");
    loadImage(this.scene, "/assets/ships/Human-Fighter.png", true);
    loadImage(this.scene, "/assets/ships/Alien-Battleship.png", true);
    loadImage(this.scene, "/assets/ships/Alien-Bomber.png", true);

    loadImage(this.scene, "/assets/border/red.png");

    loadImage(this.scene, "/assets/projectiles/pew-yellow.png", true);
    loadImage(this.scene, "/assets/projectiles/pew-big-green.png", true);
    loadImage(this.scene, "/assets/projectiles/pew-blue.png", true);
    loadImage(this.scene, "/assets/projectiles/beam.png", true);

    loadImage(this.scene, "/assets/asteroids/Asteroid.png");

    loadImage(this.scene, "/assets/ships/Shield.png");

    loadImage(this.scene, "/assets/ui/MachineGunPlaceholder.png");

    loadImage(this.scene, "/assets/ui/PlasmaCannonPlaceholder.png");

    loadImage(this.scene, "/assets/ui/RadBlasterPlaceholder.png");

    loadImage(this.scene, "/assets/particles/i_0003.png");
  }

  createEntities() {
    // Create a parallax effect
    new GameBackground(this.scene, "Blue Nebula 4 - 1024x1024", 0.2, 1);
    new GameBackground(this.scene, "Blue Nebula 2 - 1024x1024", 1, 0.3);

    // Create the walls around the world
    createArena(this, 1000, 2000, 50);

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
        thrustPower: 0.02,
        mass: 100,
        rotationSpeed: 0.05,
        maxSpeed: 6,
      },
    );

    this.enemies = new Array<Ship>();

    for (let i = 0; i < 0; i++) {
      this.enemies.push(
        new Ship(
          this,
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
    this.scene.matter.world.setGravity(0, 0);

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
    this.scene.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // For testing things out
    // Note the Arrow Function gets the context from the GameScene as opposed to a function()
    this.scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
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

    this.versionText = this.scene.add.text(5, 5, "Version 0.2.1");
    this.versionText.setScrollFactor(0);
  }

  updateGame() {
    // The camera target is where the camera should be, taking into account the cursor
    let cameraTarget: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    cameraTarget.x =
      this.player.x -
      this.scene.scale.width / 2 +
      this.scene.input.activePointer.x;
    cameraTarget.y =
      this.player.y -
      this.scene.scale.height / 2 +
      this.scene.input.activePointer.y;

    // move the actual camera focus to the target vector, very smoothly
    this.camera.x -= (this.camera.x - cameraTarget.x) / 20;
    this.camera.y -= (this.camera.y - cameraTarget.y) / 20;

    // Set the camera on the ship
    this.scene.cameras.main.centerOn(this.camera.x, this.camera.y);
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

  setupPostUpdate(postUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("postupdate", postUpdate, baseEntity);
  }

  setupPreUpdate(preUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("preupdate", preUpdate, baseEntity);
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
