import BaseController from "./BaseController";
import type GameScene from "../scenes/GameScene";
import type Ship from "../objects/Ship";

export default class AIController extends BaseController {
  private targetShip!: Ship;
  constructor(scene: GameScene, targetShip: Ship) {
    super(scene);
    this.targetShip = targetShip;
  }
  controlShip(ship: Ship): number {
    if (ship.energy.getCurrentValue() >= ship.getSystem(3).getEnergyCost()) {
      ship.useSystem(3);
    }

    ship.forward();

    let targetRotation = Phaser.Math.Angle.Between(
      ship.x,
      ship.y,
      this.targetShip.x,
      this.targetShip.y,
    );

    return targetRotation;
  }
}
