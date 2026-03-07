import BaseController from "./BaseController";
import type Vehicle from "../entities/Vehicle";

import type VehicleControlInput from "../types/VehicleControlInput";

import type XenoInput from "../helpers/XenoInput";

export default class AIController extends BaseController {
  private targetVehicle!: Vehicle;
  constructor(xenoInput: XenoInput, targetVehicle: Vehicle) {
    super(xenoInput);
    this.targetVehicle = targetVehicle;
  }
  onControl(vci: VehicleControlInput, vehicle: Vehicle): VehicleControlInput {
    // AI uses absolute

    if (this.xenoInput.getEnemyAutoFire()) {
      if (vehicle.getEnergy() >= vehicle.getModule(3).getEnergyCost()) {
        vehicle.useModule(3);
      }

      if (this.targetVehicle.x < vehicle.x) {
        vci.thrust.west = true;
      }

      if (this.targetVehicle.x > vehicle.x) {
        vci.thrust.east = true;
      }

      if (this.targetVehicle.y < vehicle.y) {
        vci.thrust.north = true;
      }

      if (this.targetVehicle.y > vehicle.y) {
        vci.thrust.south = true;
      }

      vci.turretTargetRotation = Phaser.Math.Angle.Between(
        vehicle.x,
        vehicle.y,
        this.targetVehicle.x,
        this.targetVehicle.y,
      );

      vci.vehicleTargetRotation = Phaser.Math.Angle.Between(
        vehicle.x,
        vehicle.y,
        this.targetVehicle.x,
        this.targetVehicle.y,
      );
    }

    return vci;
  }
}
