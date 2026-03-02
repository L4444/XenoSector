import type Ship from "../entities/Ship";
import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default class FooEffect extends SystemEffect {
  constructor() {
    super();
  }

  public onApply(
    self: Ship,
    shipSystemUsageOptions: ShipSystemUsageOptions,
  ): void {
    console.log("Foo");
  }

  public onTick(): void {}
}
