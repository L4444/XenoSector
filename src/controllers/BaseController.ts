import type Ship from "../entities/Ship";
import type XenoGame from "../XenoGame";

export default abstract class BaseController {
  protected xenoGame!: XenoGame;
  constructor(xenoGame: XenoGame) {
    this.xenoGame = xenoGame;
  }

  controlShip(_ship: Ship): number {
    throw new Error("Why are you calling the base control ship??");
    return 0;
  }
}
