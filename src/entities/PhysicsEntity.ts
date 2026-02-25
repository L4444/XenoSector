import type GameScene from "../scenes/GameScene";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import PositionalEntity from "./PositionalEntity";

export default abstract class PhysicsEntity extends PositionalEntity {
  public readonly physicsEntityType!: PhysicsEntityType;
  public readonly physicsEntityName!: string;
  protected image!: Phaser.Physics.Matter.Image;
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    physicsEntityName: string,
    physicsEntityType: PhysicsEntityType,
    texture: string,
    isCircle: boolean,
  ) {
    super(scene);
    this.physicsEntityType = physicsEntityType;
    this.physicsEntityName = physicsEntityName;
    this.image = scene.matter.add.image(x, y, texture);
    this.image.setData("entity", this);

    if (physicsEntityType == PhysicsEntityType.STATIC) {
      this.image.setStatic(true);
    }

    if (isCircle) {
      this.image.setCircle(this.image.width / 2);
    }

    //this.setCollisionCategory(1);
  }

  get x(): number {
    return this.image.x;
  }

  get y(): number {
    return this.image.y;
  }
}
