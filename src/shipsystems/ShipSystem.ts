import type Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import type GameScene from "../scenes/GameScene";

export default class ShipSystem {
  private parentShip!: Ship;
  soundName: string = "Sound Name Not Set"; // Add later
  soundVolume: number = 0; // Add later
  private cooldownDuration: number = 0;
  private cooldownRemaining: number = 0;
  private energyCost!: number;
  protected scene!: GameScene;

  constructor(
    scene: GameScene,
    parentShip: Ship,
    _soundName: string,
    _soundVolume: number,
    cooldownDuration: number,
    energyCost: number,
  ) {
    // Manually add this to scene and physics (contructor doesn't do this for us)
    scene.events.on("postupdate", this.postUpdate, this);

    this.cooldownDuration = cooldownDuration;
    this.cooldownRemaining = 0;
    this.energyCost = energyCost;

    this.parentShip = parentShip;
    this.scene = scene;

    //this.useSound = scene.sound.add(soundName, { loop: false });
    //this.useSound.volume = soundVolume;
  }

  // This function will be called outside the class
  use() {
    this.cooldownRemaining = this.cooldownDuration;
    //this.useSound.play();
    this.onActivate();
  }

  getParentShip(): Ship {
    return this.parentShip;
  }

  postUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }
  }

  isReady() {
    return this.cooldownRemaining == 0;
  }

  getEnergyCost(): number {
    return this.energyCost;
  }

  // This function should be overrided in the child class
  onActivate() {
    throw new Error(
      "You need to implement your own onActivate() function when you extend this class",
    );
  }

  // This function should be overrided in the child class
  onHit(_hitObject: BasePhysicsObject) {
    throw new Error(
      "You need to implement your own onHit() function when you extend this class",
    );
  }

  preUpdate() {}
}
