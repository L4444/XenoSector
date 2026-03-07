import type Vehicle from "../entities/Vehicle";
import type XenoInput from "../helpers/XenoInput";

import type VehicleControlInput from "../types/VehicleControlInput";

export default abstract class BaseController {
  protected xenoInput!: XenoInput;

  constructor(xenoInput: XenoInput) {
    this.xenoInput = xenoInput;
  }

  getVehicleInput(vehicle: Vehicle): VehicleControlInput {
    let vci: VehicleControlInput = {
      vehicleTargetRotation: vehicle.rotation,
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
    return this.onControl(vci, vehicle);
  }

  abstract onControl(
    vci: VehicleControlInput,
    vehicle: Vehicle,
  ): VehicleControlInput;
}
