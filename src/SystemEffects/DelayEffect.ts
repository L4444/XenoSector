import type Ship from "../entities/Ship";
import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default class DelayEffect extends SystemEffect {
  private tickCount: number = 0;
  constructor() {
    super();
  }

  public onInit(self: Ship): void {
    console.log("Delaying for " + self.physicsEntityName);
    this.tickCount = 0;
  }

  public onTick(_shipSystemUsageOptions: ShipSystemUsageOptions): boolean {
    this.tickCount++;

    return this.tickCount > 60;
  }
}
