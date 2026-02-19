import type Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import type GameScene from "../scenes/GameScene";
import type ShipSystemData from "../types/ShipSystemData";

export default class ShipSystem {
  private data: ShipSystemData;
  private parentShip!: Ship;
  private cooldownRemaining: number = 0;
  private reuseRemaining: number = 0;
  protected scene!: GameScene;

  constructor(
    scene: GameScene,
    parentShip: Ship,

    shipSystemData: ShipSystemData,
  ) {
    // Manually add this to scene and physics (contructor doesn't do this for us)
    scene.events.on("postupdate", this.postUpdate, this);

    this.data = shipSystemData;

    this.parentShip = parentShip;
    this.scene = scene;
  }

  // This function will be called outside the class
  use() {
    this.cooldownRemaining = this.data.cooldownDuration;
    this.reuseRemaining = this.data.reuseDuration;
    //this.useSound.play();
    this.onActivate();
  }

  getSystemName(): string {
    return this.data.systemName;
  }

  getParentShip(): Ship {
    return this.parentShip;
  }

  postUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }

    if (this.reuseRemaining > 0) {
      this.reuseRemaining--;
    }
  }

  isReady() {
    return this.reuseRemaining == 0;
  }

  isOffCooldown() {
    return this.cooldownRemaining == 0;
  }

  getEnergyCost(): number {
    return this.data.energyCost;
  }

  // This function should be overrided in the child class
  onActivate() {
    this.scene
      .getProjectileManager()
      .shoot(this.getParentShip(), this.data.projectileData);
  }

  // This function should be overrided in the child class
  onHit(_hitObject: BasePhysicsObject) {}

  preUpdate() {}
}
