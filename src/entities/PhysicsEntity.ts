import type XenoCreator from "../helpers/XenoCreator";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import PositionalEntity from "./PositionalEntity";
import { XenoLog } from "../helpers/XenoLogger";
import { RenderDepth } from "../types/RenderDepth";

export default abstract class PhysicsEntity extends PositionalEntity {
  public readonly physicsEntityType!: PhysicsEntityType;
  public readonly physicsEntityName!: string;
  private toDeactivate: boolean = false;
  private image!: Phaser.Physics.Matter.Image;
  constructor(
    xenoCreator: XenoCreator,
    x: number,
    y: number,
    textureKey: string,
    physicsEntityName: string,
    physicsEntityType: PhysicsEntityType,
    isCircle: boolean,
    mass: number,
  ) {
    super(xenoCreator);
    this.physicsEntityType = physicsEntityType;
    this.physicsEntityName = physicsEntityName;

    //this.image = scene.matter.add.image(x, y, texture);
    this.image = xenoCreator.createMatterImage(
      x,
      y,
      textureKey,
      RenderDepth.SHIPS,
    );
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
    // Static objects have infinite mass, so no need to set it
    if (physicsEntityType == PhysicsEntityType.STATIC) {
      this.image.setStatic(true);
    } else {
      this.image.setMass(mass);
    }

    // Disable angular momentum (Fixes issue #77), a weird bug that causes angular "drift"
    this.image.setFixedRotation();

    // Keep projectiles in a seperate category so they do not collide with each other.
    if (physicsEntityType != PhysicsEntityType.PROJECTILE) {
      // If I am not a projectile, collide with everything
      this.image.setCollisionCategory(1);
      this.image.setCollidesWith(3);
    } else {
      // If I am a projectile, do not collide with other projectiles
      this.image.setCollisionCategory(2);
      this.image.setCollidesWith(1);
    }

    // This should ensure no weird collision bugs
  }

  get x(): number {
    return this.image.x;
  }

  get y(): number {
    return this.image.y;
  }

  isActive(): boolean {
    return this.image.visible;
  }
  postUpdate() {
    if (this.toDeactivate) {
      XenoLog.proj.debug("Deactivated " + this.physicsEntityName);
      this.image.setVisible(false);
      this.image.setCollidesWith(0);
      this.image.setVelocity(0);
      this.image.setAngularVelocity(0);
      this.image.setAngle(0);
      this.toDeactivate = false;
    }
  }

  deactivate() {
    this.toDeactivate = true;
  }

  activate() {
    this.image.setVisible(true);
    this.image.setCollidesWith(1);
  }

  setCollisionGroup(value: number) {
    this.image.setCollisionGroup(value);
  }

  setPosition(x: number, y: number) {
    this.image.x = x;
    this.image.y = y;
  }

  setTexture(textureKey: string) {
    this.image.setTexture(textureKey);
  }

  setSensor(value: boolean) {
    this.image.setSensor(value);
  }

  setAlpha(value: number) {
    this.image.alpha = value;
  }

  setMass(value: number) {
    this.image.setMass(value);
  }

  set rotation(value: number) {
    this.image.rotation = value;
  }

  get displayWidth(): number {
    return this.image.displayWidth;
  }

  get displayHeight(): number {
    return this.image.displayHeight;
  }

  get rotation(): number {
    return this.image.rotation;
  }

  setVelocity(x: number, y: number) {
    this.image.setVelocity(x, y);
  }

  getVelocity(): Phaser.Types.Math.Vector2Like {
    return this.image.getVelocity();
  }

  applyForce(x: number, y: number) {
    this.image.applyForce(new Phaser.Math.Vector2(x, y));
  }

  thrustForward(speed: number) {
    this.image.thrust(speed);
  }

  thrustBack(speed: number) {
    this.image.thrustBack(speed);
  }

  thrustLeft(speed: number) {
    this.image.thrustLeft(speed);
  }

  thrustRight(speed: number) {
    this.image.thrustRight(speed);
  }

  setDimensions(width: number, height: number) {
    this.image.width = width;
    this.image.height = height;
    this.image.displayWidth = width;
    this.image.displayHeight = height;
  }

  setTint(tint: number) {
    this.image.tint = tint;
  }
}
