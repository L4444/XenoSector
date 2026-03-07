import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";

import type VehicleModuleData from "../types/VehicleModuleData";

import { VehicleModuleUseResult } from "../types/VehicleModuleUseResult";
import type ICanUseVehicleModule from "../interfaces/ICanUseVehicleModule";
import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import Timer from "../helpers/Timer";
import ChargeTimer from "../helpers/ChargeTimer";

export default class VehicleModule extends BaseEntity {
  private data: VehicleModuleData;
  private parentVehicle!: ICanUseVehicleModule;
  private cooldownTimer!: Timer;
  private chargeTimer!: ChargeTimer;

  private readonly totalDelay: number = 1;

  constructor(
    xenoCreator: XenoCreator,
    _projectileManager: ProjectileManager,
    parentVehicle: ICanUseVehicleModule,
    VehicleModuleData: VehicleModuleData,
  ) {
    super(xenoCreator);
    this.data = VehicleModuleData;

    this.parentVehicle = parentVehicle;
    this.cooldownTimer = new Timer();
    this.chargeTimer = new ChargeTimer(
      this.data.chargeDuration,
      this.data.maxCharges,
    );
  }

  canUse(): VehicleModuleUseResult {
    if (this.isOnCooldown()) {
      return VehicleModuleUseResult.ON_COOLDOWN;
    }

    if (!this.hasEnergy()) {
      return VehicleModuleUseResult.LOW_ENERGY;
    }

    if (this.getCurrentCharges() < 1) {
      return VehicleModuleUseResult.NO_CHARGES;
    }

    return VehicleModuleUseResult.SUCCESS;
  }

  // This function will be called outside the class
  use(): VehicleModuleUseResult {
    let result: VehicleModuleUseResult = this.canUse();
    if (result != VehicleModuleUseResult.SUCCESS) {
      return result;
    }

    XenoLog.mode.debug("------ \'" + this.data.moduleName + "\' has been used");

    // Send it to the Vehicle to execute
    this.parentVehicle.doActions(this.data.actions);

    this.chargeTimer.useCharge();
    this.cooldownTimer.start(this.data.cooldownDuration);

    return VehicleModuleUseResult.SUCCESS;
  }

  hasEnergy(): boolean {
    return this.parentVehicle.getEnergy() >= this.getEnergyCost();
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
