import ModuleAction from "./actions/ModuleAction";
import type Ship from "./entities/Ship";
import Timer from "./helpers/Timer";

import { XenoLog } from "./helpers/XenoLogger";
import type ProjectileManager from "./managers/ProjectileManager";

export default class ModuleActionExecutor {
  private parentShip!: Ship;
  private projectileManager!: ProjectileManager;
  private moduleActionQueue: Array<ModuleAction> = new Array<ModuleAction>();
  private moduleTimer!: Timer;
  private actionTimer!: Timer;
  private isActionStarted: boolean = false;

  constructor(parentShip: Ship, projectileManager: ProjectileManager) {
    this.parentShip = parentShip;
    this.projectileManager = projectileManager;

    this.actionTimer = new Timer();
    this.moduleTimer = new Timer();
  }

  executeActions(moduleActions: ModuleAction[]) {
    XenoLog.mode.debug(
      "ModuleActionExecutor: Adding actions to queue ",
      moduleActions,
    );

    let totalExecutionTime = 0;
    for (let i = 0; i < moduleActions.length; i++) {
      totalExecutionTime += moduleActions[i].getWindDown();
      this.moduleActionQueue.push(moduleActions[i]);
    }

    this.moduleTimer.start(totalExecutionTime);
  }

  isActive(): boolean {
    return this.moduleActionQueue.length > 0;
  }

  getRemainingRatio(): number {
    return this.moduleTimer.getRemainingRatio();
  }

  update() {
    this.actionTimer.update();
    this.moduleTimer.update();
    if (this.moduleActionQueue.length > 0) {
      let currentAction = this.moduleActionQueue[0];

      if (!this.isActionStarted) {
        XenoLog.mode.debug(
          "ModuleActionExecutor is about to execute action \'" +
            currentAction.getName() +
            "\'",
        );

        // EXECUTE the action
        currentAction.onExecute(
          this.parentShip.getShipModuleUsageOptions(),
          this.projectileManager,
        );

        // Set the timer to wind down
        XenoLog.mode.debug(
          " Setting the timer to the action\'s windDown of " +
            currentAction.getWindDown() +
            " ticks",
        );
        this.actionTimer.start(currentAction.getWindDown());

        this.isActionStarted = true;
      }

      // shift
      if (!this.actionTimer.isActive()) {
        this.moduleActionQueue.shift();
        this.isActionStarted = false;
        XenoLog.mode.debug(
          "ModuleActionExecutor successfully executed action \'" +
            currentAction.getName() +
            "\'",
        );
      } else {
        XenoLog.mode.trace(
          "Waiting for actionTimer to finish ticking " +
            this.actionTimer.getTicksRemaining() +
            "\/" +
            this.actionTimer.getMaxTicks(),
        );
      }
    }
  }
}
