import type ProjectileManager from "../managers/ProjectileManager";
import VehicleModule from "../entities/VehicleModule";
import TestVehicle from "./TestVehicle";

import { VehicleModuleUseResult } from "../types/VehicleModuleUseResult";
import { XenoLog } from "../helpers/XenoLogger";
import XenoCreator from "../helpers/XenoCreator";

export default class RunVehicleModuleTests {
  private VehicleModuleCooldown!: VehicleModule;
  private VehicleModuleCharges!: VehicleModule;
  private VehicleModuleChargesAndCooldown!: VehicleModule;
  private VehicleModuleEnergyCharges!: VehicleModule;
  private VehicleModuleEnergyCooldown!: VehicleModule;
  private currentVehicleModule!: VehicleModule;

  private testVehicle!: TestVehicle;

  constructor(xenoCreator: XenoCreator, pm: ProjectileManager) {
    this.testVehicle = new TestVehicle();
    this.VehicleModuleCooldown = new VehicleModule(
      xenoCreator,
      pm,
      this.testVehicle,
      {
        moduleName: "Test Module: Cooldown",
        cooldownDuration: 10,
        energyCost: 0,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 0,
        actions: [],
      },
    );

    this.VehicleModuleCharges = new VehicleModule(
      xenoCreator,
      pm,
      this.testVehicle,
      {
        moduleName: "Test Module: Charges",
        cooldownDuration: 0,
        energyCost: 0,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 30,
        actions: [],
      },
    );

    this.VehicleModuleChargesAndCooldown = new VehicleModule(
      xenoCreator,
      pm,
      this.testVehicle,
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

    this.VehicleModuleEnergyCharges = new VehicleModule(
      xenoCreator,
      pm,
      this.testVehicle,
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

    this.VehicleModuleEnergyCooldown = new VehicleModule(
      xenoCreator,
      pm,
      this.testVehicle,
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
    this.setCurrentModule(this.VehicleModuleCharges);
    this.runTest(0, false, VehicleModuleUseResult.SUCCESS);
    this.runTest(0, false, VehicleModuleUseResult.NO_CHARGES);

    this.setCurrentModule(this.VehicleModuleCooldown);
    this.runTest(0, false, VehicleModuleUseResult.SUCCESS);
    this.runTest(0, false, VehicleModuleUseResult.ON_COOLDOWN);

    this.setCurrentModule(this.VehicleModuleChargesAndCooldown);
    this.runTest(0, false, VehicleModuleUseResult.SUCCESS);
    this.runTest(0, false, VehicleModuleUseResult.ON_COOLDOWN);

    this.setCurrentModule(this.VehicleModuleEnergyCharges);
    this.runTest(0, false, VehicleModuleUseResult.LOW_ENERGY);
    this.runTest(50, false, VehicleModuleUseResult.SUCCESS);
    this.runTest(50, false, VehicleModuleUseResult.NO_CHARGES);

    this.setCurrentModule(this.VehicleModuleEnergyCooldown);
    this.runTest(0, false, VehicleModuleUseResult.LOW_ENERGY);
    this.runTest(50, false, VehicleModuleUseResult.SUCCESS);
    this.runTest(50, false, VehicleModuleUseResult.ON_COOLDOWN);
  }

  private runTest(
    energy: number,
    isCasting: boolean,

    targetResult: VehicleModuleUseResult,
  ) {
    let response: string =
      "Running test for \'" +
      this.currentVehicleModule.getModuleName() +
      "\'" +
      "\nEnergy is \'" +
      energy +
      "\'" +
      "\nisCasting is \'" +
      isCasting +
      "\'";

    this.testVehicle.setParameters(energy, isCasting);
    let result: VehicleModuleUseResult = this.currentVehicleModule.use();

    response += "\nExpected: " + targetResult + "\nActual: " + result;

    if (result == targetResult) {
      XenoLog.unit.debug("(PASSED) " + response);
    } else {
      XenoLog.unit.error("(FAILED) " + response);
    }
  }

  private setCurrentModule(VehicleModule: VehicleModule) {
    XenoLog.unit.debug("---- Tests for " + VehicleModule.getModuleName());
    this.currentVehicleModule = VehicleModule;
  }
}
