import Phaser from 'phaser';
import { Racer } from '../entities/Racer';
import { Projectile } from '../entities/Projectile';
import { Obstacle } from '../entities/Obstacle';
import { Pickup } from '../entities/Pickup';
import { ParticleSystem } from './ParticleSystem';
import { AudioSystem } from './AudioSystem';
import { ObjectPool } from './ObjectPool';

export class CombatSystem {
  private scene: Phaser.Scene;
  private particleSystem: ParticleSystem;
  private audioSystem: AudioSystem;

  constructor(scene: Phaser.Scene, particleSystem: ParticleSystem, audioSystem: AudioSystem) {
    this.scene = scene;
    this.particleSystem = particleSystem;
    this.audioSystem = audioSystem;
  }

  public handleProjectileRacerOverlap(proj: Projectile, racer: Racer): void {
    if (!proj.active || proj.ownerId === racer.racerId) return;

    // Trigger visual explosion & sound
    this.particleSystem.emitExplosion(proj.x, proj.y, 18);
    this.audioSystem.playHit();

    // Calculate spinout duration based on weapon type & racer durability
    let spinoutDuration = 600;
    if (proj.weaponType === 'plasma_cannon') spinoutDuration = 1000;
    if (proj.weaponType === 'shockwave') spinoutDuration = 1200;

    // Apply durability mitigation
    const finalDuration = Math.max(300, spinoutDuration / racer.durabilityMultiplier);
    racer.applySpinout(finalDuration);

    // Despawn projectile
    proj.despawn();
  }

  public handleRacerObstacleOverlap(racer: Racer, obstacle: Obstacle): void {
    if (obstacle.elementType === 'speed_zone' || obstacle.elementType === 'boost_pad') {
      // Speed boost impulse
      if (racer.body) {
        const body = racer.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(body.velocity.x + 350);
      }
      this.particleSystem.emitThrust(racer.x, racer.y, 0x00f0ff, true);
      this.audioSystem.playBoost();
      return;
    }

    if (obstacle.elementType === 'laser_barrier' || obstacle.elementType === 'drone' || obstacle.elementType === 'obstacle') {
      // Hazard collision
      this.particleSystem.emitExplosion(racer.x, racer.y, 25);
      this.audioSystem.playHit();
      racer.applySpinout(900 / racer.durabilityMultiplier);
    }
  }

  public handleRacerPickupOverlap(racer: Racer, pickup: Pickup): void {
    if (!pickup.active) return;
    racer.currentEnergy = Math.min(racer.maxEnergy, racer.currentEnergy + pickup.energyAmount);
    this.audioSystem.playPickup();
    this.particleSystem.emitThrust(racer.x, racer.y, 0x00f0ff, true);
    pickup.destroy();
  }
}
