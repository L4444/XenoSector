import DynamicPhysicsObject from "../physics/DynamicPhysicsObject";
import type Ship from "./Ship";

export default class Projectile extends DynamicPhysicsObject {
  currentLifetime: number = 0;
  totalLifetime: number = 0;

  constructor(scene: Phaser.Scene) {
    // Do not set the mass to 0
    super(scene, 0, 0, "pew", true, 1);

    // Your mass is 1, but don't knock other ships around (for now)
    this.setSensor(true);

    // Start disabled, ready to fire
    this.disable();

    // The projectiles should be under the ship but over the background layer.
    //this.setDepth(SpriteLayer.PROJECTILES);
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
    this.setCollidesWith(0);
    this.setVelocity(0);
    this.setAngularVelocity(0);
    this.setAngle(0);
  }

  enable() {
    this.setCollidesWith(1);
  }

  fire(parent: Ship, projectileData: any) {
    this.enable();

    this.x = parent.x;
    this.y = parent.y;

    //this.setTexture(projectileData.spriteName);

    // The lifetime should be determined by the "range", faster projectiles have less lifetime
    // Multiply by 50 to get the rough distance
    this.totalLifetime = (projectileData.range / projectileData.speed) * 50;
    this.currentLifetime = this.totalLifetime;

    // Use vectors to set the path of the projectile, use the X axis to align with the player ship.
    let v = new Phaser.Math.Vector2(projectileData.speed, 0);
    v.rotate(parent.rotation);

    this.setVelocity(
      v.x + parent.getVelocity().x,
      v.y + parent.getVelocity().y,
    );

    //this.damage = projectileData.damageValue;
    //this.weapon = projectileData.weapon;

    this.rotation = parent.rotation;
    // Assign the projectile's "owner" so ships can't damage themselves
    //this.owner = parent;
  }
}
