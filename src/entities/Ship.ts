import ShipSystem from "../entities/ShipSystem";
import Shield from "./Shield";
import ValueBar from "./ValueBar";
import { XenoLog } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";
import type ShipData from "../types/ShipData";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import XenoGame from "../XenoGame";
import type ShipControlInput from "../types/ShipControlInput";

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

  constructor(
    xenoGame: XenoGame,
    shipName: string,
    x: number,
    y: number,
    textureKey: string,
    controller: BaseController,
    isPlayerTeam: boolean,
    shipData: ShipData,
  ) {
    super(xenoGame, x, y, textureKey, shipName, PhysicsEntityType.SHIP, true);
    XenoLog.ship.debug("Ship \'" + shipName + "\' Created", shipData);

    this.shipData = shipData;

    Ship.count++;
    this.shipID = Ship.count;
    this.image.setCollisionGroup(-this.shipID);
    this.image.setMass(100);

    /// Put shield in it's own object class
    this.shield = new Shield(xenoGame, this);
    this.hp = new ValueBar(xenoGame, this, 0, 0x993333, 100, 100, 0.01);
    this.energy = new ValueBar(xenoGame, this, 15, 0x9999ff, 70, 100, 0.5);

    this.explodeParticleEmitter = xenoGame.createParticleEmitter(
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
    );

    this.turret = this.xenoGame.createBasicImage(0, 0, "pew-big-green");

    this.systems = new Array<ShipSystem>();

    let basicWeapon: ShipSystem = new ShipSystem(xenoGame, this, {
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

    let rapidFireWeapon: ShipSystem = new ShipSystem(xenoGame, this, {
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

    let heavyLongCooldownWeapon: ShipSystem = new ShipSystem(xenoGame, this, {
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

    let crapBlaster: ShipSystem = new ShipSystem(xenoGame, this, {
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

  respawn() {
    // Play the explosion effect.
    this.explode();

    // Move their position back to spawn.
    if (this.isPlayerTeam) {
      this.image.x = 0;
      this.image.y = 1800;
    } else {
      this.image.x = 0;
      this.image.y = 1000;
    }

    // Reset velocity so the ship doesn't respawn at speed
    this.image.setVelocity(0, 0);

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

    this.image.rotation = Phaser.Math.Angle.RotateTo(
      this.image.rotation,
      sci.shipTargetRotation,
      this.shipData.rotationSpeed,
    );

    this.turret.rotation = Phaser.Math.Angle.RotateTo(
      this.turret.rotation,
      sci.turretTargetRotation,
      this.shipData.rotationSpeed,
    );

    // The four cardinal directions
    if (sci.thrust.north) {
      this.image.applyForce(
        new Phaser.Math.Vector2(0, -this.shipData.thrustPower),
      );
    }
    if (sci.thrust.east) {
      this.image.applyForce(
        new Phaser.Math.Vector2(this.shipData.thrustPower, 0),
      );
    }
    if (sci.thrust.south) {
      this.image.applyForce(
        new Phaser.Math.Vector2(0, this.shipData.thrustPower),
      );
    }
    if (sci.thrust.west) {
      this.image.applyForce(
        new Phaser.Math.Vector2(-this.shipData.thrustPower, 0),
      );
    }

    // Relative position
    if (sci.thrust.forward) {
      this.image.thrust(this.shipData.thrustPower);
    }
    if (sci.thrust.back) {
      this.image.thrustBack(this.shipData.thrustPower);
    }
    if (sci.thrust.left) {
      this.image.thrustLeft(this.shipData.thrustPower);
    }
    if (sci.thrust.right) {
      this.image.thrustRight(this.shipData.thrustPower);
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

    let velocity = this.image.getVelocity();
    let maxSpeed = this.shipData.maxSpeed;

    const currentSpeed = Math.sqrt(
      velocity.x * velocity.x + velocity.y * velocity.y,
    );

    const drag: number = 0.95;

    // Activate the brake to slow down
    if (sci.brake) {
      this.image.setVelocity(velocity.x * drag, velocity.y * drag);
      if (currentSpeed < 1) {
        this.image.setVelocity(0, 0);
      }
    }

    // Limit according to max speed
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      this.image.setVelocity(velocity.x * scale, velocity.y * scale);
    }
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

  /// Controls

  thrustLeft() {
    this.image.thrustLeft(this.shipData.thrustPower);
  }
  thrustRight() {
    this.image.thrustRight(this.shipData.thrustPower);
  }
  thrustForward() {
    this.image.thrust(this.shipData.thrustPower);
  }
  thrustBackward() {
    this.image.thrustBack(this.shipData.thrustPower);
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
        this.xenoGame.getAlertManager().textPop(this.x, this.y, debugText);

        this.ticksSinceEnergyMessage = 0;
      }
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isOffCooldown()) {
      let debugText: string = "\'" + sys.getSystemName() + "\' isn\'t ready";
      XenoLog.ship.debug(debugText);
      if (this.ticksSinceCooldownMessage > 50) {
        this.xenoGame.getAlertManager().textPop(this.x, this.y, debugText);
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
