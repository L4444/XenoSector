import type Ship from "../entities/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import type GameScene from "../scenes/GameScene";
import type ShipSystemData from "../types/ShipSystemData";
import BaseEntity from "./BaseEntity";

export default class ShipSystem extends BaseEntity {
  private data: ShipSystemData;
  private parentShip!: Ship;
  private cooldownRemaining: number = 0;
  private reuseRemaining: number = 0;

  constructor(
    scene: GameScene,
    parentShip: Ship,

    shipSystemData: ShipSystemData,
  ) {
    super(scene);

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

  getUITextureName(): string {
    return this.data.uiTextureName;
  }

  getKeybind(): string {
    return this.data.playerKeyBind;
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

  getProgress(): number {
    return this.cooldownRemaining / this.data.cooldownDuration;
  }

  // This function should be overrided in the child class
  onActivate() {
    this.scene
      .getProjectileManager()
      .shoot(this.getParentShip(), this.data.projectileData);
  }

  // This function should be overrided in the child class
  onHit(_hitObject: BasePhysicsObject) {}
}
