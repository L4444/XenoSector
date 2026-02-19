import type Projectile from "../objects/Projectile";
import type Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import type StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";
import { EntityType } from "../types/EntityType";

export default class CollisionManager {
  constructor(scene: GameScene) {
    console.log("Collision manager Created");

    scene.matter.world.on(
      "collisionstart",
      function (
        event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        _bodyA: MatterJS.BodyType,
        _bodyB: MatterJS.BodyType,
      ) {
        event.pairs.forEach((pair) => {
          let objA: BasePhysicsObject = pair.bodyA
            .gameObject as BasePhysicsObject;
          let objB: BasePhysicsObject = pair.bodyB
            .gameObject as BasePhysicsObject;

          // Projectile handling code, projectile will always be on the "left side" of this check because
          // Projectiles are created earlier than ships in create()
          if (
            objA.entityType == EntityType.PROJECTILE &&
            objB.entityType == EntityType.SHIP
          ) {
            let bullet: Projectile = objA as Projectile;
            let hitShip: Ship = objB as Ship;
            console.log("Projectile hit ship " + bullet.damage);

            console.log("Ship " + hitShip.shipID + " has been hit");
            hitShip.shield.hit();
            hitShip.hp.reduceBy(bullet.damage);

            // TODO: Disable if energy weapon against shields?
            bullet.disable();
          }

          // Handling projectiles hitting walls/asteroids etc. (e.g. statics)
          if (
            objA.entityType == EntityType.STATIC &&
            objB.entityType == EntityType.PROJECTILE
          ) {
            let hitStatic: StaticPhysicsObject = objA as StaticPhysicsObject;
            let bullet: Projectile = objB as Projectile;

            console.log(hitStatic.physicsObjectName + " has been hit");

            // TODO: Trigger particles or something when hit

            bullet.disable();
          }

          console.log(
            "\'" +
              objA.physicsObjectName +
              "\':" +
              objA.entityType +
              " collided with \'" +
              objB.physicsObjectName +
              "\':" +
              objB.entityType,
          );
        });
      },
    );
  }
}
