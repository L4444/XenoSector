import type ShipControlInput from "../types/ShipControlInput";
import type XenoGame from "../XenoGame";

export default abstract class BaseController {
  protected xenoGame!: XenoGame;

  constructor(xenoGame: XenoGame) {
    this.xenoGame = xenoGame;
  }

  getShipInput(
    shipX: number,
    shipY: number,
    shipRotation: number,
  ): ShipControlInput {
    let sci: ShipControlInput = {
      shipTargetRotation: shipRotation,
      turretTargetRotation: 0,
      thrust: {
        north: false,
        east: false,
        west: false,
        south: false,
        forward: false,
        back: false,
        left: false,
        right: false,
      },
      systems: [false, false, false, false],
    };
    return this.onControl(sci, shipX, shipY, shipRotation);
  }

  abstract onControl(
    sci: ShipControlInput,
    shipX: number,
    shipY: number,
    shipRotation: number,
  ): ShipControlInput;
}
