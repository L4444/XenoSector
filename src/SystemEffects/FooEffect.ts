import type Ship from "../entities/Ship";
import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default class FooEffect extends SystemEffect {
  constructor() {
    super();
  }

  public onInit(self: Ship): void {
    console.log("Foo");
  }

  public onTick(shipSystemUsageOptions: ShipSystemUsageOptions): boolean {
    return true;
  }
}
