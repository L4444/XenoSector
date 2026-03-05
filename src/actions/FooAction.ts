import ModuleAction from "./ModuleAction";
import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";
import type ProjectileManager from "../managers/ProjectileManager";
import { XenoLog } from "../helpers/XenoLogger";

export default class FooAction extends ModuleAction {
  constructor() {
    super("Foo", 0);
  }

  public onExecute(
    _ShipModuleUsageOptions: ShipModuleUsageOptions,
    _projectileManager: ProjectileManager,
  ): void {
    XenoLog.mode.debug("Foo action triggered");
  }
}
