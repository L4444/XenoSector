import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import { EntityType } from "../types/EntityType";
import type ProjectileData from "../types/ProjectileData";
import type Ship from "./Ship";

export default class Projectile extends DynamicPhysicsObject {
  currentLifetime: number = 0;
  totalLifetime: number = 0;
  weaponFiredFrom!: any;
  damage!: number;

  constructor(scene: Phaser.Scene, projectileName: string) {
    // Do not set the mass to 0
    super(
      scene,
      projectileName,
      0,
      0,
      "pew",
      true,
      1,
      0,
      EntityType.PROJECTILE,
    );

    // Your mass is 1, but don't knock other ships around (for now)
    //this.setSensor(true);

    // For clean looking collision detection, projectile hitbox should be very small
    this.setCircle(1);

    // Do not collide with other bullets
    //this.setCollisionGroup(-1);
    this.setCollisionCategory(2);
    this.setCollidesWith(1);

    // Start disabled, ready to fire
    this.disable();
  }
  // time: number, delta: number
  preUpdate() {
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

  disable() {
    this.setVisible(false);
    this.setCollidesWith(0);
    this.setVelocity(0);
    this.setAngularVelocity(0);
    this.setAngle(0);
  }

  enable() {
    this.setVisible(true);
    this.setCollidesWith(1);
  }

  fire(parent: Ship, projectileData: ProjectileData) {
    this.x = parent.x;
    this.y = parent.y;
    this.enable();

    console.log("\'" + projectileData.textureName + "\' fired");
    this.setTexture(projectileData.textureName);

    // To prevent projectiles from colliding with the ship that is firing them
    // Set this after adjusting the physics body via setCircle() because that function resets the collision group
    this.setCollisionGroup(-parent.shipID);

    // The lifetime should be determined by the "range", faster projectiles have less lifetime
    // Multiply by 50 to get the rough distance
    this.totalLifetime = (projectileData.range / projectileData.speed) * 50;
    this.currentLifetime = this.totalLifetime;
    this.damage = projectileData.damage;
    this.setMass(projectileData.mass);

    // Use vectors to set the path of the projectile, use the X axis to align with the player ship.
    let v = new Phaser.Math.Vector2(projectileData.speed, 0);
    v.rotate(parent.rotation);

    this.setVelocity(
      v.x + parent.getVelocity().x,
      v.y + parent.getVelocity().y,
    );

    this.rotation = parent.rotation;
  }
}
