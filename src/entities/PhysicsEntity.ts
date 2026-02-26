import type EntityCreationOptions from "../types/EntityCreationOptions";
import { PhysicsEntityType } from "../types/PhysicsEntityType";
import type XenoGame from "../XenoGame";
import PositionalEntity from "./PositionalEntity";

export default abstract class PhysicsEntity extends PositionalEntity {
  public readonly physicsEntityType!: PhysicsEntityType;
  public readonly physicsEntityName!: string;
  protected image!: Phaser.Physics.Matter.Image;
  constructor(
    xenoGame: XenoGame,
    entityCreationOptions: EntityCreationOptions,
    physicsEntityName: string,
    physicsEntityType: PhysicsEntityType,
    isCircle: boolean,
  ) {
    super(xenoGame);
    this.physicsEntityType = physicsEntityType;
    this.physicsEntityName = physicsEntityName;

    //this.image = scene.matter.add.image(x, y, texture);
    this.image = xenoGame.createMatterImage(entityCreationOptions);
    this.image.setData("entity", this);

    // Set circle first because setCircle() resets the setStatic() flag
    if (isCircle) {
      this.image.setCircle(this.image.width / 2, {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
      });
    }

    // For static objects, we need to be static.
    if (physicsEntityType == PhysicsEntityType.STATIC) {
      this.image.setStatic(true);
    }

    this.image.setCollisionCategory(1);
  }

  get x(): number {
    return this.image.x;
  }

  get y(): number {
    return this.image.y;
  }
}
