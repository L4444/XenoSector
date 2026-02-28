import type XenoCreator from "../helpers/XenoCreator";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import PositionalEntity from "./PositionalEntity";

export default abstract class PhysicsEntity extends PositionalEntity {
  public readonly physicsEntityType!: PhysicsEntityType;
  public readonly physicsEntityName!: string;
  protected image!: Phaser.Physics.Matter.Image;
  constructor(
    xenoCreator: XenoCreator,
    x: number,
    y: number,
    textureKey: string,
    physicsEntityName: string,
    physicsEntityType: PhysicsEntityType,
    isCircle: boolean,
  ) {
    super(xenoCreator);
    this.physicsEntityType = physicsEntityType;
    this.physicsEntityName = physicsEntityName;

    //this.image = scene.matter.add.image(x, y, texture);
    this.image = xenoCreator.createMatterImage(x, y, textureKey);
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

    // Disable angular momentum (Fixes issue #77), a weird bug that causes angular "drift"
    this.image.setFixedRotation();

    this.image.setCollisionCategory(1);
  }

  get x(): number {
    return this.image.x;
  }

  get y(): number {
    return this.image.y;
  }
}
