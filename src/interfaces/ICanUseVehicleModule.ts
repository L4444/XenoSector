import type ModuleAction from "../actions/ModuleAction";
import type VehicleModuleUsageOptions from "../types/VehicleModuleUsageOptions";

export default interface ICanUseVehicleModule {
  getEnergy(): number;
  isCasting(): boolean;
  useModule(num: number): void;
  getVehicleModuleUsageOptions(): VehicleModuleUsageOptions;
  doActions(moduleAction: ModuleAction[]): void;
}
