import { XenoLog } from "../helpers/XenoLogger";
import type PhysicsEntity from "../entities/PhysicsEntity";
import Vehicle from "../entities/Vehicle";

import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type Projectile from "../entities/Projectile";

export default abstract class CollisionManager {
  static setupCollisions(scene: Phaser.Scene) {
    XenoLog.coll.info("Setting up collisions");

    scene.matter.world.on(
      "collisionstart",
      function (event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
        event.pairs.forEach((pair) => {
          checkPairs(pair);
        });
      },
    );

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
      if (checkCollision(objA,objB,PhysicsEntityType.Vehicle,PhysicsEntityType.STATIC,handleVehicleStatic,)) return;

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.Vehicle,PhysicsEntityType.Vehicle,handleVehicleVehicle)) return;

      // prettier-ignore
      if (checkCollision(objA,objB,PhysicsEntityType.Vehicle,PhysicsEntityType.PROJECTILE,handleVehicleProjectile,)) return;

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

    function handleVehicleStatic(
      Vehicle: PhysicsEntity,
      staticObj: PhysicsEntity,
    ) {
      logCollision("Vehicle", "Static", Vehicle, staticObj);
    }

    function handleVehicleVehicle(
      Vehicle1: PhysicsEntity,
      Vehicle2: PhysicsEntity,
    ) {
      logCollision("Vehicle1", "Vehicle2", Vehicle1, Vehicle2);
    }

    function handleVehicleProjectile(
      Vehicle: PhysicsEntity,
      projectile: PhysicsEntity,
    ) {
      let VehicleHit: Vehicle = Vehicle as Vehicle;
      let projectileHit: Projectile = projectile as Projectile;

      logCollision("Vehicle", "Projectile", VehicleHit, projectileHit);

      // Check if friendly fire, it should do no damage but "eat" the projectile, wasting the shot
      if (projectileHit.getIsPlayerTeam() != VehicleHit.getIsPlayerTeam()) {
        VehicleHit.takeDamage(projectileHit.getDamage());
      }

      projectileHit.deactivate();
    }

    function handleProjectileStatic(
      projectile: PhysicsEntity,
      staticObj: PhysicsEntity,
    ) {
      let projectileHit: Projectile = projectile as Projectile;

      logCollision("Projectile", "Static", projectileHit, staticObj);
      projectileHit.deactivate();
    }

    function logCollision(
      type1: string,
      type2: string,
      value1: PhysicsEntity,
      value2: PhysicsEntity,
    ) {
      XenoLog.coll.debug(
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
