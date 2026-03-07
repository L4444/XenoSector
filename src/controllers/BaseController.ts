import type Vehicle from "../entities/Vehicle";
import type XenoInput from "../helpers/XenoInput";

import type VehicleControlInput from "../types/VehicleControlInput";

export default abstract class BaseController {
  protected xenoInput!: XenoInput;

  constructor(xenoInput: XenoInput) {
    this.xenoInput = xenoInput;
  }

  getVehicleInput(Vehicle: Vehicle): VehicleControlInput {
    let sci: VehicleControlInput = {
      VehicleTargetRotation: Vehicle.rotation,
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
      modules: [false, false, false, false],
      brake: false,
    };
    return this.onControl(sci, Vehicle);
  }

  abstract onControl(
    sci: VehicleControlInput,
    Vehicle: Vehicle,
  ): VehicleControlInput;
}
