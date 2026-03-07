import VehicleModule from "./VehicleModule";
import Shield from "./Shield";

import { XenoLog } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";
import type VehicleData from "../types/VehicleData";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import type VehicleControlInput from "../types/VehicleControlInput";
import XenoCreator from "../helpers/XenoCreator";
import type ProjectileManager from "../managers/ProjectileManager";
import AlertManager from "../managers/AlertManager";
import { RenderDepth } from "../types/RenderDepth";

import SlicedValueBar from "../hud/SlicedValueBar";
import SmoothValueBar from "../hud/SmoothValueBar";

import type VehicleModuleUsageOptions from "../types/VehicleModuleUsageOptions";
import type ICanUseVehicleModule from "../interfaces/ICanUseVehicleModule";
import { VehicleModuleUseResult } from "../types/VehicleModuleUseResult";
import Timer from "../helpers/Timer";
import FooAction from "../actions/FooAction";
import ShootProjectileAction from "../actions/ShootProjectileAction";
import WaitAction from "../actions/WaitAction";
import type ModuleAction from "../actions/ModuleAction";
import ModuleActionExecutor from "../ModuleActionExecutor";
import BoostAction from "../actions/BoostAction";

export default class Vehicle
  extends PhysicsEntity
  implements ICanUseVehicleModule
{
  private static count: number = 0;
  private VehicleID!: number;
  private shield!: Shield;
  private hpBar!: SmoothValueBar;
  private energyBar!: SlicedValueBar;
  private executionBar!: SmoothValueBar;

  private hp!: number;
  private energy!: number;

  private modules!: Array<VehicleModule>;

  private controller!: BaseController;
  private explodeParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private isPlayerTeam!: boolean;

  private cooldownMessageTimer: Timer = new Timer();
  private energyMessageTimer: Timer = new Timer();
  private chargesMessageTimer: Timer = new Timer();

  private VehicleData: VehicleData;
  private turret!: Phaser.GameObjects.Image;

  private alertManager!: AlertManager;
  private moduleActionExecutor!: ModuleActionExecutor;

  constructor(
    xenoCreator: XenoCreator,
    projectileManager: ProjectileManager,
    alertManager: AlertManager,
    VehicleName: string,
    x: number,
    y: number,
    textureKey: string,
    controller: BaseController,
    isPlayerTeam: boolean,
    VehicleData: VehicleData,
  ) {
    super(
      xenoCreator,
      x,
      y,
      textureKey,
      VehicleName,
      PhysicsEntityType.Vehicle,
      true,
      100,
    );
    XenoLog.Vehicle.debug(
      "Vehicle \'" + VehicleName + "\' Created",
      VehicleData,
    );
    Vehicle.count++;
    this.VehicleID = Vehicle.count;
    this.setCollisionGroup(-this.VehicleID);
    this.VehicleData = VehicleData;
    this.controller = controller;
    this.isPlayerTeam = isPlayerTeam;

    this.alertManager = alertManager;
    this.moduleActionExecutor = new ModuleActionExecutor(
      this,
      projectileManager,
    );

    /// Put shield in it's own object class
    this.shield = new Shield(xenoCreator, this);

    this.hpBar = new SmoothValueBar(
      xenoCreator,
      0, // offsetX
      -this.displayHeight / 2 - 10, // offsetY
    );
    this.energyBar = new SlicedValueBar(
      xenoCreator,
      0, // offsetX
      -this.displayHeight / 2, // offsetY
    );

    this.executionBar = new SmoothValueBar(
      xenoCreator,
      0, // offsetX
      -this.displayHeight / 2 + 10, // offsetY
    );

    this.explodeParticleEmitter = xenoCreator.createParticleEmitter(
      0,
      0,
      "i_0003",
      {
        lifespan: 2000,
        speed: { min: 25, max: 50 },
        angle: { min: 0, max: 360 },
        emitting: false,
        blendMode: "ADD",
        scale: 0.25,
        alpha: { start: 0.5, end: 0, ease: "expo.out" },
      },
      RenderDepth.VehicleS,
    );

    this.turret = xenoCreator.createBasicImage(
      0,
      0,
      "pew-big-green",
      RenderDepth.TURRETS,
    );

    this.modules = new Array<VehicleModule>();

    let basicWeapon: VehicleModule = new VehicleModule(
      xenoCreator,
      projectileManager,
      this,
      {
        moduleName: "Plasma Cannon",
        cooldownDuration: 30,
        energyCost: 0,
        uiTextureName: "target-icon",
        playerKeyBind: "M1",
        maxCharges: 1,
        chargeDuration: 0,
        actions: [
          new ShootProjectileAction({
            range: 15,
            speed: 10,
            textureName: "pew-blue",
            damage: 20,
            mass: 0,
          }),
          new WaitAction(30),
        ],
      },
    );

    this.modules.push(basicWeapon);

    let rapidFireWeapon: VehicleModule = new VehicleModule(
      xenoCreator,
      projectileManager,
      this,
      {
        moduleName: "Machine Gun",
        cooldownDuration: 0,
        energyCost: 0,
        uiTextureName: "machinegun-icon",
        playerKeyBind: "M2",
        maxCharges: 4,
        chargeDuration: 120,
        actions: [
          new WaitAction(10),
          new ShootProjectileAction({
            range: 15,
            speed: 20,
            textureName: "pew-yellow",
            damage: 10,
            mass: 0,
          }),
          new WaitAction(3),
          new ShootProjectileAction({
            range: 10,
            speed: 20,
            textureName: "pew-yellow",
            damage: 10,
            mass: 0,
          }),
          new WaitAction(3),
          new ShootProjectileAction({
            range: 10,
            speed: 20,
            textureName: "pew-yellow",
            damage: 10,
            mass: 0,
          }),
          new WaitAction(10),
        ],
      },
    );

    this.modules.push(rapidFireWeapon);

    let heavyLongCooldownWeapon: VehicleModule = new VehicleModule(
      xenoCreator,
      projectileManager,
      this,
      {
        moduleName: "Rad Blaster",
        cooldownDuration: 60 * 4,
        energyCost: 10,
        uiTextureName: "rad-icon",
        playerKeyBind: "F",
        maxCharges: 1,
        chargeDuration: 60 * 4,
        actions: [
          new WaitAction(30),
          new ShootProjectileAction({
            range: 15,
            speed: 20,
            textureName: "pew-big-green",
            damage: 70,
            mass: 6400,
          }),
        ],
      },
    );

    this.modules.push(heavyLongCooldownWeapon);

    let crapBlaster: VehicleModule = new VehicleModule(
      xenoCreator,
      projectileManager,
      this,
      {
        moduleName: "Crap Blaster",
        cooldownDuration: 0,
        energyCost: 0,
        uiTextureName: "RadBlasterPlaceholder",
        playerKeyBind: "X",
        maxCharges: 1,
        chargeDuration: 0,
        actions: [
          new FooAction(),
          new ShootProjectileAction({
            range: 15,
            speed: 10,
            textureName: "beam",
            damage: 0.5,
            mass: 0,
          }),
          new WaitAction(60),
        ],
      },
    );

    this.modules.push(crapBlaster);

    let booster: VehicleModule = new VehicleModule(
      xenoCreator,
      projectileManager,
      this,
      {
        moduleName: "Booster Drive",
        cooldownDuration: 0,
        energyCost: 0,
        uiTextureName: "boost-icon",
        playerKeyBind: "Space",
        maxCharges: 3,
        chargeDuration: 60 * 2,
        actions: [new BoostAction(), new WaitAction(30)],
      },
    );

    this.modules.push(booster);

    this.respawn();
  }

  // GETTERS
  getIsPlayerTeam(): boolean {
    return this.isPlayerTeam;
  }

  getEnergy(): number {
    return this.energy;
  }

  isCasting(): boolean {
    return this.moduleActionExecutor.isActive();
  }

  getVehicleID(): number {
    return this.VehicleID;
  }

  getModule(num: number): VehicleModule {
    return this.modules[num];
  }

  getModuleCount(): number {
    return this.modules.length;
  }

  respawn() {
    // Play the explosion effect.
    this.explode();

    // Move their position back to spawn.
    if (this.isPlayerTeam) {
      this.setPosition(0, 1800);
    } else {
      this.setPosition(0, 1000);
    }

    // Reset velocity so the Vehicle doesn't respawn at speed
    this.setVelocity(0, 0);

    // Heal back to full
    this.hp = this.VehicleData.maxHP;
    this.energy = 0;
  }

  // Do physics before update
  preUpdate() {
    let sci: VehicleControlInput = this.controller.getVehicleInput(this);

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      sci.VehicleTargetRotation,
      this.VehicleData.rotationSpeed,
    );

    this.turret.rotation = Phaser.Math.Angle.RotateTo(
      this.turret.rotation,
      sci.turretTargetRotation,
      this.VehicleData.rotationSpeed,
    );

    let moveVector: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

    // The four cardinal directions
    // Take the intent and turn it into a movement vector.
    if (sci.thrust.north) {
      moveVector.y = -1;
    }
    if (sci.thrust.east) {
      moveVector.x = 1;
    }
    if (sci.thrust.south) {
      moveVector.y = 1;
    }
    if (sci.thrust.west) {
      moveVector.x = -1;
    }

    // Normalise and scale to prevent diagonal movement from being faster.
    moveVector.normalize();
    moveVector.scale(this.VehicleData.thrustPower);

    // Finally, apply the force.
    this.applyForce(moveVector.x, moveVector.y);

    // Relative position
    if (sci.thrust.forward) {
      XenoLog.Vehicle.warn("Relative movement mode not supported");
      this.thrustForward(this.VehicleData.thrustPower);
    }
    if (sci.thrust.back) {
      XenoLog.Vehicle.warn("Relative movement mode not supported");
      this.thrustBack(this.VehicleData.thrustPower);
    }
    if (sci.thrust.left) {
      XenoLog.Vehicle.warn("Relative movement mode not supported");
      this.thrustLeft(this.VehicleData.thrustPower);
    }
    if (sci.thrust.right) {
      XenoLog.Vehicle.warn("Relative movement mode not supported");
      this.thrustRight(this.VehicleData.thrustPower);
    }

    // Activate modules
    for (let i = 0; i < sci.modules.length; i++) {
      if (sci.modules[i]) {
        this.useModule(i);
      }
    }

    let vel = this.getVelocity();

    const currentSpeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    // Limit according to max speed
    // If our vehicle is going faster than it should
    // Apply a force equal to the thrustPower against it to negate it.
    if (currentSpeed > this.VehicleData.maxSpeed) {
      const maxSpeedCap: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        -vel.x,
        -vel.y,
      );

      maxSpeedCap.normalize();
      maxSpeedCap.scale(this.VehicleData.thrustPower);

      this.applyForce(maxSpeedCap.x, maxSpeedCap.y);
    }
  }

  postUpdate(): void {
    // Vehicle Death code
    if (this.hp <= 0) {
      this.respawn();
    }

    this.energyMessageTimer.update();
    this.cooldownMessageTimer.update();
    this.chargesMessageTimer.update();

    this.turret.x = this.x;
    this.turret.y = this.y;

    // Regen energn
    this.energy += 0.1;

    // Cap currentValue, it should never be negative
    this.energy = Phaser.Math.Clamp(this.energy, 0, this.VehicleData.maxEnergy);
    this.hp = Phaser.Math.Clamp(this.hp, 0, this.VehicleData.maxHP);

    let borderColour: string = this.isPlayerTeam ? "#009999" : "#660000";
    this.hpBar.updateValue(
      this.x,
      this.y,
      this.hp / this.VehicleData.maxHP,
      128,
      borderColour,
      "#CC0000",
    );
    this.energyBar.updateValue(
      this.x,
      this.y,
      this.energy / this.VehicleData.maxEnergy,
      128,
      borderColour,
      "#00CCCC",
    );
    this.executionBar.updateValue(
      this.x,
      this.y,
      this.moduleActionExecutor.getRemainingRatio(),
      128,
      "#333333",
      "#FFFF00",
    );
    // Hide the bar when not using it.
    //this.executionBar.setVisible(this.castTimeRemaining > 0);

    this.moduleActionExecutor.update();
  }

  takeDamage(damageAmount: number) {
    this.hp -= damageAmount;
    this.shield.hit();

    XenoLog.Vehicle.debug(
      "\'" +
        this.physicsEntityName +
        "\' has taken " +
        damageAmount +
        " damage",
    );
  }
  // TESTING Methods
  explode() {
    this.explodeParticleEmitter.x = this.x;
    this.explodeParticleEmitter.y = this.y;
    this.explodeParticleEmitter.explode(32);
  }

  useModule(num: number) {
    let mod: VehicleModule = this.getModule(num);
    XenoLog.Vehicle.trace("Trying to use \'" + mod.getModuleName() + "\'");

    if (this.isCasting()) {
      XenoLog.Vehicle.trace(
        "Vehicle \'" + this.physicsEntityName + "\' is already casting.",
      );
      return;
    }

    let result: VehicleModuleUseResult = mod.use();

    if (result == VehicleModuleUseResult.SUCCESS) {
      this.energy -= mod.getEnergyCost();
      return;
    }

    if (result == VehicleModuleUseResult.LOW_ENERGY) {
      if (!this.energyMessageTimer.isActive()) {
        this.alertManager.textPop(
          this.x,
          this.y,
          "Not enough energy for " + mod.getModuleName(),
        );
        this.energyMessageTimer.start(60);
      }
      return;
    }

    if (result == VehicleModuleUseResult.ON_COOLDOWN) {
      if (!this.cooldownMessageTimer.isActive()) {
        this.alertManager.textPop(
          this.x,
          this.y,
          mod.getModuleName() + " is on cooldown",
        );
        this.cooldownMessageTimer.start(60);
      }
      return;
    }

    if (result == VehicleModuleUseResult.NO_CHARGES) {
      if (!this.chargesMessageTimer.isActive()) {
        this.alertManager.textPop(
          this.x,
          this.y,
          mod.getModuleName() + " not enough charges",
        );
        this.chargesMessageTimer.start(60);
      }
      return;
    }

    XenoLog.Vehicle.trace(
      "\'" + " boop " + "\' Used \'" + mod.getModuleName() + "\'",
    );
  }

  getVehicleModuleUsageOptions(): VehicleModuleUsageOptions {
    return {
      rotation: this.turret.rotation,
      x: this.x,
      y: this.y,
      velocityX: this.getVelocity().x,
      velocityY: this.getVelocity().y,
      isPlayerTeam: this.isPlayerTeam,
      VehicleID: this.VehicleID,
    };
  }

  doActions(moduleAction: ModuleAction[]): void {
    this.moduleActionExecutor.executeActions(moduleAction);
  }
}
