import type GameScene from "../scenes/GameScene";
import { XenoLog } from "../helpers/XenoLogger";
import type PhysicsEntity from "../entities/PhysicsEntity";
import Ship from "../entities/Ship";

import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type Projectile from "../entities/Projectile";

export default class CollisionManager {
  constructor(scene: GameScene) {
    XenoLog.coll.debug("Collision Manager created");

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

          XenoLog.coll.debug(
            "Collision Detected\tObjA: '" +
              objA.physicsEntityName +
              "'\tObjB: '" +
              objB.physicsEntityName +
              "'",
          );

          checkCollision(
            objA,
            objB,
            PhysicsEntityType.SHIP,
            PhysicsEntityType.STATIC,
            handleShipStatic,
          );

          checkCollision(
            objA,
            objB,
            PhysicsEntityType.SHIP,
            PhysicsEntityType.SHIP,
            handleShipShip,
          );

          checkCollision(
            objA,
            objB,
            PhysicsEntityType.SHIP,
            PhysicsEntityType.PROJECTILE,
            handleShipProjectile,
          );

          checkCollision(
            objA,
            objB,
            PhysicsEntityType.PROJECTILE,
            PhysicsEntityType.STATIC,
            handleProjectileStatic,
          );
        });
      },
    );

    function checkCollision(
      a: PhysicsEntity,
      b: PhysicsEntity,
      leftCheck: PhysicsEntityType,
      rightCheck: PhysicsEntityType,
      callback: (a: PhysicsEntity, b: PhysicsEntity) => void,
    ) {
      if (
        a.physicsEntityType == leftCheck &&
        b.physicsEntityType == rightCheck
      ) {
        callback(a, b);
        return;
      }

      if (
        b.physicsEntityType == leftCheck &&
        a.physicsEntityType == rightCheck
      ) {
        callback(b, a);
        return;
      }
    }

    function handleShipStatic(ship: PhysicsEntity, staticObj: PhysicsEntity) {
      console.log("Ship - Static");
    }

    function handleShipShip(ship1: PhysicsEntity, ship2: PhysicsEntity) {
      console.log("Ship - Ship");
    }

    function handleShipProjectile(
      ship: PhysicsEntity,
      projectile: PhysicsEntity,
    ) {
      let shipHit: Ship = ship as Ship;
      let projectileHit: Projectile = projectile as Projectile;

      XenoLog.coll.debug(
        "Ship-Projectile Collision\tShip: '" +
          shipHit.physicsEntityName +
          "'\tProjectile: '" +
          projectileHit.physicsEntityName +
          "'",
      );

      // Check if friendly fire, it should do no damage but "eat" the projectile, wasting the shot
      if (projectileHit.getIsPlayerTeam() != shipHit.getIsPlayerTeam()) {
        shipHit.takeDamage(projectileHit.getDamage());

        XenoLog.coll.debug(
          "Dealing damage to\tShip: '" +
            shipHit.physicsEntityName +
            "'\tProjectile: '" +
            projectileHit.physicsEntityName +
            "'",
        );
      }

      // TODO: Disable if energy weapon against shields?
      projectileHit.disable();
    }

    function handleProjectileStatic(
      projectile: PhysicsEntity,
      staticObj: PhysicsEntity,
    ) {
      let projectileHit: Projectile = projectile as Projectile;

      XenoLog.coll.debug(
        "Static-Projectile Collision\tShip: '" +
          staticObj.physicsEntityName +
          "'\tProjectile: '" +
          projectileHit.physicsEntityName +
          "'",
      );
      projectileHit.disable();
    }
  }
}
