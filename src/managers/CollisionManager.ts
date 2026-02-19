import Projectile from "../objects/Projectile";
import Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import StaticPhysicsObject from "../physics/StaticPhysicsObject";
import type GameScene from "../scenes/GameScene";

type Ctor<T> = new (...args: any[]) => T;

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

          const shipProjectileCollision = matchPair(
            objA,
            objB,
            Ship,
            Projectile,
          );
          if (shipProjectileCollision) {
            const [shipHit, projectileHit] = shipProjectileCollision;
            console.log(
              "Ship " +
                shipHit.physicsObjectName +
                " is hit by projectile " +
                projectileHit.physicsObjectName,
            );
            shipHit.shield.hit();
            shipHit.hp.reduceBy(projectileHit.damage);

            // TODO: Disable if energy weapon against shields?
            projectileHit.disable();
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

            console.log(staticHit.physicsObjectName + " has been hit");

            // TODO: Trigger particles or something when hit

            projectileHit.disable();
          }

          console.log(
            "\'" +
              objA.physicsObjectName +
              "\':" +
              objA.constructor.name +
              " collided with \'" +
              objB.physicsObjectName +
              "\':" +
              objB.constructor.name,
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
