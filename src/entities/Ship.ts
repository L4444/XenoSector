import ShipModule from "./ShipModule";
import Shield from "./Shield";

import { XenoLog } from "../helpers/XenoLogger";
import type BaseController from "../controllers/BaseController";
import type ShipData from "../types/ShipData";
import PhysicsEntity from "./PhysicsEntity";
import { PhysicsEntityType } from "../types/PhysicsEntityType";

import type ShipControlInput from "../types/ShipControlInput";
import XenoCreator from "../helpers/XenoCreator";
import type ProjectileManager from "../managers/ProjectileManager";
import AlertManager from "../managers/AlertManager";
import { RenderDepth } from "../types/RenderDepth";

import SlicedValueBar from "../hud/SlicedValueBar";
import SmoothValueBar from "../hud/SmoothValueBar";

import type ShipModuleUsageOptions from "../types/ShipModuleUsageOptions";
import type ICanUseShipModule from "../interfaces/ICanUseShipModule";
import { ShipModuleUseResult } from "../types/ShipModuleUseResult";
import Timer from "../helpers/Timer";
import FooAction from "../actions/FooAction";
import ShootProjectileAction from "../actions/ShootProjectileAction";
import WaitAction from "../actions/WaitAction";
import type ModuleAction from "../actions/ModuleAction";
import ModuleActionExecutor from "../ModuleActionExecutor";
import BoostAction from "../actions/BoostAction";

export default class Ship extends PhysicsEntity implements ICanUseShipModule {
  private static count: number = 0;
  private shipID!: number;
  private shield!: Shield;
  private hpBar!: SmoothValueBar;
  private energyBar!: SlicedValueBar;
  private executionBar!: SmoothValueBar;

  private hp!: number;
  private energy!: number;

  private modules!: Array<ShipModule>;

  private controller!: BaseController;
  private explodeParticleEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private isPlayerTeam!: boolean;

  private cooldownMessageTimer: Timer = new Timer();
  private energyMessageTimer: Timer = new Timer();
  private chargesMessageTimer: Timer = new Timer();

  private shipData: ShipData;
  private turret!: Phaser.GameObjects.Image;

  private alertManager!: AlertManager;
  private moduleActionExecutor!: ModuleActionExecutor;

  constructor(
    xenoCreator: XenoCreator,
    projectileManager: ProjectileManager,
    alertManager: AlertManager,
    shipName: string,
    x: number,
    y: number,
    textureKey: string,
    controller: BaseController,
    isPlayerTeam: boolean,
    shipData: ShipData,
  ) {
    super(
      xenoCreator,
      x,
      y,
      textureKey,
      shipName,
      PhysicsEntityType.SHIP,
      true,
      100,
    );
    XenoLog.ship.debug("Ship \'" + shipName + "\' Created", shipData);
    Ship.count++;
    this.shipID = Ship.count;
    this.setCollisionGroup(-this.shipID);
    this.shipData = shipData;
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
      RenderDepth.SHIPS,
    );

    this.turret = xenoCreator.createBasicImage(
      0,
      0,
      "pew-big-green",
      RenderDepth.TURRETS,
    );

    this.modules = new Array<ShipModule>();

