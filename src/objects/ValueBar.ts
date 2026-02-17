import type Ship from "./Ship";

export default class ValueBar {
  barBack!: Phaser.GameObjects.Rectangle;
  barFront!: Phaser.GameObjects.Rectangle;
  parentShip!: Ship;
  offset!: number;
  currentValue: number = -99;
  maxValue: number = -99;
  passiveRegen: number = 0;
  constructor(
    scene: Phaser.Scene,
    parentShip: Ship,
    offset: number,
    colour: number,
    startingValue: number,
    maxValue: number,
    passiveRegen: number = 0,
  ) {
    this.barBack = scene.add.rectangle(
      0, // x
      0, // y
      parentShip.displayWidth, // width
      10, // height
      0x000000, // rgb colour
      1,
    );

    this.barFront = scene.add.rectangle(
      0, // x
      0, // y
      parentShip.displayWidth, // width
      5, // height
      colour, // rgb colour
      1,
    );

    this.parentShip = parentShip;
    this.offset = offset;

    this.currentValue = startingValue;
    this.maxValue = maxValue;
    this.passiveRegen = passiveRegen;

    // Post update, the preUpdate() function calls BEFORE physics update so if I sync
    // the other elements (e.g. shield/thruster) they will lag slightly behind.
    scene.events.on("postupdate", this.postUpdate, this);
  }

  reduce(value: number) {
    this.currentValue -= value;
  }

  postUpdate() {
    this.currentValue += this.passiveRegen;
    // Cap currentValue, it should never be negative
    if (this.currentValue < 0) {
      this.currentValue = 0;
    }

    // It should also never be greater than the max value
    if (this.currentValue > this.maxValue) {
      this.currentValue = this.maxValue;
    }

    // TODO: Maybe replace this with math.clamp()?

    // This ValueBar should follow the parent ship while displaying the value
    this.barBack.x = this.parentShip.x;
    this.barBack.y =
      this.parentShip.y + this.offset - this.parentShip.displayHeight / 2;

    this.barFront.x =
      this.parentShip.x +
      ((this.currentValue / this.maxValue) * this.parentShip.displayWidth) / 2 -
      this.parentShip.displayWidth / 2;

    this.barFront.y = this.barBack.y;
    this.barFront.displayWidth =
      (this.currentValue / this.maxValue) * this.parentShip.displayWidth;
  }
}
