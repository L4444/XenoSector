import BaseEntity from "../entities/BaseEntity";
import type { RenderDepth } from "../types/RenderDepth";

export default class XenoCreator {
  scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  private setupGameObject(obj: any, isUI: boolean, renderDepth: RenderDepth) {
    if (isUI) {
      obj.setScrollFactor(0);
    }
    obj.setDepth(renderDepth);
  }

  private convertStringColourToTint(stringColour: string): number {
    let convertedToTint: string = stringColour.split("#")[1];
    return Number.parseInt(convertedToTint, 16);
  }

  createBasicImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    isUI: boolean = false,
  ): Phaser.GameObjects.Image {
    let obj: Phaser.GameObjects.Image = this.scene.add.image(x, y, textureKey);

    obj.tint = this.convertStringColourToTint(colour);
    this.setupGameObject(obj, isUI, renderDepth);
    return obj;
  }

  createMatterImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    isUI: boolean = false,
  ): Phaser.Physics.Matter.Image {
    let obj: Phaser.Physics.Matter.Image = this.scene.matter.add.image(
      x,
      y,
      textureKey,
    );
    obj.tint = this.convertStringColourToTint(colour);
    this.setupGameObject(obj, isUI, renderDepth);
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
    isUI: boolean = false,
  ): Phaser.GameObjects.Rectangle {
    let obj: Phaser.GameObjects.Rectangle = this.scene.add.rectangle(
      x, // x
      y, // y
      width, // width
      height, // height
      fillColour, // rgb colour
      fillAlpha,
    );
    this.setupGameObject(obj, isUI, renderDepth);
    return obj;
  }

  createText(
    x: number,
    y: number,
    text: string,
    renderDepth: RenderDepth,
    colour: string = "#FFFFFF",
    isUI: boolean = false,
  ): Phaser.GameObjects.Text {
    let obj: Phaser.GameObjects.Text = this.scene.add.text(x, y, text, {
      color: colour,
    });

    this.setupGameObject(obj, isUI, renderDepth);
    return obj;
  }

  createGraphic(
    x: number,
    y: number,
    renderDepth: RenderDepth,
    isUI: boolean = false,
  ): Phaser.GameObjects.Graphics {
    let obj: Phaser.GameObjects.Graphics = this.scene.add.graphics();
    if (isUI) {
      obj.setScrollFactor(0);
    }
    obj.x = x;
    obj.y = y;
    obj.setDepth(renderDepth);
    return obj;
  }

  createParticleEmitter(
    x: number,
    y: number,
    textureKey: string,
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
    renderDepth: RenderDepth,
    isUI: boolean = false,
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    let obj: Phaser.GameObjects.Particles.ParticleEmitter =
      this.scene.add.particles(x, y, textureKey, config);
    this.setupGameObject(obj, isUI, renderDepth);
    return obj;
  }

  setupPostUpdate(postUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("postupdate", postUpdate, baseEntity);
  }

  setupPreUpdate(preUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("preupdate", preUpdate, baseEntity);
  }
}
