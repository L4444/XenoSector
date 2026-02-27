import type Ship from "../entities/Ship";

import type ShipSystemData from "../types/ShipSystemData";
import type UseShipSystemData from "../types/UseShipSystemData";
import type XenoGame from "../XenoGame";
import BaseEntity from "./BaseEntity";

export default class ShipSystem extends BaseEntity {
  private data: ShipSystemData;
  private parentShip!: Ship;
  private cooldownRemaining: number = 0;
  private reuseRemaining: number = 0;

  constructor(
    xenoGame: XenoGame,
    parentShip: Ship,

    shipSystemData: ShipSystemData,
  ) {
    super(xenoGame);

    this.data = shipSystemData;

    this.parentShip = parentShip;
  }

  // This function will be called outside the class
  use(shipSystemUseData: UseShipSystemData) {
    this.cooldownRemaining = this.data.cooldownDuration;
    this.reuseRemaining = this.data.reuseDuration;

    this.xenoGame
      .getProjectileManager()
      .shoot(shipSystemUseData, this.data.projectileData);
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
}
