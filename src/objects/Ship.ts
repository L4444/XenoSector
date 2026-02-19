import type ProjectileManager from "../managers/ProjectileManager";
import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import type GameScene from "../scenes/GameScene";

import ShipSystem from "../objects/ShipSystem";
import Shield from "./Shield";
import ValueBar from "./ValueBar";

export default class Ship extends DynamicPhysicsObject {
  static count: number = 0;
  shipID!: number;
  shield!: Shield;
  hp!: ValueBar;
  energy!: ValueBar;
  systems!: Array<ShipSystem>;
  projectileManager!: ProjectileManager;

  private ticksSinceEnergyMessage: number = 0;
  private ticksSinceCooldownMessage: number = 0;

  constructor(
    scene: GameScene,
    shipName: string,
    x: number,
    y: number,
    textureName: string,
    projectileManager: ProjectileManager,
  ) {
    super(scene, shipName, x, y, textureName, true, 100, 0.01);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);

    this.projectileManager = projectileManager;

    /// Put shield in it's own object class
    this.shield = new Shield(scene, this);
    this.hp = new ValueBar(scene, this, 0, 0x993333, 100, 100, 0.1);
    this.energy = new ValueBar(scene, this, 15, 0x9999ff, 70, 100, 0.5);

    this.systems = new Array<ShipSystem>();

    let basicWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Basic Weapon",
      cooldownDuration: 20,
      reuseDuration: 20,
      energyCost: 10,
      projectileData: {
        range: 15,
        speed: 20,
        textureName: "blue-pew",
        damage: 10,
        mass: 0.01,
      },
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
        damage: 3,
        mass: 0,
      },
    });

    this.systems.push(rapidFireWeapon);

    let heavyLongCooldownWeapon: ShipSystem = new ShipSystem(scene, this, {
      systemName: "Plasma Cannon",
      cooldownDuration: 60,
      reuseDuration: 20,
      energyCost: 10,
      projectileData: {
        range: 15,
        speed: 10,
        textureName: "green-pew",
        damage: 33,
        mass: 6400,
      },
    });

    this.systems.push(heavyLongCooldownWeapon);
  }

  preUpdate() {
    // TODO: Replace this with code for ship death
    // Heal if you hit 0 hp to reset. This is for "Pseudo death"
    if (this.hp.getCurrentValue() <= 0) {
      this.hp.reset();
    }

    this.ticksSinceEnergyMessage++;
    this.ticksSinceCooldownMessage++;
  }

  useSystem(num: number) {
    // For easy shorthand
    let sys: ShipSystem = this.systems[num];

    if (!sys.isReady()) {
      console.log("refire delay");
      return;
    }

    // If we don't have enough energy to use the system, don't use it.
    if (this.energy.getCurrentValue() < sys.getEnergyCost()) {
      let debugText: string =
        "Not enough energy to use: \'" + sys.getSystemName() + "\'";
      console.log(debugText);
      if (this.ticksSinceEnergyMessage > 50) {
        this.gameScene.getAlertManager().textPop(this.x, this.y, debugText);

        this.ticksSinceEnergyMessage = 0;
      }
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isOffCooldown()) {
      let debugText: string = "\'" + sys.getSystemName() + "\' isn\'t ready";
      console.log(debugText);
      if (this.ticksSinceCooldownMessage > 50) {
        this.gameScene.getAlertManager().textPop(this.x, this.y, debugText);
        this.ticksSinceCooldownMessage = 0;
      }
      return;
    }

    sys.use();
    this.energy.reduceBy(sys.getEnergyCost());
  }
}
