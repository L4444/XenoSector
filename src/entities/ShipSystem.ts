import type Ship from "../entities/Ship";
import type XenoCreator from "../helpers/XenoCreator";
import type ProjectileManager from "../managers/ProjectileManager";
import FooEffect from "../SystemEffects/FooEffect";
import SystemEffect from "../SystemEffects/SystemEffect";

import type ShipSystemData from "../types/ShipSystemData";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

import BaseEntity from "./BaseEntity";

export default class ShipSystem extends BaseEntity {
  private data: ShipSystemData;
  private parentShip!: Ship;
  private cooldownRemaining: number = 0;

  private chargeTimeRemaining: number = 0;
  private projectileManager!: ProjectileManager;
  private currentCharges!: number;

  constructor(
    projectileManager: ProjectileManager,
    xenoCreator: XenoCreator,
    parentShip: Ship,
    shipSystemData: ShipSystemData,
  ) {
    super(xenoCreator);

    this.data = shipSystemData;
    this.projectileManager = projectileManager;
    this.currentCharges = this.data.maxCharges;
    this.parentShip = parentShip;
  }

  // This function will be called outside the class
  use(useShipSystemData: ShipSystemUsageOptions) {
    this.chargeTimeRemaining = this.data.chargeDuration;
    this.cooldownRemaining = this.data.cooldownDuration;

    for (let i = 0; i < this.data.effects.length; i++) {
      this.data.effects[i].onApply(this.parentShip, useShipSystemData);
    }

    this.currentCharges--;
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

  getCastDuration(): number {
    return this.data.castDuration;
  }

  postUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }

    if (this.chargeTimeRemaining > 0) {
      this.chargeTimeRemaining--;
    }

    if (this.chargeTimeRemaining == 0) {
      if (this.currentCharges < this.data.maxCharges) {
        this.currentCharges++;
        this.chargeTimeRemaining = this.data.chargeDuration;
      }
    }

    for (let i = 0; i < this.data.effects.length; i++) {
      this.data.effects[i].onTick();
    }
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

  getCharges(): number {
    return this.currentCharges;
  }
}
