import Phaser from 'phaser';
import { Racer } from './Racer';
import { Loadout } from '../types/race';
import { ParticleSystem } from '../systems/ParticleSystem';
import { ObjectPool } from '../systems/ObjectPool';
import { Projectile } from './Projectile';

export class AIRacer extends Racer {
  private decisionTimer: number = 0;
  private targetY: number = 360;
  private lastShotTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string, name: string, loadout: Loadout) {
    super(scene, x, y, id, name, loadout, false);
    this.targetY = y;
  }

  public updateAI(
    time: number,
    delta: number,
    particleSystem: ParticleSystem,
    projectilePool: ObjectPool<Projectile>,
    playerX: number
  ): void {
    if (!this.body || this.isSpinningOut) {
      this.updateRacer(time, delta, particleSystem);
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    const deltaSec = delta / 1000;

    // AI decision tick evaluated every 150ms (lightweight, zero per-frame waste)
    this.decisionTimer += delta;
    if (this.decisionTimer > 150) {
      this.decisionTimer = 0;
      this.makeAIDecisions(playerX);
    }

    // Move horizontally towards max speed
    let currentMaxVx = this.maxSpeed;
    if (this.isBoosting) {
      currentMaxVx += this.boostPower;
      this.currentEnergy = Math.max(0, this.currentEnergy - 30 * deltaSec);
      if (this.currentEnergy <= 10) this.isBoosting = false;
    }
    body.velocity.x = Phaser.Math.Linear(body.velocity.x, currentMaxVx, 0.08);

    // Smooth vertical positioning towards targetY
    const dy = this.targetY - this.y;
    body.velocity.y = Math.min(Math.max(dy * 4, -450), 450);

    // Dynamic weapon firing logic
    const wStats = this.loadout.weapon.stats;
    const cooldownMs = 1000 / wStats.fireRate;
    const distanceToPlayer = playerX - this.x;

    // If player is ahead within weapon range, fire weapon!
    if (distanceToPlayer > 50 && distanceToPlayer < wStats.range && time - this.lastShotTime >= cooldownMs) {
      if (this.currentEnergy >= wStats.energyCost) {
        this.lastShotTime = time;
        this.currentEnergy -= wStats.energyCost;
        this.fireAIWeapon(projectilePool);
      }
    }

    this.updateRacer(time, delta, particleSystem);
  }

  private makeAIDecisions(playerX: number): void {
    // Random vertical oscillation to simulate active flight path
    if (Math.random() < 0.3) {
      this.targetY = Phaser.Math.Clamp(this.y + (Math.random() * 160 - 80), 120, 600);
    }

    // Boost decision: Boost if energy is high and player is ahead
    if (this.currentEnergy > 70 && playerX > this.x + 100 && Math.random() < 0.4) {
      this.isBoosting = true;
    }
  }

  private fireAIWeapon(projectilePool: ObjectPool<Projectile>): void {
    const muzzleX = this.x + 28;
    const muzzleY = this.y + 4;
    const wp = this.loadout.weapon;
    const bodyVx = (this.body as Phaser.Physics.Arcade.Body).velocity.x;

    let projTexture = 'proj_pulse';
    if (wp.type === 'plasma_cannon') projTexture = 'proj_plasma';
    if (wp.type === 'shockwave') projTexture = 'proj_shockwave';

    projectilePool.get(muzzleX, muzzleY, bodyVx + wp.stats.projectileSpeed, 0, this.racerId, wp.stats.damage, wp.type, projTexture, wp.projectileColor);
  }
}
