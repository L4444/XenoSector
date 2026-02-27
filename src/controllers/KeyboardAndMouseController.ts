import BaseController from "./BaseController";
import type Ship from "../entities/Ship";
import type XenoGame from "../XenoGame";
import { KeyboardControlStyle } from "../types/GameSettings";

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

    let targetRotation = ship.rotation;
    let controlStyle: KeyboardControlStyle =
      this.xenoGame.getKeyboardControlStyle();
    if (controlStyle == KeyboardControlStyle.ABSOLUTE) {
      if (ko.W.isDown) {
        ship.thrustNorth();
      }
      if (ko.S.isDown) {
        ship.thrustSouth();
      }

      if (ko.A.isDown) {
        ship.thrustWest();
      }
      if (ko.D.isDown) {
        ship.thrustEast();
      }
    }

    if (controlStyle == KeyboardControlStyle.RELATIVE) {
      if (ko.W.isDown) {
        ship.thrustForward();
      }
      if (ko.S.isDown) {
        ship.thrustBackward();
      }

      if (ko.A.isDown) {
        ship.thrustLeft();
      }
      if (ko.D.isDown) {
        ship.thrustRight();
      }
    }

    if (controlStyle == KeyboardControlStyle.TANKCONTROLS) {
      if (ko.W.isDown) {
        ship.thrustForward();
      }
      if (ko.S.isDown) {
        ship.thrustBackward();
      }

      if (ko.A.isDown) {
        targetRotation = ship.rotation - 0.1;
      }
      if (ko.D.isDown) {
        targetRotation = ship.rotation + 0.1;
      }
    }

    if (this.xenoGame.getMouse().leftButtonDown()) {
      ship.useSystem(0, controlStyle != KeyboardControlStyle.TANKCONTROLS);
    }

    if (this.xenoGame.getMouse().rightButtonDown()) {
      ship.useSystem(1, controlStyle != KeyboardControlStyle.TANKCONTROLS);
    }

    if (ko.F.isDown) {
      ship.useSystem(2, controlStyle != KeyboardControlStyle.TANKCONTROLS);
    }

    if (
      this.xenoGame.getKeyboardControlStyle() !=
      KeyboardControlStyle.TANKCONTROLS
    ) {
      let activePointer = this.xenoGame.getMouse();

      activePointer.updateWorldPoint(this.xenoGame.getMainCamera());
      targetRotation = Phaser.Math.Angle.Between(
        ship.x,
        ship.y,
        activePointer.worldX,
        activePointer.worldY,
      );
    }

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
