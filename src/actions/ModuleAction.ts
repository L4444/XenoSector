import type Ship from "../entities/Ship";
import type ProjectileManager from "../managers/ProjectileManager";

export default abstract class ModuleAction {
  private actionName!: string;
  private windDown!: number;
  constructor(actionName: string, windDownTime: number) {
    this.actionName = actionName;
    this.windDown = windDownTime;
  }

  public abstract onExecute(
    projectileManager: ProjectileManager,
    sourceShip: Ship,
    targetShip: Ship,
  ): void;

  // Return the number of ticks it will take to trigger this action
  public getWindDown(): number {
    return this.windDown;
  }

  public getName(): string {
    return this.actionName;
  }
}
