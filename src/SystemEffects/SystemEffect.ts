import type ProjectileManager from "../managers/ProjectileManager";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default abstract class SystemEffect {
  private effectName!: string;
  private windDown!: number;
  constructor(effectName: string, windDownTime: number) {
    this.effectName = effectName;
    this.windDown = windDownTime;
  }

  public abstract onActivate(
    shipSystemUsageOptions: ShipSystemUsageOptions,
    projectileManager: ProjectileManager,
  ): void;

  // Return the number of ticks it will take to activate this effect
  public getWindDown(): number {
    return this.windDown;
  }

  public getName(): string {
    return this.effectName;
  }
}
