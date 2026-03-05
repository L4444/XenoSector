import type ProjectileManager from "../managers/ProjectileManager";
import ShipModule from "../entities/ShipModule";
import TestShip from "./TestShip";

import { ShipModuleUseResult } from "../types/ShipModuleUseResult";
import { XenoLog } from "../helpers/XenoLogger";
import XenoCreator from "../helpers/XenoCreator";

export default class RunShipModuleTests {
  private ShipModuleCooldown!: ShipModule;
  private ShipModuleCharges!: ShipModule;
  private ShipModuleChargesAndCooldown!: ShipModule;
  private ShipModuleEnergyCharges!: ShipModule;
  private ShipModuleEnergyCooldown!: ShipModule;
  private currentShipModule!: ShipModule;

  private testShip!: TestShip;

  constructor(xenoCreator: XenoCreator, pm: ProjectileManager) {
    this.testShip = new TestShip();
    this.ShipModuleCooldown = new ShipModule(xenoCreator, pm, this.testShip, {
      moduleName: "Test Module: Cooldown",
      cooldownDuration: 10,
      energyCost: 0,
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "X",
      maxCharges: 1,
      chargeDuration: 0,
      actions: [],
    });

    this.ShipModuleCharges = new ShipModule(xenoCreator, pm, this.testShip, {
      moduleName: "Test Module: Charges",
      cooldownDuration: 0,
      energyCost: 0,
      uiTextureName: "RadBlasterPlaceholder",
      playerKeyBind: "X",
      maxCharges: 1,
      chargeDuration: 30,
      actions: [],
    });

    this.ShipModuleChargesAndCooldown = new ShipModule(
      xenoCreator,
      pm,
      this.testShip,
      {
        moduleName: "Test Module: Charges and cooldown",
        cooldownDuration: 30,
        energyCost: 0,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 30,
        actions: [],
      },
    );

    this.ShipModuleEnergyCharges = new ShipModule(
      xenoCreator,
      pm,
      this.testShip,
      {
        moduleName: "Test Module: Energy and charges",
        cooldownDuration: 0,
        energyCost: 50,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 30,
        actions: [],
      },
    );

    this.ShipModuleEnergyCooldown = new ShipModule(
      xenoCreator,
      pm,
      this.testShip,
      {
        moduleName: "Test Module: Energy and cooldown",
        cooldownDuration: 30,
        energyCost: 50,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 99,
        chargeDuration: 0,
        actions: [],
      },
    );
    this.setCurrentModule(this.ShipModuleCharges);
    this.runTest(0, false, ShipModuleUseResult.SUCCESS);
    this.runTest(0, false, ShipModuleUseResult.NO_CHARGES);

    this.setCurrentModule(this.ShipModuleCooldown);
    this.runTest(0, false, ShipModuleUseResult.SUCCESS);
    this.runTest(0, false, ShipModuleUseResult.ON_COOLDOWN);

    this.setCurrentModule(this.ShipModuleChargesAndCooldown);
    this.runTest(0, false, ShipModuleUseResult.SUCCESS);
    this.runTest(0, false, ShipModuleUseResult.ON_COOLDOWN);

    this.setCurrentModule(this.ShipModuleEnergyCharges);
    this.runTest(0, false, ShipModuleUseResult.LOW_ENERGY);
    this.runTest(50, false, ShipModuleUseResult.SUCCESS);
    this.runTest(50, false, ShipModuleUseResult.NO_CHARGES);

    this.setCurrentModule(this.ShipModuleEnergyCooldown);
    this.runTest(0, false, ShipModuleUseResult.LOW_ENERGY);
    this.runTest(50, false, ShipModuleUseResult.SUCCESS);
    this.runTest(50, false, ShipModuleUseResult.ON_COOLDOWN);
  }

  private runTest(
    energy: number,
    isCasting: boolean,

    targetResult: ShipModuleUseResult,
  ) {
    let response: string =
      "Running test for \'" +
      this.currentShipModule.getModuleName() +
      "\'" +
      "\nEnergy is \'" +
      energy +
      "\'" +
      "\nisCasting is \'" +
      isCasting +
      "\'";

    this.testShip.setParameters(energy, isCasting);
    let result: ShipModuleUseResult = this.currentShipModule.use();

    response += "\nExpected: " + targetResult + "\nActual: " + result;

    if (result == targetResult) {
      XenoLog.unit.debug("(PASSED) " + response);
    } else {
      XenoLog.unit.error("(FAILED) " + response);
    }
  }

  private setCurrentModule(ShipModule: ShipModule) {
    XenoLog.unit.debug("---- Tests for " + ShipModule.getModuleName());
    this.currentShipModule = ShipModule;
  }
}
