import BaseController from "./BaseController";

import { KeyboardControlStyle } from "../types/GameSettings";
import type VehicleControlInput from "../types/VehicleControlInput";

import type Vehicle from "../entities/Vehicle";

import type XenoInput from "../helpers/XenoInput";

export default class KeyboardAndMouseController extends BaseController {
  constructor(xenoInput: XenoInput) {
    super(xenoInput);

    if (this.xenoInput.getKeyboard() == null) {
      throw new Error("No keyboard detected!");
    }
  }
  onControl(vci: VehicleControlInput, vehicle: Vehicle): VehicleControlInput {
    let keyboardInput = this.xenoInput.getKeyboard();

    let ko = keyboardInput?.addKeys("W,S,A,D,F,G,SPACE,E") as Keys;

    let controlStyle: KeyboardControlStyle =
      this.xenoInput.getKeyboardControlStyle();

    if (controlStyle == KeyboardControlStyle.ABSOLUTE) {
      if (ko.W.isDown) {
        vci.thrust.north = true;
      }
      if (ko.S.isDown) {
        vci.thrust.south = true;
      }

      if (ko.A.isDown) {
        vci.thrust.west = true;
      }
      if (ko.D.isDown) {
        vci.thrust.east = true;
      }
    }

    if (controlStyle == KeyboardControlStyle.RELATIVE) {
      if (ko.W.isDown) {
        vci.thrust.forward = true;
      }
      if (ko.S.isDown) {
        vci.thrust.back = true;
      }

      if (ko.A.isDown) {
        vci.thrust.left = true;
      }
      if (ko.D.isDown) {
        vci.thrust.right = true;
      }
    }

    if (controlStyle == KeyboardControlStyle.TANKCONTROLS) {
      if (ko.W.isDown) {
        vci.thrust.forward = true;
      }
      if (ko.S.isDown) {
        vci.thrust.back = true;
      }

      if (ko.A.isDown) {
        vci.vehicleTargetRotation = vehicle.rotation - 0.1;
      }
      if (ko.D.isDown) {
        vci.vehicleTargetRotation = vehicle.rotation + 0.1;
      }
    }

    if (ko.SPACE.isDown) {
      vci.brake = true;
    }

    let activePointer = this.xenoInput.getMouse();

    if (activePointer.leftButtonDown()) {
      vci.modules[0] = true;
    }

    if (activePointer.rightButtonDown()) {
      vci.modules[1] = true;
    }

    if (ko.F.isDown) {
      vci.modules[2] = true;
    }

    if (ko.SPACE.isDown) {
      vci.modules[4] = true;
    }

    activePointer.updateWorldPoint(this.xenoInput.getMainCamera());

    vci.turretTargetRotation = Phaser.Math.Angle.Between(
      vehicle.x,
      vehicle.y,
      activePointer.worldX,
      activePointer.worldY,
    );

    if (controlStyle != KeyboardControlStyle.TANKCONTROLS) {
      vci.vehicleTargetRotation = Phaser.Math.Angle.Between(
        vehicle.x,
        vehicle.y,
        activePointer.worldX,
        activePointer.worldY,
      );
    }
    return vci;
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
  E: Phaser.Input.Keyboard.Key;
}
