/***
 *  This is purely for encapsulation
 */

export default interface ICollisionSetup {
  onCollisionStart(
    colStart: (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => void,
  ): void;
}
