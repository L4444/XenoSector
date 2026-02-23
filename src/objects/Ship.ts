import type ProjectileManager from "../managers/ProjectileManager";
import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import type GameScene from "../scenes/GameScene";

import ShipSystem from "../objects/ShipSystem";
import Shield from "./Shield";
import ValueBar from "./ValueBar";
import { shipLogger } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";

export default class Ship extends DynamicPhysicsObject {
  static count: number = 0;
  shipID!: number;
  shield!: Shield;
  hp!: ValueBar;
  energy!: ValueBar;
  systems!: Array<ShipSystem>;
  projectileManager!: ProjectileManager;
  controller!: BaseController;

  private isPlayerTeam!: boolean;

  private ticksSinceEnergyMessage: number = 0;
  private ticksSinceCooldownMessage: number = 0;

  private thrustPower: number = 0.01;

  constructor(
    scene: GameScene,
    shipName: string,
    x: number,
    y: number,
    textureName: string,
    projectileManager: ProjectileManager,
    controller: BaseController,
    isPlayerTeam: boolean,
  ) {
    super(scene, shipName, x, y, textureName, true, 100, 0.01);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);

    this.projectileManager = projectileManager;

    /// Put shield in it's own object class
    this.shield = new Shield(scene, this);
    this.hp = new ValueBar(scene, this, 0, 0x993333, 100, 100, 0.01);
    this.energy = new ValueBar(scene, this, 15, 0x9999ff, 70, 100, 0.5);

    this.systems = new Array<ShipSystem>();

    let basicWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Plasma Cannon",
      cooldownDuration: 40,
      reuseDuration: 40,
      energyCost: 10,
      projectileData: {
        range: 15,
        speed: 20,
        textureName: "blue-pew",
        damage: 30,
        mass: 0.2,
      },
      uiTextureName: "PlasmaCannonPlaceholder",
      playerKeyBind: "M1",
    });

    this.systems.push(basicWeapon);

    let rapidFireWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Machine Gun",
      cooldownDuration: 3,
      reuseDuration: 3,
      energyCost: 15,
      projectileData: {
        range: 15,
        speed: 20,
        textureName: "yellow-pew",
        damage: 15,
        mass: 0.1,
      },
      uiTextureName: "MachineGunPlaceholder",
      playerKeyBind: "M2",
    });

    this.systems.push(rapidFireWeapon);

    let heavyLongCooldownWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Rad Blaster",
      cooldownDuration: 60,
      reuseDuration: 20,
      energyCost: 10,
      projectileData: {
        range: 15,
        speed: 10,
        textureName: "green-pew",
        damage: 20,
        mass: 6400,
      },
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "F",
    });

    this.systems.push(heavyLongCooldownWeapon);

    let crapBlaster: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Crap Blaster",
      cooldownDuration: 5,
      reuseDuration: 5,
      energyCost: 0,
      projectileData: {
        range: 2,
        speed: 30,
        textureName: "beam",
        damage: 0.5,
        mass: 0,
      },
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "X",
    });

    this.systems.push(crapBlaster);

    this.controller = controller;
    this.isPlayerTeam = isPlayerTeam;
  }

  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  preUpdate() {
    // TODO: Replace this with code for ship death
    // Heal if you hit 0 hp to reset. This is for "Pseudo death"
    if (this.hp.getCurrentValue() <= 0) {
      this.hp.reset();

      if (this.isPlayerTeam) {
        this.x = 0;
        this.y = 1800;
      } else {
        this.x = 0;
        this.y = -1000;
      }
    }

    this.ticksSinceEnergyMessage++;
    this.ticksSinceCooldownMessage++;

    let targetRotation = this.controller.controlShip(this);

    let rotateSpeed = 0.05;

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      targetRotation,
      rotateSpeed,
    );
  }

  getSystem(num: number): ShipSystem {
    return this.systems[num];
  }

  forward() {
    this.thrust(this.thrustPower);
  }

  backward() {
    this.thrustBack(this.thrustPower);
  }

  left() {
    this.thrustLeft(this.thrustPower);
  }

  right() {
    this.thrustRight(this.thrustPower);
  }

  useSystem(num: number) {
    // For easy shorthand
    let sys: ShipSystem = this.systems[num];

    shipLogger.trace("Trying to use \'" + sys.getSystemName() + "\'");

    if (!sys.isReady()) {
      shipLogger.trace(
        "System \'" + sys.getSystemName() + "\' not used due to refire delay",
      );
      return;
    }

    // If we don't have enough energy to use the system, don't use it.
    if (this.energy.getCurrentValue() < sys.getEnergyCost()) {
      let debugText: string =
        "Not enough energy to use: \'" + sys.getSystemName() + "\'";
      shipLogger.debug(debugText);
      if (this.ticksSinceEnergyMessage > 50) {
        this.gameScene.getAlertManager().textPop(this.x, this.y, debugText);

        this.ticksSinceEnergyMessage = 0;
      }
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isOffCooldown()) {
      let debugText: string = "\'" + sys.getSystemName() + "\' isn\'t ready";
      shipLogger.debug(debugText);
      if (this.ticksSinceCooldownMessage > 50) {
        this.gameScene.getAlertManager().textPop(this.x, this.y, debugText);
        this.ticksSinceCooldownMessage = 0;
      }
      return;
    }

    sys.use();
    this.energy.reduceBy(sys.getEnergyCost());
    shipLogger.trace(
      "\'" + this.physicsObjectName + "\' Used \'" + sys.getSystemName() + "\'",
    );
  }
}
