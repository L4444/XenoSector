import type ICanUseShipSystem from "../interfaces/ICanUseShipSystem";
import type ShipSystemUsageOptions from "../types/ShipSystemUsageOptions";

export default class TestShip implements ICanUseShipSystem {
  private testEnergy: number = 0;
  private testIsCasting: boolean = false;

  setParameters(testEnergy: number, testIsCasting: boolean) {
    this.testEnergy = testEnergy;
    this.testIsCasting = testIsCasting;
  }

  getEnergy(): number {
    return this.testEnergy;
  }

  isCasting(): boolean {
    return this.testIsCasting;
  }

  useSystem(_num: number): void {
    console.log("DO NOTHING");
  }

  getShipSystemUsageOptions(): ShipSystemUsageOptions {
    return {
      x: 0,
      y: 0,
      velocityX: 0,
      velocityY: 0,
      isPlayerTeam: true,
      rotation: 0,
      shipID: 0,
    };
  }
}
