import type Ship from "../entities/Ship";
import type ProjectileManager from "../managers/ProjectileManager";
import type ProjectileData from "../types/ProjectileData";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import SystemEffect from "./SystemEffect";

export default class ShootProjectileEffect extends SystemEffect {
  private projectileManager!: ProjectileManager;
  private projectileData!: ProjectileData;
  private maxSpray!: number;
  private currentSpray!: number;
  private ticksPassed: number = -1;

  constructor(
    projectileManager: ProjectileManager,
    projectileData: ProjectileData,
    maxSpray: number,
  ) {
    super();
    this.projectileManager = projectileManager;
    this.projectileData = projectileData;
    this.maxSpray = maxSpray;
  }

  public onInit(self: Ship): void {
    this.currentSpray = this.maxSpray;
    console.log("Shooting");
  }

  public onTick(shipSystemUsageOptions: ShipSystemUsageOptions) {
    if (this.currentSpray > 0) {
      this.ticksPassed++;

      if (this.ticksPassed > 1) {
        this.currentSpray--;
        this.shootProjectile(shipSystemUsageOptions);
        this.ticksPassed = 0;
      }
      return false;
    }
    return true;
  }

  private shootProjectile(shipSystemUsageOptions: ShipSystemUsageOptions) {
    console.log("Fire projectile!", this.projectileData);
    console.log(shipSystemUsageOptions);

    this.projectileManager.shoot(shipSystemUsageOptions, this.projectileData);
  }
}
