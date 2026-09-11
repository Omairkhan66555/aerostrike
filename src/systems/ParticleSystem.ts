import Phaser from 'phaser';

export class ParticleSystem {
  private scene: Phaser.Scene;
  private thrustEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private boostEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createEmitters();
  }

  private createEmitters(): void {
    // Jetpack thrust particles
    this.thrustEmitter = this.scene.add.particles(0, 0, 'particle_glow', {
      speed: { min: 80, max: 180 },
      angle: { min: 160, max: 200 }, // stream backwards
      scale: { start: 0.8, end: 0.1 },
      alpha: { start: 1, end: 0 },
      lifespan: { min: 150, max: 350 },
      blendMode: 'ADD',
      emitting: false,
    });

    // Boost trail particles
    this.boostEmitter = this.scene.add.particles(0, 0, 'particle_streak', {
      speed: { min: 200, max: 400 },
      angle: { min: 175, max: 185 },
      scale: { start: 1.2, end: 0.2 },
      alpha: { start: 0.9, end: 0 },
      lifespan: { min: 200, max: 400 },
      blendMode: 'ADD',
      emitting: false,
    });

    // Impact / hit explosion sparks
    this.sparkEmitter = this.scene.add.particles(0, 0, 'particle_spark', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0.1 },
      alpha: { start: 1, end: 0 },
      lifespan: { min: 200, max: 500 },
      blendMode: 'ADD',
      emitting: false,
    });

    // Ensure particle emitters stay above background
    this.thrustEmitter.setDepth(15);
    this.boostEmitter.setDepth(14);
    this.sparkEmitter.setDepth(20);
  }

  public emitThrust(x: number, y: number, colorTint: number, isBoosting: boolean = false): void {
    if (!this.thrustEmitter) return;
    (this.thrustEmitter as unknown as { particleTint: number }).particleTint = colorTint;
    this.thrustEmitter.emitParticleAt(x, y, isBoosting ? 4 : 2);

    if (isBoosting && this.boostEmitter) {
      (this.boostEmitter as unknown as { particleTint: number }).particleTint = colorTint;
      this.boostEmitter.emitParticleAt(x, y, 3);
    }
  }

  public emitExplosion(x: number, y: number, count: number = 15): void {
    if (!this.sparkEmitter) return;
    this.sparkEmitter.emitParticleAt(x, y, Math.min(count, 30));
  }

  public destroy(): void {
    if (this.thrustEmitter) this.thrustEmitter.destroy();
    if (this.boostEmitter) this.boostEmitter.destroy();
    if (this.sparkEmitter) this.sparkEmitter.destroy();
  }
}
