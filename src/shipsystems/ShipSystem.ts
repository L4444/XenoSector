import type Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";
import type GameScene from "../scenes/GameScene";

export default class ShipSystem {
  private systemName: string;
  private parentShip!: Ship;
  soundName: string = "Sound Name Not Set"; // Add later
  soundVolume: number = 0; // Add later
  private cooldownDuration: number = 0;
  private cooldownRemaining: number = 0;
  private energyCost!: number;
  private reuseDuration: number = 0;
  private reuseRemaining: number = 0;

  protected scene!: GameScene;

  constructor(
    scene: GameScene,
    systemName: string,
    parentShip: Ship,
    _soundName: string,
    _soundVolume: number,
    cooldownDuration: number,
    reuseDuration: number,
    energyCost: number,
  ) {
    // Manually add this to scene and physics (contructor doesn't do this for us)
    scene.events.on("postupdate", this.postUpdate, this);

    this.systemName = systemName;

    this.cooldownDuration = cooldownDuration;
    this.reuseDuration = reuseDuration;
    this.energyCost = energyCost;

    this.parentShip = parentShip;
    this.scene = scene;

    //this.useSound = scene.sound.add(soundName, { loop: false });
    //this.useSound.volume = soundVolume;
  }

  // This function will be called outside the class
  use() {
    this.cooldownRemaining = this.cooldownDuration;
    this.reuseRemaining = this.reuseDuration;
    //this.useSound.play();
    this.onActivate();
  }

  getSystemName(): string {
    return this.systemName;
  }

  getParentShip(): Ship {
    return this.parentShip;
  }

  postUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }

    if (this.reuseRemaining > 0) {
      this.reuseRemaining--;
    }
  }

  isReady() {
    return this.reuseRemaining == 0;
  }

  isOffCooldown() {
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
