import SystemEffect from "./SystemEffect";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import type ProjectileManager from "../managers/ProjectileManager";

export default class FooEffect extends SystemEffect {
  constructor() {
    super("Foo effect", 0);
  }

  public onActivate(
    _shipSystemUsageOptions: ShipSystemUsageOptions,
    _projectileManager: ProjectileManager,
  ): void {
    console.log("Foo");
  }
}
