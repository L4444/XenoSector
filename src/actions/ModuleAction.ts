import type ProjectileManager from "../managers/ProjectileManager";
import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";

export default abstract class ModuleAction {
  private actionName!: string;
  private windDown!: number;
  constructor(actionName: string, windDownTime: number) {
    this.actionName = actionName;
    this.windDown = windDownTime;
  }

  public abstract onExecute(
    ShipModuleUsageOptions: ShipModuleUsageOptions,
    projectileManager: ProjectileManager,
  ): void;

  // Return the number of ticks it will take to trigger this action
  public getWindDown(): number {
    return this.windDown;
  }

  public getName(): string {
    return this.actionName;
  }
}
