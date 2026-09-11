import Phaser from 'phaser';

export interface BossAttackProjectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'cannon' | 'missile' | 'shockwave';
}

export class NeonBehemoth extends Phaser.GameObjects.Container {
  public static readonly MAX_HP = 1000;
  public hp: number = NeonBehemoth.MAX_HP;
  public currentPhase: 1 | 2 | 3 = 1;

  // Sprites
  private bodySprite: Phaser.GameObjects.Sprite;
  private coreSprite: Phaser.GameObjects.Sprite;
  private warningGraphic: Phaser.GameObjects.Sprite;
  private laserGraphic: Phaser.GameObjects.Sprite;

  // State & Vulnerability
  public isWeakPointVulnerable: boolean = false;
  private attackTimer: number = 0;
  private phaseTransitionTimer: number = 0;

  // Laser Sweep State
  public laserActive: boolean = false;
  public warningActive: boolean = false;
  public laserY: number = 360;

  // Pending Projectiles to emit
  public pendingProjectiles: BossAttackProjectile[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Main Body Sprite (240x180)
    this.bodySprite = scene.add.sprite(0, 0, 'boss_neon_behemoth');
    this.add(this.bodySprite);

    // Weak Point Core (44x44) at center (0, 0)
    this.coreSprite = scene.add.sprite(0, 0, 'boss_core_normal');
    this.add(this.coreSprite);

    // Warning Indicator Sprite
    this.warningGraphic = scene.add.sprite(-640, 0, 'boss_warning_line').setOrigin(0, 0.5).setVisible(false);

    // Laser Beam Sprite
    this.laserGraphic = scene.add.sprite(-640, 0, 'boss_laser_beam').setOrigin(0, 0.5).setVisible(false);

    scene.add.existing(this);
    this.setSize(220, 160);
  }

  public update(time: number, delta: number, playerY: number): void {
    const deltaSec = delta / 1000;
    this.attackTimer += deltaSec;

    // Smooth floating hover movement (sine wave)
    const hoverOffset = Math.sin(time * 0.002) * 40;
    const baseTargetY = 360 + hoverOffset;

    // Update Boss Position smoothly
    this.y = Phaser.Math.Linear(this.y, baseTargetY, 0.05);

    // Check Phase Transition thresholds
    const hpPercent = this.hp / NeonBehemoth.MAX_HP;
    if (hpPercent > 0.66) {
      this.currentPhase = 1;
    } else if (hpPercent > 0.33) {
      if (this.currentPhase === 1) {
        this.currentPhase = 2;
        this.triggerPhaseTransition();
      }
    } else {
      if (this.currentPhase !== 3) {
        this.currentPhase = 3;
        this.triggerPhaseTransition();
      }
    }

    // Update Core texture state
    if (this.currentPhase === 3) {
      this.coreSprite.setTexture('boss_core_exposed');
      this.coreSprite.setTint(0xf43f5e);
    } else if (this.isWeakPointVulnerable) {
      this.coreSprite.setTexture('boss_core_exposed');
      this.coreSprite.clearTint();
    } else {
      this.coreSprite.setTexture('boss_core_normal');
      this.coreSprite.clearTint();
    }

    // Execute Phase Attack Behaviors
    switch (this.currentPhase) {
      case 1:
        this.updatePhase1(playerY);
        break;
      case 2:
        this.updatePhase2(playerY);
        break;
      case 3:
        this.updatePhase3(playerY);
        break;
    }
  }

  private triggerPhaseTransition(): void {
    this.attackTimer = 0;
    this.isWeakPointVulnerable = true;
    this.warningActive = false;
    this.laserActive = false;
    this.warningGraphic.setVisible(false);
    this.laserGraphic.setVisible(false);
  }

  public resetState(): void {
    this.hp = NeonBehemoth.MAX_HP;
    this.currentPhase = 1;
    this.attackTimer = 0;
    this.isWeakPointVulnerable = false;
    this.laserActive = false;
    this.warningActive = false;
    this.pendingProjectiles = [];
    if (this.warningGraphic) this.warningGraphic.setVisible(false);
    if (this.laserGraphic) this.laserGraphic.setVisible(false);
    if (this.coreSprite) {
      this.coreSprite.setTexture('boss_core_normal');
      this.coreSprite.clearTint();
    }
  }

