import AIController from "../controllers/AIController";
import KeyboardAndMouseController from "../controllers/KeyboardAndMouseController";


import createArena from "../factories/createArena";


import XenoAssetLoader from "../helpers/XenoAssetLoader";
import XenoCreator from "../helpers/XenoCreator";

import Vehicle from "../entities/Vehicle";

import ProjectileManager from "../managers/ProjectileManager";
import CollisionManager from "../managers/CollisionManager";
import AlertManager from "../managers/AlertManager";

import CooldownIcon from "../hud/CooldownIcon";

import XenoInput from "../helpers/XenoInput";

import RunVehicleModuleTests from "../tests/RunVehicleModuleTests";

export default class GameScene extends Phaser.Scene {
  public player!: Vehicle;
  private enemies!: Array<Vehicle>;
  private camera!: Phaser.Math.Vector2;

  private projectileManager!: ProjectileManager;
  private alertManager!: AlertManager;
  private cooldownIcons!: Array<CooldownIcon>;
  private xenoInput!: XenoInput;
  private xenoCreator: XenoCreator = new XenoCreator(this);

  private versionText!: Phaser.GameObjects.Text;

  private backgroundTiles!: Array<Phaser.GameObjects.Image>;

  constructor() {
    super("game");
  }

  preload() {
    XenoAssetLoader.loadAssets(this);
  }

  create() {
    this.xenoInput = new XenoInput(this);

    // Create the parallax background
    this.createBackground();

    // Create asteroids and walls
    this.createStatics();

    // Create projectiles (before Vehicles, so that they are hidden underneith them)
    this.projectileManager = new ProjectileManager(this.xenoCreator);

    // Create the alert manager (that creates text popups)
    this.alertManager = new AlertManager(this.xenoCreator);

    // Create the player and the enemies, requires the alert manager.
    this.createVehicles();

    // Turn off gravity (we are in space)
    this.matter.world.setGravity(0, 0);

    // Create the camera position vector (TODO: Put this in a camera manager)
    this.camera = new Phaser.Math.Vector2(0, 0);

    // Create the HUD elements, showing cooldowns, energy costs and keybinds
    this.createHUD();

    /// All the game objects are created, setup collision bindings
    CollisionManager.setupCollisions(this);

    // Disable mouse click context menu
    this.game.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    this.versionText = this.add.text(
      5,
      5,
      "Change setting from space to ground",
    );
    this.versionText.setScrollFactor(0);

    new RunVehicleModuleTests(this.xenoCreator, this.projectileManager);
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

    // Set the camera on the vehicle
    this.cameras.main.centerOn(this.camera.x, this.camera.y);
  }

  private createBackground() {
    // Create a parallax effect
    //new GameBackground(this, "space-blks-1.034", 1, 1);

    this.backgroundTiles = new Array<Phaser.GameObjects.Image>();

    
    let gridSize = 21;
    let totalTiles = gridSize * gridSize;
    console.log("totalTiles " + totalTiles);
    let spacing = 128;
    let startX = -1280;
    let startY = -1280;
    for (let i = 0; i < totalTiles; i++) {
        const gridX: number = i % gridSize;
        const gridY: number = Math.floor(i / gridSize);
    
  
    
  
    
        let tile = this.add.image(startX + gridX * spacing, startY + gridY * spacing, "tilemap", 10);
        this.backgroundTiles.push(tile);
        tile.setScale(2);
        
        
            
        
      }

      this.backgroundTiles[40].setFrame(25);
    
    
  }

  private createStatics() {
    // Create the walls around the world
    createArena(this.xenoCreator, 1280, 1280, 50);

    // Create asteroids to help player orient themselves
    //createAsteroidGrid(this.xenoCreator, -300, -1500, 14, 2, 800);
  }

  private createVehicles() {
    this.player = new Vehicle(
      this.xenoCreator,
      this.projectileManager,
      this.alertManager,
      "Player Vehicle",
      0,
      0,
      "Mech3",
      new KeyboardAndMouseController(this.xenoInput),
      true,
      {
        thrustPower: 0.3,
        mass: 100,
        rotationSpeed: 0.05,
        maxSpeed: 3,
        maxHP: 100,
        maxEnergy: 100,
      },
    );

    this.enemies = new Array<Vehicle>();

    for (let i = 0; i < 1; i++) {
      this.enemies.push(
        new Vehicle(
          this.xenoCreator,
          this.projectileManager,
          this.alertManager,
          "Enemy Vehicle " + i,
          i * 300,
          1000,
          "Mech3",

          new AIController(this.xenoInput, this.player),
          false,
          {
            thrustPower: 0.05,
            mass: 100,
            rotationSpeed: 0.05,
            maxSpeed: 3,
            maxHP: 100,
            maxEnergy: 100,
          },
        ),
      );
    }
  }

  private createHUD() {
    this.cooldownIcons = new Array<CooldownIcon>();
    for (let i = 0; i < this.player.getModuleCount(); i++) {
      this.cooldownIcons.push(
        new CooldownIcon(
          this.xenoCreator,
          200 + i * (64 + 32),
          750,
          this.player.getModule(i),
        ),
      );
    }
  }
}
