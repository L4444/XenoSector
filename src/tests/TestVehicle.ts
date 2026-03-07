import ModuleAction from "../actions/ModuleAction";
import { XenoLog } from "../helpers/XenoLogger";
import type ICanUseVehicleModule from "../interfaces/ICanUseVehicleModule";
import type VehicleModuleUsageOptions from "../types/VehicleModuleUsageOptions";

export default class TestVehicle implements ICanUseVehicleModule {
  private testEnergy: number = 0;
  private testIsCasting: boolean = false;

  setParameters(testEnergy: number, testIsCasting: boolean) {
    this.testEnergy = testEnergy;
    this.testIsCasting = testIsCasting;
  }

  getEnergy(): number {
    return this.testEnergy;
  }

  isCasting(): boolean {
    return this.testIsCasting;
  }

  useModule(_num: number): void {}

  getVehicleModuleUsageOptions(): VehicleModuleUsageOptions {
    return {
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      isPlayerTeam: true,
      rotation: 0,
      VehicleID: 0,
    };
  }

  doActions(moduleAction: ModuleAction[]): void {
    XenoLog.unit.debug("Doing actions", moduleAction);
  }
}
