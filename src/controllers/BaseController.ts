import type GameScene from "../scenes/GameScene";
import type Ship from "../entities/Ship";

export default abstract class BaseController {
  protected scene!: GameScene;
  constructor(scene: GameScene) {
    this.scene = scene;
  }

  controlShip(_ship: Ship): number {
    throw new Error("Why are you calling the base control ship??");
    return 0;
  }
}
