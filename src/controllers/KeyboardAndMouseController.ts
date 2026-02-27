import BaseController from "./BaseController";

import XenoGame from "../XenoGame";
import { KeyboardControlStyle } from "../types/GameSettings";
import type ShipControlInput from "../types/ShipControlInput";

import type Ship from "../entities/Ship";

export default class KeyboardAndMouseController extends BaseController {
  constructor(xenoGame: XenoGame) {
    super(xenoGame);

    if (xenoGame.getKeyboard() == null) {
      throw new Error("No keyboard detected!");
    }
  }
  onControl(sci: ShipControlInput, ship: Ship): ShipControlInput {
    let keyboardInput = this.xenoGame.getKeyboard();

    let ko = keyboardInput?.addKeys("W,S,A,D,F,G,SPACE") as Keys;

    let controlStyle: KeyboardControlStyle =
      this.xenoGame.getKeyboardControlStyle();

    if (controlStyle == KeyboardControlStyle.ABSOLUTE) {
      if (ko.W.isDown) {
        sci.thrust.north = true;
      }
      if (ko.S.isDown) {
        sci.thrust.south = true;
      }

      if (ko.A.isDown) {
        sci.thrust.west = true;
      }
      if (ko.D.isDown) {
        sci.thrust.east = true;
      }
    }

    if (controlStyle == KeyboardControlStyle.RELATIVE) {
      if (ko.W.isDown) {
        sci.thrust.forward = true;
      }
      if (ko.S.isDown) {
        sci.thrust.back = true;
      }

      if (ko.A.isDown) {
        sci.thrust.left = true;
      }
      if (ko.D.isDown) {
        sci.thrust.right = true;
      }
    }

    if (controlStyle == KeyboardControlStyle.TANKCONTROLS) {
      if (ko.W.isDown) {
        sci.thrust.forward = true;
      }
      if (ko.S.isDown) {
        sci.thrust.back = true;
      }

      if (ko.A.isDown) {
        sci.shipTargetRotation = ship.rotation - 0.1;
      }
      if (ko.D.isDown) {
        sci.shipTargetRotation = ship.rotation + 0.1;
      }
    }

    if (ko.SPACE.isDown) {
      sci.brake = true;
    }

    let activePointer = this.xenoGame.getMouse();

    if (activePointer.leftButtonDown()) {
      sci.systems[0] = true;
    }

    if (activePointer.rightButtonDown()) {
      sci.systems[1] = true;
    }

    if (ko.F.isDown) {
      sci.systems[2] = true;
    }

    activePointer.updateWorldPoint(this.xenoGame.getMainCamera());

    sci.turretTargetRotation = Phaser.Math.Angle.Between(
      ship.x,
      ship.y,
      activePointer.worldX,
      activePointer.worldY,
    );

    if (controlStyle != KeyboardControlStyle.TANKCONTROLS) {
      sci.shipTargetRotation = Phaser.Math.Angle.Between(
        ship.x,
        ship.y,
        activePointer.worldX,
        activePointer.worldY,
      );
    }
    return sci;
  }
}

interface Keys {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
  F: Phaser.Input.Keyboard.Key;
  G: Phaser.Input.Keyboard.Key;
  SPACE: Phaser.Input.Keyboard.Key;
}
