import BaseController from "./BaseController";
import type Ship from "../entities/Ship";

import type ShipControlInput from "../types/ShipControlInput";

import type XenoInput from "../helpers/XenoInput";

export default class AIController extends BaseController {
  private targetShip!: Ship;
  constructor(xenoInput: XenoInput, targetShip: Ship) {
    super(xenoInput);
    this.targetShip = targetShip;
  }
  onControl(sci: ShipControlInput, ship: Ship): ShipControlInput {
    // AI uses absolute

    if (this.xenoInput.getEnemyAutoFire()) {
      if (ship.getCurrentEnergy() >= ship.getSystem(3).getEnergyCost()) {
        ship.useSystem(3);
      }

      if (this.targetShip.x < ship.x) {
        sci.thrust.west = true;
      }

      if (this.targetShip.x > ship.x) {
        sci.thrust.east = true;
      }

      if (this.targetShip.y < ship.x) {
        sci.thrust.north = true;
      }

      if (this.targetShip.y > ship.y) {
        sci.thrust.south = true;
      }

      sci.turretTargetRotation = Phaser.Math.Angle.Between(
        ship.x,
        ship.y,
        this.targetShip.x,
        this.targetShip.y,
      );

      sci.shipTargetRotation = Phaser.Math.Angle.Between(
        ship.x,
        ship.y,
        this.targetShip.x,
        this.targetShip.y,
      );
    }

    return sci;
  }
}
