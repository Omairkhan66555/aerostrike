import Phaser from 'phaser';
import { PlayerRacer } from '../entities/PlayerRacer';
import { AIRacer } from '../entities/AIRacer';
import { Projectile } from '../entities/Projectile';
import { Obstacle } from '../entities/Obstacle';
import { Pickup } from '../entities/Pickup';
import { LoadoutSystem } from '../systems/LoadoutSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { ObjectPool } from '../systems/ObjectPool';
import { CombatSystem } from '../systems/CombatSystem';
import { RaceSystem } from '../systems/RaceSystem';
import { AISystem } from '../systems/AISystem';
import { HUD } from '../ui/HUD';
import { NEON_DISTRICT_LEVEL } from '../data/levels';

interface BackgroundTrafficCar {
  sprite: Phaser.GameObjects.Sprite;
  speed: number;
}

export class RaceScene extends Phaser.Scene {
  // Parallax Layers
  private bgFar!: Phaser.GameObjects.TileSprite;
  private bgMid!: Phaser.GameObjects.TileSprite;
  private bgFore!: Phaser.GameObjects.TileSprite;

  // Subtle Background Sky Traffic
  private trafficCars: BackgroundTrafficCar[] = [];

  // Entities
  private player!: PlayerRacer;
  private rivals: AIRacer[] = [];
  private obstacles: Obstacle[] = [];
  private pickups: Pickup[] = [];

  // Systems & Pools
  private particleSystem!: ParticleSystem;
  private audioSystem!: AudioSystem;
  private projectilePool!: ObjectPool<Projectile>;
  private combatSystem!: CombatSystem;
  private raceSystem!: RaceSystem;
  private aiSystem!: AISystem;

  // UI & Pause
  private hud!: HUD;
  private isPaused: boolean = false;
  private pauseModal?: Phaser.GameObjects.Container;
  private keyESC!: Phaser.Input.Keyboard.Key;
  private keyR!: Phaser.Input.Keyboard.Key;

  private isFirstUpdate: boolean = true;

  constructor() {
    super('RaceScene');
    console.log('[RaceDebug] RaceScene constructor reached');
  }

  public init(data: unknown): void {
    console.log('[RaceDebug] RaceScene init() reached with data:', data);
  }

  public create(): void {
    console.log('[RaceDebug] RaceScene create() STARTED');
    const level = NEON_DISTRICT_LEVEL;

    // Reset state
    this.isPaused = false;
    this.isFirstUpdate = true;

    // 1. Setup Camera & World Bounds
    this.cameras.main.setBounds(0, 0, level.trackLength + 1000, 720);
    this.physics.world.setBounds(0, 0, level.trackLength + 1000, 720);
    console.log('[RaceDebug] World bounds & camera set');

    // 2. Parallax Backgrounds (Dark Cinematic Night Megacity - High Readability)
    this.bgFar = this.add.tileSprite(640, 360, 1280, 720, 'bg_city_far').setScrollFactor(0).setDepth(-10);
    this.bgMid = this.add.tileSprite(640, 360, 1280, 720, 'bg_city_mid').setScrollFactor(0).setDepth(-9);
    this.bgFore = this.add.tileSprite(640, 360, 1280, 720, 'bg_city_fore').setScrollFactor(0).setDepth(-7);
    console.log('[RaceDebug] Dark night megacity parallax backgrounds created');

    // Subtle Background Traffic (Dim, Small, Slow)
    this.trafficCars = [];
    for (let i = 0; i < 4; i++) {
      const car = this.add.sprite(Math.random() * 1280, 180 + i * 80, 'tex_flying_car_dim');
      car.setScrollFactor(0.25).setDepth(-8).setAlpha(0.35);
      this.trafficCars.push({
        sprite: car,
        speed: 30 + Math.random() * 40,
      });
    }

    // 3. Audio & Particle Systems
    this.audioSystem = AudioSystem.getInstance();
    this.particleSystem = new ParticleSystem(this);
    console.log('[RaceDebug] Audio and ParticleSystem created');

    // 4. Object Pool for Projectiles (initial pool 30 instances)
    this.projectilePool = new ObjectPool<Projectile>(() => new Projectile(this), 30);
    console.log('[RaceDebug] Projectile pool created');

    // 5. Instantiate Player & AI Rivals
    const playerLoadout = LoadoutSystem.getInstance().getPlayerLoadout();
    console.log('[RaceDebug] Player loadout loaded:', playerLoadout);
    this.player = new PlayerRacer(this, 200, level.startY, playerLoadout);
    console.log('[RaceDebug] Player created successfully');

    const rivalDefs = LoadoutSystem.getInstance().getAIRivalLoadouts();
    this.rivals = rivalDefs.map((def, idx) => {
      return new AIRacer(this, 160 - idx * 40, level.startY + (idx + 1) * 50 - 75, def.name, def.name, def.loadout);
    });
    console.log('[RaceDebug] AI Rivals created successfully:', this.rivals.length);

    const allRacers = [this.player, ...this.rivals];

    // 6. Camera Follow Player with Smooth Deadzone
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08, -300, 0);

    // 7. Instantiate Track Obstacles & Pickups
    this.obstacles = [];
    this.pickups = [];

