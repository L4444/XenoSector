import BaseEntity from "../entities/BaseEntity";
import type { RenderDepth } from "../types/RenderDepth";
import { RenderSpace } from "../types/RenderSpace";

export default class XenoCreator {
  scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private setupGameObject(
    obj: any,
    renderSpace: RenderSpace,
    renderDepth: RenderDepth,
  ) {
    if (renderSpace == RenderSpace.SCREEN) {
      obj.setScrollFactor(0);
    }

    if (renderSpace == RenderSpace.PARALLAX) {
      obj.setScrollFactor(0.5);
    }
    // The default scroll factor of an object is 1, but I will set it to 1 again for completeness sake.
    if (renderSpace == RenderSpace.WORLD) {
      obj.setScrollFactor(1);
    }
    obj.setDepth(renderDepth);
  }

  convertStringColourToTint(stringColour: string): number {
    let convertedToTint: string = stringColour.split("#")[1];
    return Number.parseInt(convertedToTint, 16);
  }

  createBasicImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.GameObjects.Image {
    let obj: Phaser.GameObjects.Image = this.scene.add.image(x, y, textureKey);

    obj.tint = this.convertStringColourToTint(colour);
    this.setupGameObject(obj, renderSpace, renderDepth);
    return obj;
  }

  createMatterImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.Physics.Matter.Image {
    let obj: Phaser.Physics.Matter.Image = this.scene.matter.add.image(
      x,
      y,
      textureKey,
    );
    obj.tint = this.convertStringColourToTint(colour);
    this.setupGameObject(obj, renderSpace, renderDepth);
    return obj;
  }

  createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColour: number,
    fillAlpha: number,
    renderDepth: RenderDepth,
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.GameObjects.Rectangle {
    let obj: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(
      x, // x
      y, // y
      width, // width
      height, // height
      fillColour, // rgb colour
      fillAlpha,
    );
    this.setupGameObject(obj, renderSpace, renderDepth);
    return obj;
  }

  createText(
    x: number,
    y: number,
    text: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.GameObjects.Text {
    let obj: Phaser.GameObjects.Text = this.scene.add.text(x, y, text, {
      color: colour,
    });

    this.setupGameObject(obj, renderSpace, renderDepth);
    return obj;
  }

  createGraphic(
    x: number,
    y: number,
    renderDepth: RenderDepth,
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.GameObjects.Graphics {
    let obj: Phaser.GameObjects.Graphics = this.scene.add.graphics();
    this.setupGameObject(obj, renderSpace, renderDepth);
    obj.x = x;
    obj.y = y;
    return obj;
  }

  createParticleEmitter(
    x: number,
    y: number,
    textureKey: string,
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
    renderDepth: RenderDepth,
    renderSpace: RenderSpace = RenderSpace.WORLD,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    let obj: Phaser.GameObjects.Particles.ParticleEmitter =
      this.scene.add.particles(x, y, textureKey, config);
    this.setupGameObject(obj, renderSpace, renderDepth);
    return obj;
  }

  setupPostUpdate(postUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("postupdate", postUpdate, baseEntity);
  }

  setupPreUpdate(preUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("preupdate", preUpdate, baseEntity);
  }
}
