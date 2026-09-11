import Phaser from 'phaser';
import { Racer } from './Racer';
import { Loadout } from '../types/race';
import { ParticleSystem } from '../systems/ParticleSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { ObjectPool } from '../systems/ObjectPool';
import { Projectile } from './Projectile';

export class PlayerRacer extends Racer {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyShift!: Phaser.Input.Keyboard.Key;
  private keyJ!: Phaser.Input.Keyboard.Key;

  private lastShotTime: number = 0;
  private isPointerReleasedOnStart: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, loadout: Loadout) {
    super(scene, x, y, 'player', 'PLAYER', loadout, true);

    // Keybindings setup
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
      this.keyJ = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    }
  }

  public handleInput(
    time: number,
    delta: number,
    particleSystem: ParticleSystem,
    audioSystem: AudioSystem,
    projectilePool: ObjectPool<Projectile>
  ): void {
    if (!this.body || this.isSpinningOut) {
      this.updateRacer(time, delta, particleSystem);
      return;
    }

    // Pointer release debounce check after scene load
    if (!this.isPointerReleasedOnStart) {
      if (!this.scene.input.activePointer.isDown) {
        this.isPointerReleasedOnStart = true;
      }
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const deltaSec = delta / 1000;

    const isThrustKey = this.keyW?.isDown || this.cursors?.up.isDown || this.cursors?.space.isDown;
    const isDiveKey = this.keyS?.isDown || this.cursors?.down.isDown;
    const isLeftKey = this.keyA?.isDown || this.cursors?.left.isDown;
    const isRightKey = this.keyD?.isDown || this.cursors?.right.isDown;
    const isBoostKey = this.keyShift?.isDown;
    const isMouseFire = this.isPointerReleasedOnStart && this.scene.input.activePointer.isDown;
    const isFireKey = this.keyJ?.isDown || isMouseFire;

    // --- BASELINE FORWARD MOVEMENT ---
    let targetVx = this.maxSpeed;

    // --- HORIZONTAL STEERING ---
    if (isRightKey) {
      targetVx += this.accelForce * 0.8;
    } else if (isLeftKey) {
      targetVx -= this.accelForce * 0.6;
    }

    // --- BOOST MECHANIC ---
    if (isBoostKey && this.currentEnergy > 5) {
      this.isBoosting = true;
      targetVx += this.boostPower;
      this.currentEnergy = Math.max(0, this.currentEnergy - 35 * deltaSec);
      if (Math.random() < 0.2) audioSystem.playBoost();
    } else {
      this.isBoosting = false;
    }

    body.velocity.x = Phaser.Math.Linear(body.velocity.x, targetVx, 0.1);

    // --- VERTICAL THRUST & DIVE ---
    if (isThrustKey) {
      this.isThrusting = true;
      body.velocity.y = Math.max(-600, body.velocity.y - this.verticalThrustForce * deltaSec * 3);
      audioSystem.startThrustLoop();
      audioSystem.updateThrustPitch(body.velocity.x / this.maxSpeed);
    } else if (isDiveKey) {
      this.isThrusting = false;
      body.velocity.y = Math.min(600, body.velocity.y + 700 * deltaSec);
      audioSystem.stopThrustLoop();
    } else {
      this.isThrusting = false;
      audioSystem.stopThrustLoop();
    }

    // World height boundaries
    if (this.y < 90) {
      this.y = 90;
      body.velocity.y = Math.max(0, body.velocity.y);
    } else if (this.y > 630) {
      this.y = 630;
      body.velocity.y = Math.min(0, body.velocity.y);
    }

    // --- WEAPON COMBAT FIRING ---
    const wStats = this.loadout.weapon.stats;
    const cooldownMs = 1000 / wStats.fireRate;

    if (isFireKey && time - this.lastShotTime >= cooldownMs) {
      if (this.currentEnergy >= wStats.energyCost) {
        this.lastShotTime = time;
        this.currentEnergy = Math.max(0, this.currentEnergy - wStats.energyCost);
        this.fireWeapon(projectilePool, audioSystem);
      }
    }

    this.updateRacer(time, delta, particleSystem);
  }

  private fireWeapon(projectilePool: ObjectPool<Projectile>, audioSystem: AudioSystem): void {
    const muzzleX = this.x + 36;
    const muzzleY = this.y + 6;
    const wp = this.loadout.weapon;

    let projTexture = 'proj_pulse';
    let projTint = wp.projectileColor;

    const bodyVx = (this.body as Phaser.Physics.Arcade.Body).velocity.x;

    if (wp.type === 'pulse_blaster') {
      projTexture = 'proj_pulse';
      audioSystem.playLaser();
      projectilePool.get(muzzleX, muzzleY, bodyVx + wp.stats.projectileSpeed, 0, this.racerId, wp.stats.damage, wp.type, projTexture, projTint);
    } else if (wp.type === 'plasma_cannon') {
      projTexture = 'proj_plasma';
      audioSystem.playPlasma();
      projectilePool.get(muzzleX, muzzleY, bodyVx + wp.stats.projectileSpeed, 0, this.racerId, wp.stats.damage, wp.type, projTexture, projTint);
    } else if (wp.type === 'shockwave') {
      projTexture = 'proj_shockwave';
      audioSystem.playShockwaveSound();
      projectilePool.get(muzzleX, muzzleY, bodyVx + wp.stats.projectileSpeed * 0.5, 0, this.racerId, wp.stats.damage, wp.type, projTexture, projTint);
    }
  }
}
