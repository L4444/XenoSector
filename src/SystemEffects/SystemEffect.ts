import type Ship from "../entities/Ship";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default abstract class SystemEffect {
  constructor() {}

  public abstract onInit(self: Ship): void;

  // Return true if done, and false if not done.
  public abstract onTick(
    shipSystemUsageOptions: ShipSystemUsageOptions,
  ): boolean;
}
