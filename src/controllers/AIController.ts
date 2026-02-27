import BaseController from "./BaseController";
import type Ship from "../entities/Ship";
import type XenoGame from "../XenoGame";
import type ShipControlInput from "../types/ShipControlInput";

export default class AIController extends BaseController {
  private targetShip!: Ship;
  constructor(xenoGame: XenoGame, targetShip: Ship) {
    super(xenoGame);
    this.targetShip = targetShip;
  }
  onControl(sci: ShipControlInput): ShipControlInput {
    /*
    if (this.xenoGame.getEnemyAutoFire()) {
      if (ship.getCurrentEnergy() >= ship.getSystem(3).getEnergyCost()) {
        //ship.useSystem(3);
      }
    }

    if (this.targetShip.x < ship.x) {
      //ship.forward();
    }

    if (this.targetShip.y > ship.y) {
      //ship.backward();
    }

    if (this.targetShip.x < ship.x) {
      //ship.left();
    }

    if (this.targetShip.x > ship.x) {
      //ship.right();
    }

    sci.targetRotation = Phaser.Math.Angle.Between(
      ship.x,
      ship.y,
      this.targetShip.x,
      this.targetShip.y,
    );
*/
    return sci;
  }
}
