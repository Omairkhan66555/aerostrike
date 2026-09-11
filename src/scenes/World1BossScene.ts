import Phaser from 'phaser';
import { PlayerRacer } from '../entities/PlayerRacer';
import { NeonBehemoth, BossAttackProjectile } from '../entities/NeonBehemoth';
import { Projectile } from '../entities/Projectile';
import { LoadoutSystem } from '../systems/LoadoutSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { ObjectPool } from '../systems/ObjectPool';
import { SaveSystem } from '../systems/SaveSystem';

export class World1BossScene extends Phaser.Scene {
  private player!: PlayerRacer;
  private boss!: NeonBehemoth;

  // Background Parallax
  private bgFar!: Phaser.GameObjects.TileSprite;
  private bgMid!: Phaser.GameObjects.TileSprite;

  // Systems
  private particleSystem!: ParticleSystem;
  private audioSystem!: AudioSystem;
  private projectilePool!: ObjectPool<Projectile>;

  // Boss Projectiles Pool
  private bossProjectiles: { sprite: Phaser.GameObjects.Sprite; proj: BossAttackProjectile }[] = [];

  // Player Health & Invulnerability (i-frames)
  public playerHP: number = 100;
  public maxPlayerHP: number = 100;
  private invulnerableUntil: number = 0;

  // Controls & Firing
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyFire!: Phaser.Input.Keyboard.Key;
  private keyESC!: Phaser.Input.Keyboard.Key;

  private lastFireTime: number = 0;
  private isGameOver: boolean = false;
  private isVictorySequence: boolean = false;
  private hasAwardedVictory: boolean = false;
  private isPaused: boolean = false;
  private pauseModal?: Phaser.GameObjects.Container;

  // HUD Elements
  private bossHpBarFill!: Phaser.GameObjects.Graphics;
  private bossHpText!: Phaser.GameObjects.Text;
  private bossPhaseText!: Phaser.GameObjects.Text;
  private playerHpBarFill!: Phaser.GameObjects.Graphics;
  private playerEnergyBarFill!: Phaser.GameObjects.Graphics;
  private playerHpText!: Phaser.GameObjects.Text;

  constructor() {
    super('World1BossScene');
  }

