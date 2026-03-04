import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";
import SystemEffect from "../SystemEffects/SystemEffect";

import type ShipSystemData from "../types/ShipSystemData";

import { ShipSystemUseResult } from "../types/ShipSystemUseResult";
import type ICanUseShipSystem from "../interfaces/ICanUseShipSystem";
import BaseEntity from "./BaseEntity";
import type XenoCreator from "../helpers/XenoCreator";
import Timer from "../helpers/Timer";
import ChargeTimer from "../helpers/ChargeTimer";

export default class ShipSystem extends BaseEntity {
  private data: ShipSystemData;
  private parentShip!: ICanUseShipSystem;
  private cooldownTimer!: Timer;
  private chargeTimer!: ChargeTimer;

  private projectileManager!: ProjectileManager;

  private effectTick: number = 0;

  private readonly totalDelay: number = 1;

  private effectsToActivate: Array<SystemEffect> = new Array<SystemEffect>();

  constructor(
    xenoCreator: XenoCreator,
    projectileManager: ProjectileManager,
    parentShip: ICanUseShipSystem,
    shipSystemData: ShipSystemData,
  ) {
    super(xenoCreator);
    this.data = shipSystemData;
    this.projectileManager = projectileManager;

    this.parentShip = parentShip;
    this.cooldownTimer = new Timer(this.data.cooldownDuration);
    this.chargeTimer = new ChargeTimer(
      this.data.chargeDuration,
      this.data.maxCharges,
    );

    XenoLog.syst.trace("Counting up total \'cast time\' (totalDelay)");
    for (let i = 0; i < this.data.effects.length; i++) {
      this.totalDelay += this.data.effects[i].getWindDown();
      XenoLog.syst.trace(
        " i = " + i + " and totalDelay so far is " + this.totalDelay,
      );
    }
    XenoLog.syst.debug(
      "The totalDelay total is " +
        this.totalDelay +
        " for " +
        this.getSystemName(),
    );
  }

  canUse(): ShipSystemUseResult {
    if (this.isOnCooldown()) {
      return ShipSystemUseResult.ON_COOLDOWN;
    }

    if (!this.hasEnergy()) {
      return ShipSystemUseResult.LOW_ENERGY;
    }

    if (this.getCurrentCharges() < 1) {
      return ShipSystemUseResult.NO_CHARGES;
    }

    return ShipSystemUseResult.SUCCESS;
  }

  // This function will be called outside the class
  use(): ShipSystemUseResult {
    let result: ShipSystemUseResult = this.canUse();
    if (result != ShipSystemUseResult.SUCCESS) {
      return result;
    }

    this.effectsToActivate = [...this.data.effects];

    XenoLog.syst.debug(
      "\'" +
        this.data.systemName +
        "\' has been used    -------------------------------",
      "The effects are: ",
      this.effectsToActivate,
    );
    this.chargeTimer.useCharge();
    this.cooldownTimer.start();

    return ShipSystemUseResult.SUCCESS;
  }

  hasEnergy(): boolean {
    return this.parentShip.getEnergy() >= this.getEnergyCost();
  }

  getSystemName(): string {
    return this.data.systemName;
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

    if (this.effectsToActivate.length > 0) {
      let currentEffect = this.effectsToActivate[0];

      if (this.effectTick == 0) {
        XenoLog.syst.debug(
          "\'" + currentEffect.getName() + "\' is about to be activated",
        );
        currentEffect.onActivate(
          this.parentShip.getShipSystemUsageOptions(),
          this.projectileManager,
        );
      }

      this.effectTick++;

      if (this.effectTick >= currentEffect.getWindDown()) {
        this.effectsToActivate.shift();
        this.effectTick = 0;
      }

      XenoLog.syst.trace(
        "\'" +
          currentEffect.getName() +
          "\' is winding down.... " +
          this.effectTick +
          "\/" +
          currentEffect.getWindDown(),
      );
    }
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

  isBusy(): boolean {
    return this.effectsToActivate.length > 0;
  }
}
