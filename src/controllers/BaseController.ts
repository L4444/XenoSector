import type Ship from "../entities/Ship";
import type GameScene from "../scenes/GameScene";
import type ShipControlInput from "../types/ShipControlInput";

export default abstract class BaseController {
  protected scene!: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
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
