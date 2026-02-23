import Projectile from "../objects/Projectile";
import Ship from "../objects/Ship";
import BasePhysicsObject from "../physics/BasePhysicsObject";
import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";
import { cmLogger } from "../helpers/XenoLogger";

type Ctor<T> = new (...args: any[]) => T;

export default class CollisionManager {
  constructor(scene: GameScene) {
    cmLogger.info("Collision Manager created");

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

          const shipProjectileCollision = matchPair(
            objA,
            objB,
            Ship,
            Projectile,
          );
          if (shipProjectileCollision) {
            const [shipHit, projectileHit] = shipProjectileCollision;
            cmLogger.debug(
              "Ship-Projectile Collision\tShip: '" +
                shipHit.physicsObjectName +
                "'\tProjectile: '" +
                projectileHit.physicsObjectName +
                "'",
            );

            // Check if friendly fire, it should do no damage but "eat" the projectile, wasting the shot
            if (projectileHit.getIsPlayerTeam() != shipHit.getIsPlayerTeam()) {
              shipHit.shield.hit();
              shipHit.hp.reduceBy(projectileHit.getDamage());

              cmLogger.debug(
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

            cmLogger.debug(
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

          cmLogger.warn(
            "Unhandled Collision\tObjA: '" +
              objA.physicsObjectName +
              "'\tObjB: '" +
              objB.physicsObjectName +
              "'",
          );
        });
      },
    );

    // Yes, ChatGPT generated 99% of this function
    // What it does is take two objects and check if they are the two types you are looking for
    // (Regardless of their order)
    function matchPair<T1, T2>(
      a: BasePhysicsObject,
      b: BasePhysicsObject,
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
  }
}
