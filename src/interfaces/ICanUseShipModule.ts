import type ModuleAction from "../actions/ModuleAction";
import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";

export default interface ICanUseShipModule {
  getEnergy(): number;
  isCasting(): boolean;
  useModule(num: number): void;
  getShipModuleUsageOptions(): ShipModuleUsageOptions;
  doActions(moduleAction: ModuleAction[]): void;
}
