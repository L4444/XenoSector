import type ProjectileManager from "../managers/ProjectileManager";
import ShipSystem from "../entities/ShipSystem";
import TestShip from "./TestShip";

import { ShipSystemUseResult } from "../types/ShipSystemUseResult";
import { XenoLog } from "../helpers/XenoLogger";
import XenoCreator from "../helpers/XenoCreator";

export default class RunShipSystemTests {
  private shipSystemCooldown!: ShipSystem;
  private shipSystemCharges!: ShipSystem;
  private shipSystemChargesAndCooldown!: ShipSystem;
  private shipSystemEnergyCharges!: ShipSystem;
  private shipSystemEnergyCooldown!: ShipSystem;
  private currentShipSystem!: ShipSystem;

  private testShip!: TestShip;

  constructor(xenoCreator: XenoCreator, pm: ProjectileManager) {
    this.testShip = new TestShip();
    this.shipSystemCooldown = new ShipSystem(xenoCreator, pm, this.testShip, {
      systemName: "Test System: Cooldown",
      cooldownDuration: 10,
      energyCost: 0,
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "X",
      maxCharges: 1,
      chargeDuration: 0,
      effects: [],
    });

    this.shipSystemCharges = new ShipSystem(xenoCreator, pm, this.testShip, {
      systemName: "Test System: Charges",
      cooldownDuration: 0,
      energyCost: 0,
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "X",
      maxCharges: 1,
      chargeDuration: 30,
      effects: [],
    });

    this.shipSystemChargesAndCooldown = new ShipSystem(
      xenoCreator,
      pm,
      this.testShip,
      {
        systemName: "Test System: Charges and cooldown",
        cooldownDuration: 30,
        energyCost: 0,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 30,
        effects: [],
      },
    );

    this.shipSystemEnergyCharges = new ShipSystem(
      xenoCreator,
      pm,
      this.testShip,
      {
        systemName: "Test System: Energy and charges",
        cooldownDuration: 0,
        energyCost: 50,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 30,
        effects: [],
      },
    );

    this.shipSystemEnergyCooldown = new ShipSystem(
      xenoCreator,
      pm,
      this.testShip,
      {
        systemName: "Test System: Energy and cooldown",
        cooldownDuration: 30,
        energyCost: 50,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 99,
        chargeDuration: 0,
        effects: [],
      },
    );
    this.setCurrentSystem(this.shipSystemCharges);
    this.runTest(0, false, ShipSystemUseResult.SUCCESS);
    this.runTest(0, false, ShipSystemUseResult.NO_CHARGES);

    this.setCurrentSystem(this.shipSystemCooldown);
    this.runTest(0, false, ShipSystemUseResult.SUCCESS);
    this.runTest(0, false, ShipSystemUseResult.ON_COOLDOWN);

    this.setCurrentSystem(this.shipSystemChargesAndCooldown);
    this.runTest(0, false, ShipSystemUseResult.SUCCESS);
    this.runTest(0, false, ShipSystemUseResult.ON_COOLDOWN);

    this.setCurrentSystem(this.shipSystemEnergyCharges);
    this.runTest(0, false, ShipSystemUseResult.LOW_ENERGY);
    this.runTest(50, false, ShipSystemUseResult.SUCCESS);
    this.runTest(50, false, ShipSystemUseResult.NO_CHARGES);

    this.setCurrentSystem(this.shipSystemEnergyCooldown);
    this.runTest(0, false, ShipSystemUseResult.LOW_ENERGY);
    this.runTest(50, false, ShipSystemUseResult.SUCCESS);
    this.runTest(50, false, ShipSystemUseResult.ON_COOLDOWN);
  }

  private runTest(
    energy: number,
    isCasting: boolean,

    targetResult: ShipSystemUseResult,
  ) {
    let response: string =
      "Running test for \'" +
      this.currentShipSystem.getSystemName() +
      "\'" +
      "\nEnergy is \'" +
      energy +
      "\'" +
      "\nisCasting is \'" +
      isCasting +
      "\'";

    this.testShip.setParameters(energy, isCasting);
    let result: ShipSystemUseResult = this.currentShipSystem.use();

    response += "\nExpected: " + targetResult + "\nActual: " + result;

    if (result == targetResult) {
      XenoLog.unit.debug("(PASSED) " + response);
    } else {
      XenoLog.unit.error("(FAILED) " + response);
    }
  }

  private setCurrentSystem(shipSystem: ShipSystem) {
    XenoLog.unit.debug("---- Tests for " + shipSystem.getSystemName());
    this.currentShipSystem = shipSystem;
  }
}
