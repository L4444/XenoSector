import type BasePhysicsObject from "../physics/BasePhysicsObject";

export default class CollisionManager {
  constructor(scene: Phaser.Scene) {
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

          objA.onHit();
          objB.onHit();

          console.log(objA.objID + " collided with " + objB.objID);
        });
      },
    );
  }
}