    level.elements.forEach((elem) => {
      if (elem.type === 'energy_pickup') {
        const p = new Pickup(this, elem.x, elem.y);
        this.pickups.push(p);
      } else {
        const obs = new Obstacle(this, elem);
        this.obstacles.push(obs);
      }
    });
    console.log('[RaceDebug] Track obstacles created:', this.obstacles.length, 'pickups:', this.pickups.length);

    // 8. Systems Initialization
    this.combatSystem = new CombatSystem(this, this.particleSystem, this.audioSystem);
    this.raceSystem = new RaceSystem(level.trackLength, allRacers);
    this.aiSystem = new AISystem(this.rivals);
    this.hud = new HUD(this);
    console.log('[RaceDebug] Race systems and HUD initialized');

    this.raceSystem.startRace(this.time.now);

    // 9. Input & Keybindings
    if (this.input.keyboard) {
      this.keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
    console.log('[RaceDebug] RaceScene create() COMPLETED SUCCESSFULLY');
  }

  public update(time: number, delta: number): void {
    if (this.isFirstUpdate) {
      console.log('[RaceDebug] RaceScene FIRST update() reached!');
      this.isFirstUpdate = false;
    }

    // Check Pause & Restart keys
    if (Phaser.Input.Keyboard.JustDown(this.keyESC)) {
      this.togglePause();
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.scene.restart();
      return;
    }

    if (this.isPaused) return;

    const deltaSec = delta / 1000;

    // 1. Parallax Scroll & Background Traffic Updates
    const camX = this.cameras.main.scrollX;
    this.bgFar.tilePositionX = camX * 0.05;
    this.bgMid.tilePositionX = camX * 0.25;
    this.bgFore.tilePositionX = camX * 0.70;

    // Update subtle background traffic
    this.trafficCars.forEach((car) => {
      car.sprite.x += car.speed * deltaSec;
      if (car.sprite.x > 1320) {
        car.sprite.x = -40;
      }
    });

    // 2. Player Input & Physics
    this.player.handleInput(time, delta, this.particleSystem, this.audioSystem, this.projectilePool);

    // 3. AI Racers System Update
    this.aiSystem.update(time, delta, this.particleSystem, this.projectilePool, this.player.x);

    // 4. Update Obstacles Movement
    this.obstacles.forEach((obs) => obs.update(deltaSec));

    // 5. Update Projectiles
    const activeProjectiles = this.projectilePool.getActive();
    activeProjectiles.forEach((proj) => proj.update(time));

    // 6. Collision & Overlap Processing
    const allRacers = [this.player, ...this.rivals];

    allRacers.forEach((racer) => {
      const racerBounds = racer.getBounds();

      // Racer vs Projectiles
      activeProjectiles.forEach((proj) => {
        if (proj.active && proj.ownerId !== racer.racerId) {
          if (Phaser.Geom.Intersects.RectangleToRectangle(proj.getBounds(), racerBounds)) {
            this.combatSystem.handleProjectileRacerOverlap(proj, racer);
          }
        }
      });

      // Racer vs Obstacles
      this.obstacles.forEach((obs) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(obs.getBounds(), racerBounds)) {
          this.combatSystem.handleRacerObstacleOverlap(racer, obs);
        }
      });

      // Racer vs Pickups
      this.pickups.forEach((pickup) => {
        if (pickup.active && Phaser.Geom.Intersects.RectangleToRectangle(pickup.getBounds(), racerBounds)) {
          this.combatSystem.handleRacerPickupOverlap(racer, pickup);
        }
      });
    });

    // 7. Race System Progress Update
    const progressList = this.raceSystem.update(time);

    // Update HUD overlay
    const playerProg = progressList.find((p) => p.isPlayer);
    if (playerProg) {
      this.hud.updateHUD(playerProg, this.player.currentEnergy, this.player.loadout.weapon);
    }

    // 8. Check Race Completion
    if (this.raceSystem.isRaceFinished) {
      const results = this.raceSystem.getFinalResults(time);
      this.scene.start('RaceCompleteScene', { results });
    }
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.audioSystem.stopThrustLoop();
      this.showPauseModal();
    } else if (this.pauseModal) {
      this.pauseModal.destroy();
    }
  }

  private showPauseModal(): void {
    this.pauseModal = this.add.container(640, 360).setScrollFactor(0).setDepth(200);

    const bg = this.add.graphics();
    bg.fillStyle(0x030712, 0.9);
    bg.fillRect(-200, -150, 400, 300);
    bg.lineStyle(2, 0x00f0ff, 1);
    bg.strokeRect(-200, -150, 400, 300);

    const title = this.add.text(0, -100, 'PAUSED', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '32px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const btnResume = this.createPauseBtn(0, -30, 'RESUME RACE', () => this.togglePause());
    const btnRestart = this.createPauseBtn(0, 30, 'RESTART RACE', () => {
      this.togglePause();
      this.scene.restart();
    });
    const btnMenu = this.createPauseBtn(0, 90, 'MAIN MENU', () => {
      this.togglePause();
      this.scene.start('MainMenuScene');
    });

    this.pauseModal.add([bg, title, btnResume, btnRestart, btnMenu]);
  }

  private createPauseBtn(x: number, y: number, text: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const bg = this.add.sprite(0, 0, 'ui_button').setDisplaySize(220, 44);
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
      AudioSystem.getInstance().playClick();
      onClick();
    });
    return c;
  }
}
