export default interface IGameScene {
  onCollisionStart(
    colStart: (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => void,
  ): void;
}
