import BaseEntity from "../entities/BaseEntity";
import type { RenderDepth } from "../types/RenderDepth";

export default class XenoCreator {
  scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createBasicImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    isUI: boolean = false,
  ): Phaser.GameObjects.Image {
    let obj: Phaser.GameObjects.Image = this.scene.add.image(x, y, textureKey);
    if (isUI) {
      obj.setScrollFactor(0);
    }
    obj.setDepth(renderDepth);
    return obj;
  }

  createMatterImage(
    x: number,
    y: number,
    textureKey: string,
    renderDepth: RenderDepth,
    isUI: boolean = false,
  ): Phaser.Physics.Matter.Image {
    let obj: Phaser.Physics.Matter.Image = this.scene.matter.add.image(
      x,
      y,
      textureKey,
    );
    if (isUI) {
      obj.setScrollFactor(0);
    }
    obj.setDepth(renderDepth);
    return obj;
  }

  createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    fillColour: number,
    fillAlpha: number,
  ): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(
      x, // x
      y, // y
      width, // width
      height, // height
      fillColour, // rgb colour
      fillAlpha,
    );
  }

  createText(
    x: number,
    y: number,
    text: string,
    renderDepth: RenderDepth,
    isUI: boolean = false,
  ): Phaser.GameObjects.Text {
    let obj: Phaser.GameObjects.Text = this.scene.add.text(x, y, text);
    if (isUI) {
      obj.setScrollFactor(0);
    }
    obj.setDepth(renderDepth);
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
  ): Phaser.GameObjects.Particles.ParticleEmitter {
    return this.scene.add.particles(x, y, textureKey, config);
  }

  setupPostUpdate(postUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("postupdate", postUpdate, baseEntity);
  }

  setupPreUpdate(preUpdate: () => void, baseEntity: BaseEntity): void {
    this.scene.events.on("preupdate", preUpdate, baseEntity);
  }
}
