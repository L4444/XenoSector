import type ProjectileData from "../types/ProjectileData";

import { XenoLog } from "../helpers/XenoLogger";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";
import type XenoCreator from "../helpers/XenoCreator";

export default class Projectile extends PhysicsEntity {
  private currentLifetime: number = 0;
  private totalLifetime: number = 0;
  private damage!: number;

  private isPlayerTeam!: boolean;

  constructor(xenoCreator: XenoCreator, projectileName: string) {
    // Do not set the mass to 0
    super(
      xenoCreator,
      0,
      0,
      "red",
      projectileName,
      PhysicsEntityType.PROJECTILE,
      true,
      1,
    );

    // Start disabled (deactivated), ready to fire
    this.deactivate();
  }
  // time: number, delta: number
  preUpdate() {
    // Only update "active" (visible) projectiles
    if (this.isActive()) {
      this.currentLifetime--;

      // The fading code I pulled out of copilot.
      // These values "look the best". Don't touch for now.
      const fadeStart = 0.3; // fade during last 10% of life
      const t = this.currentLifetime / this.totalLifetime; // goes 1 → 0

      if (t > fadeStart) {
        // Not in fade window yet → stay fully visible
        this.setAlpha(1);
      } else {
        // Normalize t inside the fade window (1 → 0)
        const x = t / fadeStart;

        // Exponential fade
        this.setAlpha(Math.exp((x - 1) * 2));
      }

      if (this.currentLifetime <= 0) {
        this.deactivate();
      }
    }
  }

  getDamage(): number {
    return this.damage;
  }

  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  fire(
    useShipSystemData: ShipSystemUsageOptions,
    projectileData: ProjectileData,
  ) {
    this.setPosition(useShipSystemData.x, useShipSystemData.y);

    this.activate();
    this.isPlayerTeam = useShipSystemData.isPlayerTeam;

    this.setTexture(projectileData.textureName);

    // To prevent projectiles from colliding with the ship that is firing them
    // Set this after adjusting the physics body via setCircle() because that function resets the collision group
    this.setCollisionGroup(-useShipSystemData.shipID);

    // The lifetime should be determined by the "range", faster projectiles have less lifetime
    // Multiply by 50 to get the rough distance
    this.totalLifetime = (projectileData.range / projectileData.speed) * 50;
    this.currentLifetime = this.totalLifetime;
    this.damage = projectileData.damage;

    // If a projectile has no mass then use it only for collision detection
    // and not for "physics" e.g. knocking ships around
    if (projectileData.mass == 0) {
      this.setSensor(true);
    } else {
      this.setSensor(false);
      this.setMass(projectileData.mass);
    }

    // Use vectors to set the path of the projectile, use the X axis to align with the player ship.
    let v = new Phaser.Math.Vector2(projectileData.speed, 0);

    v.rotate(useShipSystemData.rotation);

    this.setVelocity(
      v.x + useShipSystemData.velocityX,
      v.y + useShipSystemData.velocityY,
    );

    this.rotation = useShipSystemData.rotation;

    XenoLog.proj.debug(
      "\'" + projectileData.textureName + "\' fired",
      projectileData,
    );
  }
}