  public create(): void {
    console.log('[BossDebug] World1BossScene create() STARTED');

    // 1. Reset Scene State
    this.isGameOver = false;
    this.isVictorySequence = false;
    this.hasAwardedVictory = false;
    this.playerHP = this.maxPlayerHP;
    this.bossProjectiles = [];

    // Grant 1.0 second spawn protection on start/retry
    this.invulnerableUntil = this.time.now + 1000;

    // 2. Setup Camera & World Bounds (Fixed 1280x720 Arena)
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.physics.world.setBounds(0, 0, 1280, 720);

    // 3. Parallax Backgrounds (Reactor Chamber)
    this.bgFar = this.add.tileSprite(640, 360, 1280, 720, 'bg_arena_far').setScrollFactor(0).setDepth(-10);
    this.bgMid = this.add.tileSprite(640, 360, 1280, 720, 'bg_arena_mid').setScrollFactor(0).setDepth(-9);

    // 4. Audio & Particle Systems
    this.audioSystem = AudioSystem.getInstance();
    this.particleSystem = new ParticleSystem(this);
    this.audioSystem.playBossArrival();

    // 5. Object Pools
    this.projectilePool = new ObjectPool<Projectile>(() => new Projectile(this), 30);

    // 6. Create Player Racer at Safe Spawn Position
    const loadout = LoadoutSystem.getInstance().getPlayerLoadout();
    this.player = new PlayerRacer(this, 180, 360, loadout);
    this.player.setDepth(10);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    (this.player.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // 7. Create Neon Behemoth Boss
    this.boss = new NeonBehemoth(this, 1050, 360);
    this.boss.setDepth(8);
    this.boss.resetState();

    // 8. Setup Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.keyFire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
      this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    // 9. Create HUD Overlay
    this.createBossHUD();

    console.log('[BossDebug] World1BossScene create() COMPLETED SUCCESSFULLY');
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
      this.pauseModal = this.add.container(640, 360).setDepth(200);
      const bg = this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.5);
      const text = this.add.text(0, 0, 'PAUSED - PRESS ESC TO RESUME', { color: '#ffffff', fontSize: '32px' }).setOrigin(0.5);
      this.pauseModal.add([bg, text]);
    } else {
      this.physics.resume();
      this.pauseModal?.destroy();
      this.pauseModal = undefined;
    }
  }

  private createBossHUD(): void {
    const hudContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);

    // Top Boss Health Bar Frame
    const bossFrame = this.add.graphics();
    bossFrame.fillStyle(0x0f172a, 0.9);
    bossFrame.fillRect(340, 15, 600, 48);
    bossFrame.lineStyle(2, 0xf43f5e, 1);
    bossFrame.strokeRect(340, 15, 600, 48);

    this.bossHpBarFill = this.add.graphics();
    this.updateBossHPBar(1.0);

    this.add.text(640, 22, 'NEON BEHEMOTH', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.bossHpText = this.add.text(925, 22, '100%', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#f43f5e',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.bossPhaseText = this.add.text(640, 68, 'PHASE 1 — ENERGY CANNON ASSAULT', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '13px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    // Bottom Left Player HUD Frame
    const pFrame = this.add.graphics();
    pFrame.fillStyle(0x0f172a, 0.85);
    pFrame.fillRect(20, 635, 320, 70);
    pFrame.lineStyle(2, 0x00f0ff, 0.8);
    pFrame.strokeRect(20, 635, 320, 70);

    this.add.text(32, 642, 'ARMOR HULL', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '11px',
      color: '#94a3b8',
      fontStyle: 'bold',
    });

    this.playerHpBarFill = this.add.graphics();
    this.updatePlayerHPBar(1.0);

    this.playerHpText = this.add.text(325, 640, '100/100', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '11px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.add.text(32, 665, 'JETPACK ENERGY', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '11px',
      color: '#94a3b8',
      fontStyle: 'bold',
    });

    this.playerEnergyBarFill = this.add.graphics();
    this.updatePlayerEnergyBar(1.0);

    const wp = LoadoutSystem.getInstance().getPlayerLoadout().weapon;
    this.add.text(32, 687, `EQUIPPED: ${wp.name}`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '11px',
      color: '#facc15',
      fontStyle: 'bold',
    });

    hudContainer.add([
      bossFrame,
      this.bossHpBarFill,
      this.bossHpText,
      this.bossPhaseText,
      pFrame,
      this.playerHpBarFill,
      this.playerHpText,
      this.playerEnergyBarFill,
    ]);
  }

  private updateBossHPBar(pct: number): void {
    this.bossHpBarFill.clear();
    this.bossHpBarFill.fillStyle(0xf43f5e, 1);
    this.bossHpBarFill.fillRect(344, 42, Math.max(0, 592 * pct), 16);
  }

  private updatePlayerHPBar(pct: number): void {
    this.playerHpBarFill.clear();
    this.playerHpBarFill.fillStyle(0x00f0ff, 1);
    this.playerHpBarFill.fillRect(125, 642, Math.max(0, 200 * pct), 12);
  }

  private updatePlayerEnergyBar(pct: number): void {
    this.playerEnergyBarFill.clear();
    this.playerEnergyBarFill.fillStyle(0x38bdf8, 1);
    this.playerEnergyBarFill.fillRect(145, 666, Math.max(0, 180 * pct), 10);
  }

  public update(time: number, delta: number): void {
    if (this.keyESC && Phaser.Input.Keyboard.JustDown(this.keyESC)) {
      this.togglePause();
    }

    if (this.isPaused || this.isGameOver || this.isVictorySequence) return;

    const deltaSec = delta / 1000;

    // Handle i-frame visual flashing
    const isInvuln = time < this.invulnerableUntil;
    if (isInvuln) {
      this.player.setAlpha(Math.sin(time * 0.03) > 0 ? 0.9 : 0.3);
    } else {
      this.player.setAlpha(1.0);
    }

    // 1. Update Player Movement & Arena Bounds
    this.handlePlayerArenaControls(time, deltaSec);

    // 2. Update Boss Entity
    this.boss.update(time, delta, this.player.y);

    // Update Boss HUD text & bars
    const bossPct = this.boss.hp / NeonBehemoth.MAX_HP;
    this.updateBossHPBar(bossPct);
    this.bossHpText.setText(`${Math.ceil(bossPct * 100)}%`);

    const phase = this.boss.currentPhase;
    const phaseTitles = [
      'PHASE 1 — ENERGY CANNON ASSAULT',
      'PHASE 2 — WARNING! LASER SWEEP ACTIVE',
      'PHASE 3 — OVERDRIVE ASSAULT (WEAK POINT EXPOSED!)',
    ];
    this.bossPhaseText.setText(phaseTitles[phase - 1]);
    this.bossPhaseText.setColor(phase === 3 ? '#f43f5e' : (phase === 2 ? '#f59e0b' : '#00f0ff'));

    // 3. Process Boss Pending Attack Projectiles
    if (this.boss.pendingProjectiles.length > 0) {
      this.boss.pendingProjectiles.forEach((p) => {
        const key = p.type === 'missile' ? 'boss_proj_missile' : 'boss_proj_cannon';
        const sprite = this.add.sprite(p.x, p.y, key).setDepth(9);
        this.bossProjectiles.push({ sprite, proj: p });
      });
      this.boss.pendingProjectiles = [];
    }

    // 4. Update Boss Projectiles Movement & Hit Detection
    for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
      const entry = this.bossProjectiles[i];
      entry.proj.x += entry.proj.vx * deltaSec;
      entry.proj.y += entry.proj.vy * deltaSec;
      entry.sprite.setPosition(entry.proj.x, entry.proj.y);

      // Check hit vs Player
      if (Phaser.Geom.Intersects.RectangleToRectangle(entry.sprite.getBounds(), this.player.getBounds())) {
        const dmg = entry.proj.type === 'missile' ? 12 : 8;
        this.damagePlayer(dmg, time);
        entry.sprite.destroy();
        this.bossProjectiles.splice(i, 1);
        continue;
      }

      // Out of bounds cleanup
      if (entry.proj.x < -40 || entry.proj.x > 1320 || entry.proj.y < -40 || entry.proj.y > 760) {
        entry.sprite.destroy();
        this.bossProjectiles.splice(i, 1);
      }
    }

    // 5. Check Boss Laser Beam vs Player
    const laserBounds = this.boss.getLaserBounds();
    if (laserBounds && Phaser.Geom.Intersects.RectangleToRectangle(laserBounds, this.player.getBounds())) {
      this.damagePlayer(15, time); // 15 damage, buffered by 700ms i-frames
    }

    // 6. Check Boss Body Collision vs Player
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.boss.getBodyBounds(), this.player.getBounds())) {
      this.damagePlayer(15, time);
      this.player.setX(Math.max(60, this.player.x - 80)); // Safe knockback
    }

    // 7. Update Player Projectiles & Collision vs Boss
    const activeProjectiles = this.projectilePool.getActive();
    activeProjectiles.forEach((proj) => proj.update(time));

    const weakPointBounds = this.boss.getWeakPointBounds();
    const bodyBounds = this.boss.getBodyBounds();

    activeProjectiles.forEach((proj) => {
      if (!proj.active) return;

      const projBounds = proj.getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(projBounds, weakPointBounds)) {
        // Weak Point Hit! (2.5x damage)
        const damage = proj.weaponType === 'plasma_cannon' ? 65 : (proj.weaponType === 'shockwave' ? 90 : 18);
        const result = this.boss.takeDamage(damage, true);
        this.audioSystem.playBossWeakPointHit();
        this.particleSystem.emitExplosion(proj.x, proj.y, 8);

        this.showFloatingText(proj.x, proj.y, `+${result.actualDamage} CRIT!`, '#00f0ff');
        proj.despawn();

        if (result.destroyed) this.triggerBossDefeatSequence();
      } else if (Phaser.Geom.Intersects.RectangleToRectangle(projBounds, bodyBounds)) {
        // Body Hit
        const damage = proj.weaponType === 'plasma_cannon' ? 65 : (proj.weaponType === 'shockwave' ? 90 : 18);
        const result = this.boss.takeDamage(damage, false);
        this.audioSystem.playHit();
        this.particleSystem.emitExplosion(proj.x, proj.y, 4);
        proj.despawn();

        if (result.destroyed) this.triggerBossDefeatSequence();
      }
    });

    // 8. Weapon Fire Input (Space, J, or Pointer)
    const isFireDown = this.keyFire?.isDown || this.input.activePointer.isDown;
    const cooldownMs = 1000 / (this.player.loadout.weapon.stats.fireRate || 4);
    if (isFireDown && time - this.lastFireTime > cooldownMs) {
      this.lastFireTime = time;
      this.firePlayerWeapon();
    }
  }

  private handlePlayerArenaControls(time: number, deltaSec: number): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = 360;

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.keyA?.isDown) vx -= speed;
    if (this.cursors.right.isDown || this.keyD?.isDown) vx += speed;
    if (this.cursors.up.isDown || this.keyW?.isDown) vy -= speed;
    if (this.cursors.down.isDown || this.keyS?.isDown) vy += speed;

    body.setVelocity(vx, vy);

    // Bound player to left arena zone (x: 60..750, y: 60..660)
    if (this.player.x > 750) this.player.setX(750);
    if (this.player.x < 60) this.player.setX(60);
    if (this.player.y < 60) this.player.setY(60);
    if (this.player.y > 660) this.player.setY(660);

    // Boost refill & thrust
    if (this.keySpace?.isDown && this.player.currentEnergy > 5) {
      this.player.currentEnergy = Math.max(0, this.player.currentEnergy - 30 * deltaSec);
      body.setVelocity(vx * 1.5, vy * 1.5);
      this.particleSystem.emitThrust(this.player.x - 20, this.player.y, this.player.loadout.jetpack.flameColor, true);
    } else {
      this.player.currentEnergy = Math.min(100, this.player.currentEnergy + 20 * deltaSec);
    }

    this.updatePlayerEnergyBar(this.player.currentEnergy / 100);
  }

  private firePlayerWeapon(): void {
    const wp = this.player.loadout.weapon;

    if (wp.id === 'pulse_blaster') {
      const proj = this.projectilePool.get();
      if (proj) {
        proj.spawn(this.player.x + 20, this.player.y, 900, 0, 'player', 18, wp.id, 'proj_pulse', 0xffffff);
        this.audioSystem.playLaser();
      }
    } else if (wp.id === 'plasma_cannon') {
      const proj = this.projectilePool.get();
      if (proj) {
        proj.spawn(this.player.x + 20, this.player.y, 650, 0, 'player', 65, wp.id, 'proj_plasma', 0xffffff);
        this.audioSystem.playPlasma();
      }
    } else if (wp.id === 'shockwave') {
      // Shockwave clears incoming boss projectiles!
      this.clearBossProjectilesInRadius(this.player.x, this.player.y, 160);

      const proj = this.projectilePool.get();
      if (proj) {
        proj.spawn(this.player.x + 20, this.player.y, 450, 0, 'player', 90, wp.id, 'proj_shockwave', 0xffffff);
        this.audioSystem.playShockwaveSound();
      }
    }
  }

  private clearBossProjectilesInRadius(x: number, y: number, radius: number): void {
    for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
      const entry = this.bossProjectiles[i];
      const dist = Phaser.Math.Distance.Between(x, y, entry.proj.x, entry.proj.y);
      if (dist <= radius) {
        this.particleSystem.emitExplosion(entry.proj.x, entry.proj.y, 4);
        entry.sprite.destroy();
        this.bossProjectiles.splice(i, 1);
      }
    }
  }

  private damagePlayer(amount: number, time: number): void {
    if (this.isGameOver || this.isVictorySequence) return;
    if (time < this.invulnerableUntil) return; // Invulnerability i-frame active!

    // Grant 700ms i-frame buffer
    this.invulnerableUntil = time + 700;

    this.playerHP = Math.max(0, this.playerHP - amount);
    this.updatePlayerHPBar(this.playerHP / this.maxPlayerHP);
    this.playerHpText.setText(`${Math.ceil(this.playerHP)}/${this.maxPlayerHP}`);

    this.cameras.main.shake(120, 0.01);
    this.audioSystem.playHit();
    this.particleSystem.emitExplosion(this.player.x, this.player.y, 6);

    if (this.playerHP <= 0) {
      this.triggerPlayerDeath();
    }
  }

  private triggerPlayerDeath(): void {
    this.isGameOver = true;
    (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    this.player.setAlpha(1.0);
    this.particleSystem.emitExplosion(this.player.x, this.player.y, 25);

    // Clear all active boss projectiles on death
    this.bossProjectiles.forEach((p) => p.sprite.destroy());
    this.bossProjectiles = [];

    const modal = this.add.container(640, 360).setScrollFactor(0).setDepth(200);

    const bg = this.add.graphics();
    bg.fillStyle(0x030712, 0.94);
    bg.fillRect(-230, -160, 460, 320);
    bg.lineStyle(2, 0xef4444, 1);
    bg.strokeRect(-230, -160, 460, 320);

    const title = this.add.text(0, -105, 'RACE PILOT DOWN', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#ef4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const sub = this.add.text(0, -55, 'NEON BEHEMOTH OVERWHELMED YOUR RACER', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '13px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    const btnRetry = this.createModalBtn(0, 5, 'RETRY BOSS', () => this.scene.restart());
    const btnRace = this.createModalBtn(0, 65, 'RETURN TO RACE', () => this.scene.start('RaceScene'));
    const btnMenu = this.createModalBtn(0, 125, 'MAIN MENU', () => this.scene.start('MainMenuScene'));

    modal.add([bg, title, sub, btnRetry, btnRace, btnMenu]);
  }

  private triggerBossDefeatSequence(): void {
    if (this.isVictorySequence || this.hasAwardedVictory) return;
    this.isVictorySequence = true;
    this.hasAwardedVictory = true;

    // Clear active boss projectiles
    this.bossProjectiles.forEach((p) => p.sprite.destroy());
    this.bossProjectiles = [];

    this.audioSystem.playBossDefeat();
    this.cameras.main.shake(2000, 0.03);
    this.cameras.main.flash(500, 255, 255, 255);

    // Staggered explosion bursts across boss body
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 200, () => {
        const rx = this.boss.x + (Math.random() - 0.5) * 160;
        const ry = this.boss.y + (Math.random() - 0.5) * 120;
        this.particleSystem.emitExplosion(rx, ry, 15);
      });
    }

    const banner = this.add.text(640, 300, 'NEON BEHEMOTH DEFEATED!', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '48px',
      color: '#00f0ff',
      fontStyle: 'bold',
      shadow: { blur: 20, color: '#00f0ff', fill: true },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);

    // Save Progress in localStorage ONCE
    const save = SaveSystem.getInstance();
    if (!save.isBossDefeated()) {
      save.addCredits(5000);
    }
    save.unlockJetpack('overdrive_mk2');
    save.setBossDefeated();

    this.time.delayedCall(2500, () => {
      banner.destroy();
      this.scene.start('World1VictoryScene');
    });
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const txt = this.add.text(x, y - 20, text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(150);

    this.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => txt.destroy(),
    });
  }

  private createModalBtn(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.sprite(0, 0, 'ui_button').setDisplaySize(240, 48);
    const txt = this.add.text(0, 0, text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    c.add([bg, txt]);
    c.setInteractive({ useHandCursor: true });

    c.on('pointerover', () => bg.setTint(0x38bdf8));
    c.on('pointerout', () => bg.clearTint());
    c.on('pointerdown', () => {
      this.audioSystem.playClick();
      onClick();
    });
    return c;
  }
}
