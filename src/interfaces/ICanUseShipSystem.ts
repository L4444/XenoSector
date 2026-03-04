import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default interface ICanUseShipSystem {
  getEnergy(): number;
  isCasting(): boolean;
  useSystem(num: number): void;
  getShipSystemUsageOptions(): ShipSystemUsageOptions;
}
