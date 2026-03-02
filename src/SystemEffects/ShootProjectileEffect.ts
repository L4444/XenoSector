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
  private shipSystemUsageOptions!: ShipSystemUsageOptions;
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

  public onApply(
    self: Ship,
    shipSystemUsageOptions: ShipSystemUsageOptions,
  ): void {
    this.shipSystemUsageOptions = shipSystemUsageOptions;
    this.shootProjectile();
    this.currentSpray = this.maxSpray;
  }

  public onTick() {
    if (this.currentSpray > 0) {
      this.ticksPassed++;
      console.log("Ticks passed: ", this.ticksPassed);
      if (this.ticksPassed > 2) {
        this.currentSpray--;
        this.shootProjectile();
        this.ticksPassed = 0;
      }
    }
  }

  private shootProjectile() {
    console.log("Fire projectile!", this.projectileData);

    this.projectileManager.shoot(
      this.shipSystemUsageOptions,
      this.projectileData,
    );
  }
}
