import type ProjectileManager from "../managers/ProjectileManager";
import type Ship from "../objects/Ship";
import type BasePhysicsObject from "../physics/BasePhysicsObject";

export default class ShipSystem extends Phaser.GameObjects.GameObject {
  parentShip!: Ship;
  soundName: string = "Sound Name Not Set";
  soundVolume: number = 0;
  cooldownDuration: number = 0;
  cooldownRemaining: number = 0;

  constructor(
    scene: Phaser.Scene,
    parentShip: Ship,
    _soundName: string,
    _soundVolume: number,
    cooldownDuration: number,
  ) {
    super(scene, "ShipSystem");

    // Manually add this to scene and physics (contructor doesn't do this for us)
    scene.add.existing(this);

    this.cooldownDuration = cooldownDuration;
    this.cooldownRemaining = 0;

    this.parentShip = parentShip;
    //this.useSound = scene.sound.add(soundName, { loop: false });
    //this.useSound.volume = soundVolume;
  }

  // This function will be called outside the class
  use(projectileManager: ProjectileManager) {
    if (this.cooldownRemaining == 0) {
      this.cooldownRemaining = this.cooldownDuration;
      //this.useSound.play();
      this.onActivate(projectileManager);
    }
  }

  getCooldown() {
    return this.cooldownRemaining;
  }

  // This function should be overrided in the child class
  onActivate(_projectileManager: ProjectileManager) {
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

  preUpdate() {
    if (this.cooldownRemaining > 0) {
      this.cooldownRemaining--;
    }
  }
}
