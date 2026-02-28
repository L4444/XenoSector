import { KeyboardControlStyle } from "../types/GameSettings";
import { XenoLog } from "./XenoLogger";

export default class XenoInput {
  private scene!: Phaser.Scene;
  private enemyAutoFire: boolean = false;
  private keyboardControlStyle: KeyboardControlStyle =
    KeyboardControlStyle.RELATIVE;
  private mouseLook: boolean = true;

  private testButton: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // For testing things out
    // Note the Arrow Function gets the context from the GameScene as opposed to a function()
    this.scene.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.key == "1") {
        this.keyboardControlStyle = KeyboardControlStyle.ABSOLUTE;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "2") {
        this.keyboardControlStyle = KeyboardControlStyle.RELATIVE;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "3") {
        this.keyboardControlStyle = KeyboardControlStyle.TANKCONTROLS;
        XenoLog.ship.info(
          "keyboardControlStyle set to  " + this.keyboardControlStyle,
        );
      }

      if (event.key == "4") {
        this.mouseLook = !this.mouseLook;
        XenoLog.ship.info("mouseLook set to " + this.mouseLook);
      }

      if (event.key == "r") {
        this.testButton = true;
        XenoLog.ship.info("Test button pressed");
      }

      if (event.key == "q") {
        this.enemyAutoFire = !this.enemyAutoFire;
        XenoLog.ship.info("Enemy autofire set to " + this.enemyAutoFire);
      }
    });
  }

  getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin | null {
    return this.scene.input.keyboard;
  }

  getMouse(): Phaser.Input.Pointer {
    return this.scene.input.activePointer;
  }

  getEnemyAutoFire(): boolean {
    return this.enemyAutoFire;
  }

  getKeyboardControlStyle(): KeyboardControlStyle {
    return this.keyboardControlStyle;
  }

  getMouseLook(): boolean {
    return this.mouseLook;
  }

  getTestButton(): boolean {
    return this.testButton;
  }

  getMainCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.scene.cameras.main;
  }
}
