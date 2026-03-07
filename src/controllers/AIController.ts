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
  onControl(sci: VehicleControlInput, Vehicle: Vehicle): VehicleControlInput {
    // AI uses absolute

    if (this.xenoInput.getEnemyAutoFire()) {
      if (Vehicle.getEnergy() >= Vehicle.getModule(3).getEnergyCost()) {
        Vehicle.useModule(3);
      }

      if (this.targetVehicle.x < Vehicle.x) {
        sci.thrust.west = true;
      }

      if (this.targetVehicle.x > Vehicle.x) {
        sci.thrust.east = true;
      }

      if (this.targetVehicle.y < Vehicle.y) {
        sci.thrust.north = true;
      }

      if (this.targetVehicle.y > Vehicle.y) {
        sci.thrust.south = true;
      }

      sci.turretTargetRotation = Phaser.Math.Angle.Between(
        Vehicle.x,
        Vehicle.y,
        this.targetVehicle.x,
        this.targetVehicle.y,
      );

      sci.VehicleTargetRotation = Phaser.Math.Angle.Between(
        Vehicle.x,
        Vehicle.y,
        this.targetVehicle.x,
        this.targetVehicle.y,
      );
    }

    return sci;
  }
}
