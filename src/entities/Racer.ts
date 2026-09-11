import Phaser from 'phaser';
import { Loadout } from '../types/race';
import { ParticleSystem } from '../systems/ParticleSystem';

export class Racer extends Phaser.Physics.Arcade.Sprite {
  public racerId: string;
  public racerName: string;
  public isPlayer: boolean;
  public loadout: Loadout;

  // Mounted Visual Sprites
  private jetpackSprite: Phaser.GameObjects.Sprite;
  private weaponSprite: Phaser.GameObjects.Sprite;

  // Physical Stat Multipliers
  public maxSpeed: number;
  public accelForce: number;
  public verticalThrustForce: number;
  public boostPower: number;
  public durabilityMultiplier: number;
  public stabilityMultiplier: number;

  // Runtime Meters & States
  public currentEnergy: number = 100;
  public maxEnergy: number = 100;
  public isBoosting: boolean = false;
  public isThrusting: boolean = false;
  public isSpinningOut: boolean = false;
  private spinoutTimer: number = 0;

  // Track Distance
  public distanceTraveled: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string, name: string, loadout: Loadout, isPlayer: boolean = false) {
    super(scene, x, y, `char_${loadout.character.id}`);
    this.racerId = id;
    this.racerName = name;
    this.loadout = loadout;
    this.isPlayer = isPlayer;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Calculate integrated stats from Character + Jetpack + Weapon
    const cStats = loadout.character.stats;
    const jStats = loadout.jetpack.stats;

    // Integrated gameplay stats
    this.maxSpeed = 400 + cStats.speed * 30 + jStats.thrust * 15;
    this.accelForce = 350 + cStats.acceleration * 40;
    this.verticalThrustForce = 500 + jStats.thrust * 45;
    this.boostPower = 350 + cStats.boost * 30 + jStats.boostPower * 35;
    this.durabilityMultiplier = (cStats.durability * 0.1) + (jStats.stability * 0.05);
    this.stabilityMultiplier = jStats.stability * 0.1;

    // Body Physics Config
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setCollideWorldBounds(false);
      body.setDrag(150, 100);
      body.setMaxVelocity(1100, 700);
      body.setSize(44, 60);
    }

    // Mount Jetpack Sprite (mounted behind character back)
    this.jetpackSprite = scene.add.sprite(x - 22, y - 4, `jp_${loadout.jetpack.id}`);
    this.jetpackSprite.setDepth(this.depth - 1);

    // Mount Weapon Sprite (mounted in front arm)
    this.weaponSprite = scene.add.sprite(x + 22, y + 6, `wp_${loadout.weapon.id}`);
    this.weaponSprite.setDepth(this.depth + 1);

    this.setDepth(10);
  }

  public updateRacer(time: number, delta: number, particleSystem: ParticleSystem): void {
    const deltaSec = delta / 1000;

    // Keep mounted sprites locked to racer position
    this.jetpackSprite.setPosition(this.x - 22, this.y - 4);
    this.weaponSprite.setPosition(this.x + 22, this.y + 6);
    this.jetpackSprite.setRotation(this.rotation);
    this.weaponSprite.setRotation(this.rotation);

    // Track horizontal distance
    this.distanceTraveled = Math.max(this.distanceTraveled, this.x);

    // Handle Spinout State
    if (this.isSpinningOut) {
      this.spinoutTimer -= delta;
      this.rotation += 0.2;
      if (this.spinoutTimer <= 0) {
        this.isSpinningOut = false;
        this.setRotation(0);
      }
      return;
    }

    // Dynamic rotation tilt based on vertical velocity
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const targetRot = Math.min(Math.max(body.velocity.y * 0.0008, -0.25), 0.25);
      this.setRotation(targetRot);

      // Jetpack Exhaust Emission
      if (this.isThrusting || this.isBoosting || body.velocity.x > 100) {
        const exhaustX = this.x - 34;
        const exhaustY = this.y - 2;
        particleSystem.emitThrust(exhaustX, exhaustY, this.loadout.jetpack.flameColor, this.isBoosting);
      }
    }

    // Regenerate small baseline energy over time
    if (!this.isBoosting && this.currentEnergy < this.maxEnergy) {
      this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + 12 * deltaSec);
    }
  }

  public applySpinout(durationMs: number = 800): void {
    this.isSpinningOut = true;
    this.spinoutTimer = durationMs;
    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocityX(body.velocity.x * 0.4);
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.jetpackSprite) this.jetpackSprite.destroy();
    if (this.weaponSprite) this.weaponSprite.destroy();
    super.destroy(fromScene);
  }
}
