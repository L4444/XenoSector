import type ProjectileManager from "../managers/ProjectileManager";
import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import type GameScene from "../scenes/GameScene";
import BasicWeapon from "../shipsystems/BasicWeapon";
import HeavyLongCooldownWeapon from "../shipsystems/HeavyLongCooldownWeapon";
import RapidFireWeapon from "../shipsystems/RapidFireWeapon";
import ShipSystem from "../shipsystems/ShipSystem";
import { EntityType } from "../types/EntityType";
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

  constructor(
    scene: GameScene,
    shipName: string,
    x: number,
    y: number,
    textureName: string,
    projectileManager: ProjectileManager,
  ) {
    super(scene, shipName, x, y, textureName, true, 100, 0.01, EntityType.SHIP);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);

    this.projectileManager = projectileManager;

    /// Put shield in it's own object class
    this.shield = new Shield(scene, this);
    this.hp = new ValueBar(scene, this, 0, 0x993333, 100, 100, 0.1);
    this.energy = new ValueBar(scene, this, 15, 0x9999ff, 70, 100, 0.5);

    this.systems = new Array<ShipSystem>();

    this.systems.push(new BasicWeapon(scene, this));
    this.systems.push(new RapidFireWeapon(scene, this));
    this.systems.push(new HeavyLongCooldownWeapon(scene, this));
  }

  preUpdate() {
    // TODO: Replace this with code for ship death
    // Heal if you hit 0 hp to reset. This is for "Pseudo death"
    if (this.hp.getCurrentValue() <= 0) {
      this.hp.reset();
    }
  }

  useSystem(num: number) {
    // For easy shorthand
    let sys: ShipSystem = this.systems[num];

    // If we don't have enough energy to use the system, don't use it.
    if (this.energy.getCurrentValue() < sys.getEnergyCost()) {
      console.log(" not enough energy ");
      return;
    }

    // If the system isn't ready to usem don't use it
    if (!sys.isReady()) {
      console.log(" system  isn't ready ");
      return;
    }

    sys.use();
    this.energy.reduceBy(sys.getEnergyCost());
  }
}
