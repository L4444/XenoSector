export default interface VehicleControlInput {
  vehicleTargetRotation: number;
  turretTargetRotation: number;
  thrust: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
    forward: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
  };
  modules: boolean[];
  brake: boolean;
}
