import BaseEntity from "../entities/BaseEntity";
import type Ship from "../entities/Ship";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default abstract class SystemEffect {
  constructor() {}

  public abstract onApply(
    self: Ship,
    shipSystemUsageOptions: ShipSystemUsageOptions,
  ): void;

  public abstract onTick(): void;
}
