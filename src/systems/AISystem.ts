import { AIRacer } from '../entities/AIRacer';
import { ParticleSystem } from './ParticleSystem';
import { ObjectPool } from './ObjectPool';
import { Projectile } from '../entities/Projectile';

export class AISystem {
  private rivals: AIRacer[];

  constructor(rivals: AIRacer[]) {
    this.rivals = rivals;
  }

  public update(
    time: number,
    delta: number,
    particleSystem: ParticleSystem,
    projectilePool: ObjectPool<Projectile>,
    playerX: number
  ): void {
    this.rivals.forEach((rival) => {
      rival.updateAI(time, delta, particleSystem, projectilePool, playerX);
    });
  }
}
