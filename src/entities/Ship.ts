import type GameScene from "../scenes/GameScene";

import ShipSystem from "../entities/ShipSystem";
import Shield from "./Shield";
import ValueBar from "./ValueBar";
import { XenoLog } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";
import type ShipData from "../types/ShipData";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

export default class Ship extends PhysicsEntity {
  private static count: number = 0;
  private shipID!: number;
  private shield!: Shield;
  private hp!: ValueBar;
  private energy!: ValueBar;
  private systems!: Array<ShipSystem>;

  private controller!: BaseController;
  private explodeParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private isPlayerTeam!: boolean;

  private ticksSinceEnergyMessage: number = 0;
  private ticksSinceCooldownMessage: number = 0;

  private shipData: ShipData;

  constructor(
    scene: GameScene,
    shipName: string,
    x: number,
    y: number,
    textureName: string,
    controller: BaseController,
    isPlayerTeam: boolean,
    shipData: ShipData,
  ) {
    super(scene, x, y, shipName, PhysicsEntityType.SHIP, textureName, true);
    XenoLog.ship.info("Ship \'" + shipName + "\' Created", shipData);

    this.shipData = shipData;

    Ship.count++;
    this.shipID = Ship.count;
    this.image.setCollisionGroup(-this.shipID);
    this.image.setMass(100);

    /// Put shield in it's own object class
    this.shield = new Shield(scene, this);
    this.hp = new ValueBar(scene, this, 0, 0x993333, 100, 100, 0.01);
    this.energy = new ValueBar(scene, this, 15, 0x9999ff, 70, 100, 0.5);

    this.explodeParticleEmitter = scene.add.particles(0, 0, "i_0003", {
      lifespan: 2000,
      speed: { min: 25, max: 50 },
      angle: { min: 0, max: 360 },
      emitting: false,
      blendMode: "ADD",
      scale: 0.25,
      alpha: { start: 0.5, end: 0, ease: "expo.out" },
    });

    this.systems = new Array<ShipSystem>();

    let basicWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Plasma Cannon",
      cooldownDuration: 40,
      reuseDuration: 40,
      energyCost: 10,
      projectileData: {
        range: 15,
        speed: 10,
        textureName: "pew-blue",
        damage: 20,
        mass: 0,
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
        textureName: "pew-yellow",
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
        textureName: "pew-big-green",
        damage: 20,
        mass: 6400,
      },
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "F",
    });

    this.systems.push(heavyLongCooldownWeapon);

    let crapBlaster: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Crap Blaster",
      cooldownDuration: 40,
      reuseDuration: 40,
      energyCost: 0,
      projectileData: {
        range: 15,
        speed: 10,
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

  // GETTERS
  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  getCurrentEnergy(): number {
    return this.energy.getCurrentValue();
  }

  getShipID(): number {
    return this.shipID;
  }

  getSystem(num: number): ShipSystem {
    return this.systems[num];
  }

  getVelocity(): Phaser.Types.Math.Vector2Like {
    return this.image.getVelocity();
  }

  get x(): number {
    return this.image.x;
  }

  get y(): number {
    return this.image.y;
  }

  get displayWidth(): number {
    return this.image.displayWidth;
  }

  get displayHeight(): number {
    return this.image.displayHeight;
  }

  get rotation(): number {
    return this.image.rotation;
  }

  preUpdate() {
    // Ship Death code
    if (this.hp.getCurrentValue() <= 0) {
      // Play the explosion effect.
      this.explode();

      // Move their position back to spawn.
      if (this.isPlayerTeam) {
        this.image.x = 0;
        this.image.y = 1800;
      } else {
        this.image.x = 0;
        this.image.y = -1000;
      }

      // Heal back to full
      this.hp.reset();
    }

    this.ticksSinceEnergyMessage++;
    this.ticksSinceCooldownMessage++;

    let targetRotation = this.controller.controlShip(this);

    this.image.rotation = Phaser.Math.Angle.RotateTo(
      this.image.rotation,
      targetRotation,
      this.shipData.rotationSpeed,
    );
  }

  hurt(damageAmount: number) {
    this.hp.reduceBy(damageAmount);
    this.shield.hit();
  }
  // TESTING Methods
  explode() {
    this.explodeParticleEmitter.x = this.x;
    this.explodeParticleEmitter.y = this.y;
    this.explodeParticleEmitter.explode(32);
  }

  /// Controls
  forward() {
    //this.thrust(this.shipData.thrustPower);

    this.image.applyForce(
      new Phaser.Math.Vector2(0, -this.shipData.thrustPower),
    );
  }

  backward() {
    //this.thrustBack(this.shipData.thrustPower);
    this.image.applyForce(
      new Phaser.Math.Vector2(0, this.shipData.thrustPower),
    );
  }

  left() {
    //this.thrustLeft(this.shipData.thrustPower);
    this.image.applyForce(
      new Phaser.Math.Vector2(-this.shipData.thrustPower, 0),
    );
  }

  right() {
    //this.thrustRight(this.shipData.thrustPower);
    this.image.applyForce(
      new Phaser.Math.Vector2(this.shipData.thrustPower, 0),
    );
  }

  useSystem(num: number) {
    // For easy shorthand
    let sys: ShipSystem = this.systems[num];

    XenoLog.ship.trace("Trying to use \'" + sys.getSystemName() + "\'");

    if (!sys.isReady()) {
      XenoLog.ship.trace(
        "System \'" + sys.getSystemName() + "\' not used due to refire delay",
      );
      return;
    }

    // If we don't have enough energy to use the system, don't use it.
    if (this.energy.getCurrentValue() < sys.getEnergyCost()) {
      let debugText: string =
        "Not enough energy to use: \'" + sys.getSystemName() + "\'";
      XenoLog.ship.debug(debugText);
      if (this.ticksSinceEnergyMessage > 50) {
        this.scene.getAlertManager().textPop(this.x, this.y, debugText);

        this.ticksSinceEnergyMessage = 0;
      }
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isOffCooldown()) {
      let debugText: string = "\'" + sys.getSystemName() + "\' isn\'t ready";
      XenoLog.ship.debug(debugText);
      if (this.ticksSinceCooldownMessage > 50) {
        this.scene.getAlertManager().textPop(this.x, this.y, debugText);
        this.ticksSinceCooldownMessage = 0;
      }
      return;
    }

    sys.use();
    this.energy.reduceBy(sys.getEnergyCost());
    XenoLog.ship.trace(
      "\'" + " boop " + "\' Used \'" + sys.getSystemName() + "\'",
    );
  }
}
