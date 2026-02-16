import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";

export default class Ship extends DynamicPhysicsObject {
  static count: number = 0;
  shipID!: number;
  shield!: Phaser.GameObjects.Image;

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

    this.shield = scene.add.image(x, y, "shield");
    this.shield.displayWidth = this.displayWidth;
    this.shield.displayHeight = this.displayHeight;
    this.shield.alpha = 0.3;

    // Post update, the preUpdate() function calls BEFORE physics update so if I sync
    // the other elements (e.g. shield/thruster) they will lag slightly behind.
    scene.events.on("postupdate", this.postUpdate, this);
  }

  preUpdate() {
    if (this.shield.alpha > 0.3) {
      this.shield.alpha -= 0.01;
    }
  }

  postUpdate() {
    this.shield.x = this.x;
    this.shield.y = this.y;
  }

  onHit(): void {
    console.log("Ship " + this.shipID + " has been hit");
    this.shield.alpha = 1;
  }
}
