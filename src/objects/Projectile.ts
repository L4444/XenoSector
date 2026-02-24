import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import type ProjectileData from "../types/ProjectileData";
import type Ship from "./Ship";
import type GameScene from "../scenes/GameScene";
import { pmLogger } from "../helpers/XenoLogger";

export default class Projectile extends DynamicPhysicsObject {
  private currentLifetime: number = 0;
  private totalLifetime: number = 0;
  private damage!: number;
  private toRemove: boolean = false;
  private isPlayerTeam!: boolean;

  constructor(scene: GameScene, projectileName: string) {
    // Do not set the mass to 0
    super(scene, projectileName, 0, 0, "pew", true, 1, 0);

    // For clean looking collision detection, projectile hitbox should be very small
    this.setCircle(1);

    // Do not collide with other bullets
    //this.setCollisionGroup(-1);
    this.setCollisionCategory(2);
    this.setCollidesWith(1);

    // Start disabled, ready to fire
    this.disable();

    // Use fo
    scene.events.on("postupdate", this.postUpdate, this);
  }
  // time: number, delta: number
  preUpdate() {
    // Only update "active" (visible) projectiles
    if (this.visible) {
      this.currentLifetime--;

      // The fading code I pulled out of copilot.
      // These values "look the best". Don't touch for now.
      const fadeStart = 0.3; // fade during last 10% of life
      const t = this.currentLifetime / this.totalLifetime; // goes 1 → 0

      if (t > fadeStart) {
        // Not in fade window yet → stay fully visible
        this.alpha = 1;
      } else {
        // Normalize t inside the fade window (1 → 0)
        const x = t / fadeStart;

        // Exponential fade
        this.alpha = Math.exp((x - 1) * 2);
      }

      if (this.currentLifetime <= 0) {
        this.disable();
      }
    }
  }

  postUpdate() {
    if (this.toRemove) {
      pmLogger.debug("Removed");
      this.setVisible(false);
      this.setCollidesWith(0);
      this.setVelocity(0);
      this.setAngularVelocity(0);
      this.setAngle(0);
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
    this.setVisible(true);
    this.setCollidesWith(1);
  }

  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  fire(parent: Ship, projectileData: ProjectileData) {
    this.x = parent.x;
    this.y = parent.y;
    this.enable();
    this.isPlayerTeam = parent.getIsPlayerTeam();

    this.setTexture(projectileData.textureName);

    // To prevent projectiles from colliding with the ship that is firing them
    // Set this after adjusting the physics body via setCircle() because that function resets the collision group
    this.setCollisionGroup(-parent.getShipID());

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
    v.rotate(parent.rotation);

    this.setVelocity(
      v.x + parent.getVelocity().x,
      v.y + parent.getVelocity().y,
    );

    this.rotation = parent.rotation;

    pmLogger.debug(
      "\'" + projectileData.textureName + "\' fired",
      projectileData,
    );
  }
}
