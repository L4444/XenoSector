import type Ship from "../entities/Ship";
import type ShipControlInput from "../types/ShipControlInput";
import type XenoGame from "../XenoGame";

export default abstract class BaseController {
  protected xenoGame!: XenoGame;

  constructor(xenoGame: XenoGame) {
    this.xenoGame = xenoGame;
  }

  getShipInput(ship: Ship): ShipControlInput {
    let sci: ShipControlInput = {
      shipTargetRotation: ship.rotation,
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
    return this.onControl(sci, ship);
  }

  abstract onControl(sci: ShipControlInput, ship: Ship): ShipControlInput;
}
