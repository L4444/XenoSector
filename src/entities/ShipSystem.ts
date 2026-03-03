import type Ship from "../entities/Ship";
import type XenoCreator from "../helpers/XenoCreator";
import { XenoLog } from "../helpers/XenoLogger";
import type ProjectileManager from "../managers/ProjectileManager";
import SystemEffect from "../SystemEffects/SystemEffect";

import type ShipSystemData from "../types/ShipSystemData";

import BaseEntity from "./BaseEntity";

export default class ShipSystem extends BaseEntity {
  private data: ShipSystemData;
  private parentShip!: Ship;
  private cooldownRemaining: number = 0;

  private chargeTimeRemaining: number = 0;
  private projectileManager!: ProjectileManager;
  private currentCharges!: number;

  private effectTick: number = 0;

  private totalDelay: number = 1;

  private effectsToActivate: Array<SystemEffect> = new Array<SystemEffect>();

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
  use() {
    this.effectsToActivate.push(...this.data.effects);
    XenoLog.syst.debug(
      "\'" +
        this.data.systemName +
        "\' has been used    -------------------------------",
      "The effects are: ",
      this.effectsToActivate,
    );
    this.chargeTimeRemaining = this.data.chargeDuration;
    this.cooldownRemaining = this.data.cooldownDuration;
    this.totalDelay = 0;

    XenoLog.syst.trace("Counting up total \'cast time\' (totalDelay)");
    for (let i = 0; i < this.effectsToActivate.length; i++) {
      this.totalDelay += this.effectsToActivate[i].getWindDown();
      XenoLog.syst.trace(
        " i = " + i + " and totalDelay so far is " + this.totalDelay,
      );
    }
    XenoLog.syst.debug("The totalDelay total is " + this.totalDelay);

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
    return this.totalDelay;
  }

  postUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }

    if (this.chargeTimeRemaining > 0) {
      this.chargeTimeRemaining--;
    }

    // Thankfully I clameped this??
    if (this.chargeTimeRemaining == 0) {
      if (this.currentCharges < this.data.maxCharges) {
        this.currentCharges++;
        this.chargeTimeRemaining = this.data.chargeDuration;
      }
    }

    if (this.effectsToActivate.length > 0) {
      let currentEffect = this.effectsToActivate[0];

      if (this.effectTick == 0) {
        XenoLog.syst.trace(
          "\'" + currentEffect.getName() + "\' is about to be activated",
        );
        currentEffect.onActivate(
          this.parentShip,
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

  isBusy(): boolean {
    return this.effectsToActivate.length > 0;
  }
}
