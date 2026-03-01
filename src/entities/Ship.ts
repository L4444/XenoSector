import ShipSystem from "../entities/ShipSystem";
import Shield from "./Shield";
import ValueBar from "./ValueBar";
import { XenoLog } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";
import type ShipData from "../types/ShipData";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import type ShipControlInput from "../types/ShipControlInput";
import type XenoCreator from "../helpers/XenoCreator";
import type ProjectileManager from "../managers/ProjectileManager";
import AlertManager from "../managers/AlertManager";
import { RenderDepth } from "../types/RenderDepth";

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
  private turret!: Phaser.GameObjects.Image;

  private alertManager!: AlertManager;

  constructor(
    xenoCreator: XenoCreator,
    projectileManager: ProjectileManager,
    alertManager: AlertManager,
    shipName: string,
    x: number,
    y: number,
    textureKey: string,
    controller: BaseController,
    isPlayerTeam: boolean,
    shipData: ShipData,
  ) {
    super(
      xenoCreator,
      x,
      y,
      textureKey,
      shipName,
      PhysicsEntityType.SHIP,
      true,
      100,
    );
    XenoLog.ship.debug("Ship \'" + shipName + "\' Created", shipData);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);
    this.shipData = shipData;
    this.controller = controller;
    this.isPlayerTeam = isPlayerTeam;

    this.alertManager = alertManager;

    /// Put shield in it's own object class
    this.shield = new Shield(xenoCreator, this);

    let barBorderColour: string = isPlayerTeam ? "#66CCFF" : "#FF9999";

    this.hp = new ValueBar(
      xenoCreator,
      this,
      0, // offset
      0x6666ff,
      barBorderColour,
      100,
      100,
    );
    this.energy = new ValueBar(
      xenoCreator,
      this,
      10, // offset
      0xcccc00,
      barBorderColour,
      70,
      100,
    );

    this.explodeParticleEmitter = xenoCreator.createParticleEmitter(
      0,
      0,
      "i_0003",
      {
        lifespan: 2000,
        speed: { min: 25, max: 50 },
        angle: { min: 0, max: 360 },
        emitting: false,
        blendMode: "ADD",
        scale: 0.25,
        alpha: { start: 0.5, end: 0, ease: "expo.out" },
      },
      RenderDepth.SHIPS,
    );

    this.turret = xenoCreator.createBasicImage(
      0,
      0,
      "pew-big-green",
      RenderDepth.TURRETS,
    );

    this.systems = new Array<ShipSystem>();

    let basicWeapon: ShipSystem = new ShipSystem(
      projectileManager,
      xenoCreator,
      this,
      {
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
        uiTextureName: "target-icon",
        playerKeyBind: "M1",
      },
    );

    this.systems.push(basicWeapon);

    let rapidFireWeapon: ShipSystem = new ShipSystem(
      projectileManager,
      xenoCreator,
      this,
      {
        systemName: "Machine Gun",
        cooldownDuration: 3,
        reuseDuration: 3,
        energyCost: 15,
        projectileData: {
          range: 10,
          speed: 20,
          textureName: "pew-yellow",
          damage: 15,
          mass: 0,
        },
        uiTextureName: "machinegun-icon",
        playerKeyBind: "M2",
      },
    );

    this.systems.push(rapidFireWeapon);

    let heavyLongCooldownWeapon: ShipSystem = new ShipSystem(
      projectileManager,
      xenoCreator,
      this,
      {
        systemName: "Rad Blaster",
        cooldownDuration: 60,
        reuseDuration: 20,
        energyCost: 10,
        projectileData: {
          range: 15,
          speed: 20,
          textureName: "pew-big-green",
          damage: 20,
          mass: 6400,
        },
        uiTextureName: "rad-icon",
        playerKeyBind: "F",
      },
    );

    this.systems.push(heavyLongCooldownWeapon);

    let crapBlaster: ShipSystem = new ShipSystem(
      projectileManager,
      xenoCreator,
      this,
      {
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
      },
    );

    this.systems.push(crapBlaster);
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

  respawn() {
    // Play the explosion effect.
    this.explode();

    // Move their position back to spawn.
    if (this.isPlayerTeam) {
      this.setPosition(0, 1800);
    } else {
      this.setPosition(0, 1000);
    }

    // Reset velocity so the ship doesn't respawn at speed
    this.setVelocity(0, 0);

    // Heal back to full
    this.hp.reset();
  }

  preUpdate() {
    // Ship Death code
    if (this.hp.getCurrentValue() <= 0) {
      this.respawn();
    }

    this.ticksSinceEnergyMessage++;
    this.ticksSinceCooldownMessage++;

    let sci: ShipControlInput = this.controller.getShipInput(this);

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      sci.shipTargetRotation,
      this.shipData.rotationSpeed,
    );

    this.turret.rotation = Phaser.Math.Angle.RotateTo(
      this.turret.rotation,
      sci.turretTargetRotation,
      this.shipData.rotationSpeed,
    );

    let isThrust: boolean = false;

    // The four cardinal directions
    if (sci.thrust.north) {
      this.applyForce(0, -this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.east) {
      this.applyForce(this.shipData.thrustPower, 0);
      isThrust = true;
    }
    if (sci.thrust.south) {
      this.applyForce(0, this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.west) {
      this.applyForce(-this.shipData.thrustPower, 0);
      isThrust = true;
    }

    // Relative position
    if (sci.thrust.forward) {
      this.thrustForward(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.back) {
      this.thrustBack(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.left) {
      this.thrustLeft(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.right) {
      this.thrustRight(this.shipData.thrustPower);
      isThrust = true;
    }

    // Activate systems
    if (sci.systems[0]) {
      this.useSystem(0);
    }

    if (sci.systems[1]) {
      this.useSystem(1);
    }
    if (sci.systems[2]) {
      this.useSystem(2);
    }
    if (sci.systems[3]) {
      this.useSystem(3);
    }

    let vel = this.getVelocity();
    let maxSpeed = this.shipData.maxSpeed;

    const currentSpeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    // If we are not thrusting, slow down gently
    if (!isThrust) {
      const brakeThruster: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        -vel.x,
        -vel.y,
      );

      brakeThruster.scale(0.005);

      this.applyForce(brakeThruster.x, brakeThruster.y);
    }

    // Limit according to max speed
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      this.setVelocity(vel.x * scale, vel.y * scale);
    }

    // Regen health and energy
    this.hp.increaseBy(0.01);
    this.energy.increaseBy(0.5);
  }

  postUpdate(): void {
    this.turret.x = this.x;
    this.turret.y = this.y;
  }

  takeDamage(damageAmount: number) {
    this.hp.reduceBy(damageAmount);
    this.shield.hit();

    XenoLog.ship.debug(
      "\'" +
        this.physicsEntityName +
        "\' has taken " +
        damageAmount +
        " damage",
    );
  }
  // TESTING Methods
  explode() {
    this.explodeParticleEmitter.x = this.x;
    this.explodeParticleEmitter.y = this.y;
    this.explodeParticleEmitter.explode(32);
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
        this.alertManager.textPop(this.x, this.y, debugText);

        this.ticksSinceEnergyMessage = 0;
      }
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isOffCooldown()) {
      let debugText: string = "\'" + sys.getSystemName() + "\' isn\'t ready";
      XenoLog.ship.debug(debugText);
      if (this.ticksSinceCooldownMessage > 50) {
        this.alertManager.textPop(this.x, this.y, debugText);
        this.ticksSinceCooldownMessage = 0;
      }
      return;
    }

    sys.use({
      rotation: this.turret.rotation,
      x: this.x,
      y: this.y,
      velocityX: this.getVelocity().x,
      velocityY: this.getVelocity().y,
      isPlayerTeam: this.isPlayerTeam,
      shipID: this.shipID,
    });
    this.energy.reduceBy(sys.getEnergyCost());
    XenoLog.ship.trace(
      "\'" + " boop " + "\' Used \'" + sys.getSystemName() + "\'",
    );
  }
}
