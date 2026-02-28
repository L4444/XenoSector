import BaseEntity from "../entities/BaseEntity";

export default class XenoCreator {
  scene!: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  createBasicImage(
    x: number,
    y: number,
    textureKey: string,
  ): Phaser.GameObjects.Image {
    return this.scene.add.image(x, y, textureKey);
  }

  createMatterImage(
    x: number,
    y: number,
    textureKey: string,
  ): Phaser.Physics.Matter.Image {
    return this.scene.matter.add.image(x, y, textureKey);
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

  createText(x: number, y: number, text: string): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, text);
  }

  createGraphic(): Phaser.GameObjects.Graphics {
    return this.scene.add.graphics();
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
