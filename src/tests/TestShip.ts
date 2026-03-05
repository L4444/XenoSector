import ModuleAction from "../actions/ModuleAction";
import { XenoLog } from "../helpers/XenoLogger";
import type ICanUseShipModule from "../interfaces/ICanUseShipModule";
import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";

export default class TestShip implements ICanUseShipModule {
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

  getShipModuleUsageOptions(): ShipModuleUsageOptions {
    return {
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      isPlayerTeam: true,
      rotation: 0,
      shipID: 0,
    };
  }

  doActions(moduleAction: ModuleAction[]): void {
    XenoLog.unit.debug("Doing actions", moduleAction);
  }
}
