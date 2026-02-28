import type Ship from "../entities/Ship";
import type XenoInput from "../helpers/XenoInput";

import type ShipControlInput from "../types/ShipControlInput";

export default abstract class BaseController {
  protected xenoInput!: XenoInput;

  constructor(xenoInput: XenoInput) {
    this.xenoInput = xenoInput;
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
      brake: false,
    };
    return this.onControl(sci, ship);
  }

  abstract onControl(sci: ShipControlInput, ship: Ship): ShipControlInput;
}
