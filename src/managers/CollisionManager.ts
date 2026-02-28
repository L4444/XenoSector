import { XenoLog } from "../helpers/XenoLogger";
import type PhysicsEntity from "../entities/PhysicsEntity";
import Ship from "../entities/Ship";

import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type Projectile from "../entities/Projectile";

import type GameScene from "../scenes/GameScene";

export default class CollisionManager {
  constructor(xenoCreator: GameScene) {
    XenoLog.coll.debug("Collision Manager created");

    xenoCreator.onCollisionStart(function (
      event: Phaser.Physics.Matter.Events.CollisionStartEvent,
    ) {
      event.pairs.forEach((pair) => {
        checkPairs(pair);
      });
    });

    function checkCollision(
      a: PhysicsEntity,
      b: PhysicsEntity,
      leftCheck: PhysicsEntityType,
      rightCheck: PhysicsEntityType,
      callback: (a: PhysicsEntity, b: PhysicsEntity) => void,
    ): boolean {
      if (
        a.physicsEntityType == leftCheck &&
        b.physicsEntityType == rightCheck
      ) {
        callback(a, b);
        return true;
      }

      if (
        b.physicsEntityType == leftCheck &&
        a.physicsEntityType == rightCheck
      ) {
        callback(b, a);
        return true;
      }

      return false;
    }

    function checkPairs(pair: Phaser.Types.Physics.Matter.MatterCollisionPair) {
      let objA: PhysicsEntity = pair.bodyA.gameObject?.getData(
        "entity",
      ) as PhysicsEntity;

      let objB: PhysicsEntity = pair.bodyB.gameObject?.getData(
        "entity",
      ) as PhysicsEntity;

      // Prettier needs to ignore these lines or it will format them in an ugly way.

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.SHIP,PhysicsEntityType.STATIC,handleShipStatic,)) return;

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.SHIP,PhysicsEntityType.SHIP,handleShipShip)) return;

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.SHIP,PhysicsEntityType.PROJECTILE,handleShipProjectile,)) return;

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.PROJECTILE,PhysicsEntityType.STATIC,handleProjectileStatic,)) return;

      // If the collision combination is unhandled, post an error here
      XenoLog.coll.error(
        "Unhandled Collision! \t \'" +
          objA.physicsEntityName +
          "\':" +
          objA.physicsEntityType +
          " and \'" +
          objB.physicsEntityName +
          "\':" +
          objB.physicsEntityType,
      );
    }

    function handleShipStatic(ship: PhysicsEntity, staticObj: PhysicsEntity) {
      logCollision("Ship", "Static", ship, staticObj);
    }

    function handleShipShip(ship1: PhysicsEntity, ship2: PhysicsEntity) {
      logCollision("Ship1", "Ship2", ship1, ship2);
    }

    function handleShipProjectile(
      ship: PhysicsEntity,
      projectile: PhysicsEntity,
    ) {
      let shipHit: Ship = ship as Ship;
      let projectileHit: Projectile = projectile as Projectile;

      logCollision("Ship", "Projectile", shipHit, projectileHit);

      // Check if friendly fire, it should do no damage but "eat" the projectile, wasting the shot
      if (projectileHit.getIsPlayerTeam() != shipHit.getIsPlayerTeam()) {
        shipHit.takeDamage(projectileHit.getDamage());
      }

      // TODO: Disable if energy weapon against shields?
      projectileHit.disable();
    }

    function handleProjectileStatic(
      projectile: PhysicsEntity,
      staticObj: PhysicsEntity,
    ) {
      let projectileHit: Projectile = projectile as Projectile;

      logCollision("Projectile", "Static", projectileHit, staticObj);
      projectileHit.disable();
    }

    function logCollision(
      type1: string,
      type2: string,
      value1: PhysicsEntity,
      value2: PhysicsEntity,
    ) {
      XenoLog.coll.info(
        " Collision Detected\t" +
          type1 +
          ": \'" +
          value1.physicsEntityName +
          "\'\t" +
          type2 +
          ": \'" +
          value2.physicsEntityName +
          "'",
      );
    }
  }
}
