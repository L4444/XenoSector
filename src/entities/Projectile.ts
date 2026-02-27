import type ProjectileData from "../types/ProjectileData";

import { XenoLog } from "../helpers/XenoLogger";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type XenoGame from "../XenoGame";
import type UseShipSystemData from "../types/UseShipSystemData";

export default class Projectile extends PhysicsEntity {
  private currentLifetime: number = 0;
  private totalLifetime: number = 0;
  private damage!: number;
  private toRemove: boolean = false;
  private isPlayerTeam!: boolean;

  constructor(xenoGame: XenoGame, projectileName: string) {
    // Do not set the mass to 0
    super(
      xenoGame,
      0,
      0,
      "red",
      projectileName,
      PhysicsEntityType.PROJECTILE,
      true,
    );

    // For clean looking collision detection, projectile hitbox should be very small
    // FIX
    //this.image.setCircle(30);

    // Only collide with non-projectiles
    this.image.setCollisionCategory(2);
    this.image.setCollidesWith(1);

    // Start disabled, ready to fire
    this.disable();
  }
  // time: number, delta: number
  preUpdate() {
    // Only update "active" (visible) projectiles
    if (this.image.visible) {
      this.currentLifetime--;

      // The fading code I pulled out of copilot.
      // These values "look the best". Don't touch for now.
      const fadeStart = 0.3; // fade during last 10% of life
      const t = this.currentLifetime / this.totalLifetime; // goes 1 → 0

      if (t > fadeStart) {
        // Not in fade window yet → stay fully visible
        this.image.alpha = 1;
      } else {
        // Normalize t inside the fade window (1 → 0)
        const x = t / fadeStart;

        // Exponential fade
        this.image.alpha = Math.exp((x - 1) * 2);
      }

      if (this.currentLifetime <= 0) {
        this.disable();
      }
    }
  }

  postUpdate() {
    if (this.toRemove) {
      XenoLog.proj.debug("Removed");
      this.image.setVisible(false);
      this.image.setCollidesWith(0);
      this.image.setVelocity(0);
      this.image.setAngularVelocity(0);
      this.image.setAngle(0);
      this.toRemove = false;
    }
  }

  getDamage(): number {
    return this.damage;
  }

  disable() {
    this.toRemove = true;
  }

  enable() {
    this.image.setVisible(true);
    this.image.setCollidesWith(1);
  }

  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  fire(shipSystemUseData: UseShipSystemData, projectileData: ProjectileData) {
    this.image.x = shipSystemUseData.x;
    this.image.y = shipSystemUseData.y;
    this.enable();
    this.isPlayerTeam = shipSystemUseData.isPlayerTeam;

    this.image.setTexture(projectileData.textureName);

    // To prevent projectiles from colliding with the ship that is firing them
    // Set this after adjusting the physics body via setCircle() because that function resets the collision group
    this.image.setCollisionGroup(-shipSystemUseData.shipID);

    // The lifetime should be determined by the "range", faster projectiles have less lifetime
    // Multiply by 50 to get the rough distance
    this.totalLifetime = (projectileData.range / projectileData.speed) * 50;
    this.currentLifetime = this.totalLifetime;
    this.damage = projectileData.damage;

    // If a projectile has no mass then use it only for collision detection
    // and not for "physics" e.g. knocking ships around
    if (projectileData.mass == 0) {
      this.image.setSensor(true);
    } else {
      this.image.setSensor(false);
      this.image.setMass(projectileData.mass);
    }

    // Use vectors to set the path of the projectile, use the X axis to align with the player ship.
    let v = new Phaser.Math.Vector2(projectileData.speed, 0);

    v.rotate(shipSystemUseData.rotation);

    this.image.setVelocity(
      v.x + shipSystemUseData.velocityX,
      v.y + shipSystemUseData.velocityY,
    );

    this.image.rotation = shipSystemUseData.rotation;

    XenoLog.proj.debug(
      "\'" + projectileData.textureName + "\' fired",
      projectileData,
    );
  }
}
