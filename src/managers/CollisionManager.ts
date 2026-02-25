import BasePhysicsObject from "../physics/BasePhysicsObject";

import type GameScene from "../scenes/GameScene";
import { XenoLog } from "../helpers/XenoLogger";
import type PhysicsEntity from "../entities/PhysicsEntity";
import Ship from "../entities/Ship";
import Wall from "../entities/Wall";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

type Ctor<T> = new (...args: any[]) => T;

export default class CollisionManager {
  constructor(scene: GameScene) {
    XenoLog.coll.info("Collision Manager created");

    scene.matter.world.on(
      "collisionstart",
      function (
        event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        _bodyA: MatterJS.BodyType,
        _bodyB: MatterJS.BodyType,
      ) {
        event.pairs.forEach((pair) => {
          let objA: PhysicsEntity = pair.bodyA.gameObject?.getData(
            "entity",
          ) as PhysicsEntity;

          let objB: PhysicsEntity = pair.bodyB.gameObject?.getData(
            "entity",
          ) as PhysicsEntity;

          //XenoLog.coll.error(objA.physicsEntityType);
          console.log(objA, objB);

          if (
            checkTypes(
              objA,
              objB,
              PhysicsEntityType.SHIP,
              PhysicsEntityType.STATIC,
            )
          ) {
            console.log("Ship-Wall collision detected - John");
          }

          /*
          const shipProjectileCollision = matchPair(
            objA,
            objB,
            Ship,
            Projectile,
          );
          if (shipProjectileCollision) {
            const [shipHit, projectileHit] = shipProjectileCollision;
            XenoLog.coll.debug(
              "Ship-Projectile Collision\tShip: '" +
                shipHit.physicsObjectName +
                "'\tProjectile: '" +
                projectileHit.physicsObjectName +
                "'",
            );

            // Check if friendly fire, it should do no damage but "eat" the projectile, wasting the shot
            if (projectileHit.getIsPlayerTeam() != shipHit.getIsPlayerTeam()) {
              shipHit.hurt(projectileHit.getDamage());

              XenoLog.coll.debug(
                "Dealing damage to\tShip: '" +
                  shipHit.physicsObjectName +
                  "'\tProjectile: '" +
                  projectileHit.physicsObjectName +
                  "'",
              );
            }

            // TODO: Disable if energy weapon against shields?
            projectileHit.disable();
            return;
          }

          // Handling projectiles hitting walls/asteroids etc. (e.g. statics)
          const staticProjectileCollision = matchPair(
            objA,
            objB,
            StaticPhysicsObject,
            Projectile,
          );
          if (staticProjectileCollision) {
            const [staticHit, projectileHit] = staticProjectileCollision;

            XenoLog.coll.debug(
              "Static-Projectile Collision\tShip: '" +
                staticHit.physicsObjectName +
                "'\tProjectile: '" +
                projectileHit.physicsObjectName +
                "'",
            );

            // TODO: Trigger particles or something when hit
            projectileHit.disable();
            return;
          }

          XenoLog.coll.warn(
            "Unhandled Collision\tObjA: '" +
              objA.physicsObjectName +
              "'\tObjB: '" +
              objB.physicsObjectName +
              "'",
          );
          */
        });
      },
    );

    // Yes, ChatGPT generated 99% of this function
    // What it does is take two objects and check if they are the two types you are looking for
    // (Regardless of their order)
    function matchPair<T1, T2>(
      a: PhysicsEntity,
      b: PhysicsEntity,
      Type1: Ctor<T1>,
      Type2: Ctor<T2>,
    ): [T1, T2] | null {
      if (a instanceof Type1 && b instanceof Type2) {
        return [a, b];
      }

      if (a instanceof Type2 && b instanceof Type1) {
        return [b, a];
      }

      return null;
    }

    function checkTypes(
      a: PhysicsEntity,
      b: PhysicsEntity,
      leftCheck: PhysicsEntityType,
      rightCheck: PhysicsEntityType,
    ): [PhysicsEntity, PhysicsEntity] | null {
      if (
        a.physicsEntityType == leftCheck &&
        b.physicsEntityType == rightCheck
      ) {
        return [a, b];
      }

      if (
        b.physicsEntityType == leftCheck &&
        a.physicsEntityType == rightCheck
      ) {
        return [b, a];
      }
      return null;
    }
  }
}
