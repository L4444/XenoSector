export default interface ShipControlInput {
  shipTargetRotation: number;
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
  systems: boolean[];
}
