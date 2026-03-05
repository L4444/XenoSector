import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";

import type ShipModuleData from "../types/ShipModuleData";

import { ShipModuleUseResult } from "../types/ShipModuleUseResult";
import type ICanUseShipModule from "../interfaces/ICanUseShipModule";
import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import Timer from "../helpers/Timer";
import ChargeTimer from "../helpers/ChargeTimer";

export default class ShipModule extends BaseEntity {
  private data: ShipModuleData;
  private parentShip!: ICanUseShipModule;
  private cooldownTimer!: Timer;
  private chargeTimer!: ChargeTimer;

  private readonly totalDelay: number = 1;

  constructor(
    xenoCreator: XenoCreator,
    _projectileManager: ProjectileManager,
    parentShip: ICanUseShipModule,
    ShipModuleData: ShipModuleData,
  ) {
    super(xenoCreator);
    this.data = ShipModuleData;

    this.parentShip = parentShip;
    this.cooldownTimer = new Timer();
    this.chargeTimer = new ChargeTimer(
      this.data.chargeDuration,
      this.data.maxCharges,
    );
  }

  canUse(): ShipModuleUseResult {
    if (this.isOnCooldown()) {
      return ShipModuleUseResult.ON_COOLDOWN;
    }

    if (!this.hasEnergy()) {
      return ShipModuleUseResult.LOW_ENERGY;
    }

    if (this.getCurrentCharges() < 1) {
      return ShipModuleUseResult.NO_CHARGES;
    }

    return ShipModuleUseResult.SUCCESS;
  }

  // This function will be called outside the class
  use(): ShipModuleUseResult {
    let result: ShipModuleUseResult = this.canUse();
    if (result != ShipModuleUseResult.SUCCESS) {
      return result;
    }

    XenoLog.mode.debug("------ \'" + this.data.moduleName + "\' has been used");

    // Send it to the ship to execute
    this.parentShip.doActions(this.data.actions);

    this.chargeTimer.useCharge();
    this.cooldownTimer.start(this.data.cooldownDuration);

    return ShipModuleUseResult.SUCCESS;
  }

  hasEnergy(): boolean {
    return this.parentShip.getEnergy() >= this.getEnergyCost();
  }

  getModuleName(): string {
    return this.data.moduleName;
  }

  getUITextureName(): string {
    return this.data.uiTextureName;
  }

  getKeybind(): string {
    return this.data.playerKeyBind;
  }

  getCastDuration(): number {
    return this.totalDelay;
  }

  getMaxCharges(): number {
    return this.data.maxCharges;
  }

  postUpdate() {
    this.cooldownTimer.update();
    this.chargeTimer.update();
  }

  isOnCooldown() {
    return this.cooldownTimer.isActive();
  }

  getEnergyCost(): number {
    return this.data.energyCost;
  }

  getCooldownRemainingRatio(): number {
    return this.cooldownTimer.getRemainingRatio();
  }

  getCurrentCharges(): number {
    return this.chargeTimer.getCharges();
  }
}
