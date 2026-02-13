import type BasePhysicsObject from "../physics/BasePhysicsObject";

export default class CollisionManager {
  constructor(scene: Phaser.Scene) {
    console.log("Collision manager Created");

    scene.matter.world.on(
      "collisionstart",
      function (
        event: Phaser.Physics.Matter.Events.CollisionStartEvent,
        bodyA: MatterJS.BodyType,
        bodyB: MatterJS.BodyType,
      ) {
        let objA: BasePhysicsObject = bodyA.gameObject as BasePhysicsObject;
        let objB: BasePhysicsObject = bodyB.gameObject as BasePhysicsObject;

        console.log(objA.objID + " collided2 with " + objB.objID);
      },
    );
  }
}
