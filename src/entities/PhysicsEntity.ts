import type GameScene from "../scenes/GameScene";
import PositionalEntity from "./PositionalEntity";

export default abstract class PhysicsEntity extends PositionalEntity {
  private physicsObjectName!: string;

  constructor(
    scene: GameScene,
    physicsObjectID: string,
    x: number,
    y: number,
    textureName: string,
    isCircle: boolean,
  ) {
    super(scene);

    /*
    if (isCircle) {
      this.setCircle(this.width / 2);
    }
*/
    //this.setCollisionCategory(1);

    this.physicsObjectName = physicsObjectID;
  }
}