    let basicWeapon: ShipModule = new ShipModule(
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

    let rapidFireWeapon: ShipModule = new ShipModule(
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

    let heavyLongCooldownWeapon: ShipModule = new ShipModule(
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

    let crapBlaster: ShipModule = new ShipModule(
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

    let booster: ShipModule = new ShipModule(
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

  getShipID(): number {
    return this.shipID;
  }

  getModule(num: number): ShipModule {
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

    // Reset velocity so the ship doesn't respawn at speed
    this.setVelocity(0, 0);

    // Heal back to full
    this.hp = this.shipData.maxHP;
    this.energy = 0;
  }

  // Do physics before update
  preUpdate() {
    let sci: ShipControlInput = this.controller.getShipInput(this);

    this.rotation = Phaser.Math.Angle.RotateTo(
      this.rotation,
      sci.shipTargetRotation,
      this.shipData.rotationSpeed,
    );

    this.turret.rotation = Phaser.Math.Angle.RotateTo(
      this.turret.rotation,
      sci.turretTargetRotation,
      this.shipData.rotationSpeed,
    );

    let isThrust: boolean = false;

    // The four cardinal directions
    if (sci.thrust.north) {
      this.applyForce(0, -this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.east) {
      this.applyForce(this.shipData.thrustPower, 0);
      isThrust = true;
    }
    if (sci.thrust.south) {
      this.applyForce(0, this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.west) {
      this.applyForce(-this.shipData.thrustPower, 0);
      isThrust = true;
    }

    // Relative position
    if (sci.thrust.forward) {
      this.thrustForward(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.back) {
      this.thrustBack(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.left) {
      this.thrustLeft(this.shipData.thrustPower);
      isThrust = true;
    }
    if (sci.thrust.right) {
      this.thrustRight(this.shipData.thrustPower);
      isThrust = true;
    }

    // Activate modules
    for (let i = 0; i < sci.modules.length; i++) {
      if (sci.modules[i]) {
        this.useModule(i);
      }
    }

    let vel = this.getVelocity();
    let maxSpeed = this.shipData.maxSpeed;

    const currentSpeed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

    // If we are not thrusting, slow down gently
    if (!isThrust) {
      const brakeThruster: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        -vel.x,
        -vel.y,
      );

      brakeThruster.scale(0.005);

      this.applyForce(brakeThruster.x, brakeThruster.y);
    }

    // Limit according to max speed
    if (currentSpeed > maxSpeed) {
      //let scale = currentSpeed / maxSpeed;
      // Limit your max speed by firing reverse thrusters, so boosting works
      //this.applyForce(-vel.x / currentSpeed, -vel.y / scale);
      const maxSpeedCap: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        -vel.x,
        -vel.y,
      );

      maxSpeedCap.scale(0.01);

      this.applyForce(maxSpeedCap.x, maxSpeedCap.y);
    }
  }

  postUpdate(): void {
    // Ship Death code
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
    this.energy = Phaser.Math.Clamp(this.energy, 0, this.shipData.maxEnergy);
    this.hp = Phaser.Math.Clamp(this.hp, 0, this.shipData.maxHP);

    let borderColour: string = this.isPlayerTeam ? "#009999" : "#660000";
    this.hpBar.updateValue(
      this.x,
      this.y,
      this.hp / this.shipData.maxHP,
      this.displayWidth,
      borderColour,
      "#CC0000",
    );
    this.energyBar.updateValue(
      this.x,
      this.y,
      this.energy / this.shipData.maxEnergy,
      this.displayWidth,
      borderColour,
      "#00CCCC",
    );
    this.executionBar.updateValue(
      this.x,
      this.y,
      this.moduleActionExecutor.getRemainingRatio(),
      this.displayWidth,
      "#333333",
      "#FFFF00",
    );
    //this.executionBar.setVisible(this.castTimeRemaining > 0);

    this.moduleActionExecutor.update();
  }

  takeDamage(damageAmount: number) {
    this.hp -= damageAmount;
    this.shield.hit();

    XenoLog.ship.debug(
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
    let mod: ShipModule = this.getModule(num);
    XenoLog.ship.trace("Trying to use \'" + mod.getModuleName() + "\'");

    if (this.isCasting()) {
      XenoLog.ship.trace(
        "Ship \'" + this.physicsEntityName + "\' is already casting.",
      );
      return;
    }

    let result: ShipModuleUseResult = mod.use();

    if (result == ShipModuleUseResult.SUCCESS) {
      this.energy -= mod.getEnergyCost();
      return;
    }

    if (result == ShipModuleUseResult.LOW_ENERGY) {
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

    if (result == ShipModuleUseResult.ON_COOLDOWN) {
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

    if (result == ShipModuleUseResult.NO_CHARGES) {
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

    XenoLog.ship.trace(
      "\'" + " boop " + "\' Used \'" + mod.getModuleName() + "\'",
    );
  }

  getShipModuleUsageOptions(): ShipModuleUsageOptions {
    return {
      rotation: this.turret.rotation,
      x: this.x,
      y: this.y,
      velocityX: this.getVelocity().x,
      velocityY: this.getVelocity().y,
      isPlayerTeam: this.isPlayerTeam,
      shipID: this.shipID,
    };
  }

  doActions(moduleAction: ModuleAction[]): void {
    this.moduleActionExecutor.executeActions(moduleAction);
  }
}
