import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import Shield from "./Shield";
import ValueBar from "./ValueBar";

export default class Ship extends DynamicPhysicsObject {
  static count: number = 0;
  shipID!: number;
  shield!: Shield;
  hp!: ValueBar;
  energy!: ValueBar;

  constructor(
    scene: Phaser.Scene,
    shipName: string,
    x: number,
    y: number,
    textureName: string,
  ) {
    super(scene, shipName, x, y, textureName, true, 100, 0.01);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);

    /// Put shield in it's own object class
    this.shield = new Shield(scene, this);
    this.hp = new ValueBar(scene, this, 0, 0x993333, 100, 100, 1);
    this.energy = new ValueBar(scene, this, 15, 0x9999ff, 70, 100, 0.5);
  }

  preUpdate() {
    // Do nothing for now
  }

  dealDamage() {
    this.hp.reduce(10);
  }

  useEnergy() {
    this.energy.reduce(1);
  }

  onHit(): void {
    console.log("Ship " + this.shipID + " has been hit");
    this.shield.hit();
    this.hp.reduce(-1);
  }
}
