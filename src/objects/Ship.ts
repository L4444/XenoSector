import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";

export default class Ship extends DynamicPhysicsObject {
  static count: number = 0;
  shipID!: number;
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
  }

  onHit(): void {
    console.log("Ship " + this.shipID + " has been hit");
  }
}