  // --- PHASE 1: ENERGY CANNON ---
  private updatePhase1(playerY: number): void {
    // Weak point opens every 3 seconds for 1.2 seconds recovery
    const cycle = this.attackTimer % 3.0;
    this.isWeakPointVulnerable = cycle > 1.8;

    // Fire aimed energy cannon every 1.5 seconds
    if (cycle < 0.05 && this.pendingProjectiles.length === 0) {
      const angle = Math.atan2(playerY - this.y, -300);
      const speed = 420;
      this.pendingProjectiles.push({
        x: this.x - 80,
        y: this.y - 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'cannon',
      });
      this.pendingProjectiles.push({
        x: this.x - 80,
        y: this.y + 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'cannon',
      });
    }
  }

  // --- PHASE 2: LASER SWEEP ---
  private updatePhase2(playerY: number): void {
    const cycle = this.attackTimer % 5.0;

    if (cycle < 1.5) {
      // Telegraph warning
      this.warningActive = true;
      this.laserActive = false;
      this.laserY = Phaser.Math.Linear(this.laserY, playerY, 0.05);
      this.warningGraphic.setPosition(this.x - 600, this.laserY).setVisible(true);
      this.laserGraphic.setVisible(false);
      this.isWeakPointVulnerable = false;
    } else if (cycle < 3.2) {
      // Fire sweeping energy beam across arena
      this.warningActive = false;
      this.laserActive = true;
      this.warningGraphic.setVisible(false);
      this.laserGraphic.setPosition(this.x - 600, this.laserY).setVisible(true);
      this.isWeakPointVulnerable = false;
    } else {
      // Recovery window: weak point exposed!
      this.warningActive = false;
      this.laserActive = false;
      this.warningGraphic.setVisible(false);
      this.laserGraphic.setVisible(false);
      this.isWeakPointVulnerable = true;
    }
  }

  // --- PHASE 3: OVERDRIVE ASSAULT ---
  private updatePhase3(playerY: number): void {
    const cycle = this.attackTimer % 4.0;
    this.isWeakPointVulnerable = true; // Core is continuously exposed in Phase 3!

    this.warningActive = false;
    this.laserActive = false;
    this.warningGraphic.setVisible(false);
    this.laserGraphic.setVisible(false);

    // Rapid Cannon + Missile salvo every 1.2s
    if ((cycle < 0.05 || (cycle > 2.0 && cycle < 2.05)) && this.pendingProjectiles.length === 0) {
      const angle = Math.atan2(playerY - this.y, -300);
      const speed = 520;
      this.pendingProjectiles.push({
        x: this.x - 90,
        y: this.y - 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'cannon',
      });
      this.pendingProjectiles.push({
        x: this.x - 90,
        y: this.y + 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: 'cannon',
      });

      // Missile burst
      this.pendingProjectiles.push({
        x: this.x - 60,
        y: this.y,
        vx: -350,
        vy: (Math.random() - 0.5) * 200,
        type: 'missile',
      });
    }
  }

  public takeDamage(amount: number, isWeakPointHit: boolean): { destroyed: boolean; actualDamage: number } {
    const multiplier = isWeakPointHit ? 2.5 : (this.isWeakPointVulnerable ? 1.5 : 0.6);
    const actualDamage = Math.round(amount * multiplier);

    this.hp = Math.max(0, this.hp - actualDamage);

    // Visual Flash
    this.bodySprite.setTint(isWeakPointHit ? 0x00ffff : 0xff2a5f);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.bodySprite.clearTint();
    });

    return {
      destroyed: this.hp <= 0,
      actualDamage,
    };
  }

  public getWeakPointBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x - 22, this.y - 22, 44, 44);
  }

  public getBodyBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x - 110, this.y - 80, 220, 160);
  }

  public getLaserBounds(): Phaser.Geom.Rectangle | null {
    if (!this.laserActive) return null;
    return new Phaser.Geom.Rectangle(0, this.laserY - 20, 1280, 40);
  }

  public destroy(fromScene?: boolean): void {
    if (this.warningGraphic) this.warningGraphic.destroy();
    if (this.laserGraphic) this.laserGraphic.destroy();
    super.destroy(fromScene);
  }
}
