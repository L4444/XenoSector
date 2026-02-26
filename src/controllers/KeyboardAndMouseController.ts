import BaseController from "./BaseController";
import type Ship from "../entities/Ship";
import type XenoGame from "../XenoGame";

export default class KeyboardAndMouseController extends BaseController {
  constructor(xenoGame: XenoGame) {
    super(xenoGame);

    if (xenoGame.getKeyboard() == null) {
      throw new Error("No keyboard detected!");
    }
  }
  controlShip(ship: Ship): number {
    let keyboardInput = this.xenoGame.getKeyboard();

    let ko = keyboardInput?.addKeys("W,S,A,D,F,G") as Keys;

    if (ko.W.isDown) {
      ship.forward();
    }
    if (ko.S.isDown) {
      ship.backward();
    }

    if (this.xenoGame.getMouse().leftButtonDown()) {
      ship.useSystem(0);
    }

    if (this.xenoGame.getMouse().rightButtonDown()) {
      ship.useSystem(1);
    }

    if (ko.F.isDown) {
      ship.useSystem(2);
    }

    if (ko.A.isDown) {
      ship.left();
    }
    if (ko.D.isDown) {
      ship.right();
    }

    let activePointer = this.xenoGame.getMouse();

    activePointer.updateWorldPoint(this.xenoGame.getMainCamera());
    let targetRotation = Phaser.Math.Angle.Between(
      ship.x,
      ship.y,
      activePointer.worldX,
      activePointer.worldY,
    );

    return targetRotation;
  }
}

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  F: Phaser.Input.Keyboard.Key;
  G: Phaser.Input.Keyboard.Key;
}
