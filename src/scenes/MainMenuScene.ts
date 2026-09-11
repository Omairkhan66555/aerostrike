import Phaser from 'phaser';
import { AudioSystem } from '../systems/AudioSystem';

export class MainMenuScene extends Phaser.Scene {
  private bgParallax!: Phaser.GameObjects.TileSprite;
  private isTransitioning: boolean = false;

  constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    this.isTransitioning = false;

    // 1. Dark Atmospheric City Parallax Background
    this.bgParallax = this.add.tileSprite(640, 360, 1280, 720, 'bg_city_far');

    // Overlay darkness & tech grid accent
    const overlay = this.add.graphics();
    overlay.fillStyle(0x030712, 0.45);
    overlay.fillRect(0, 0, 1280, 720);

    overlay.lineStyle(1, 0x00f0ff, 0.1);
    for (let x = 0; x < 1280; x += 40) {
      overlay.lineBetween(x, 0, x, 720);
    }
    for (let y = 0; y < 720; y += 40) {
      overlay.lineBetween(0, y, 1280, y);
    }

    // 2. Futuristic Title Header & Sci-Fi Logo: AEROSTRIKE
    const accentBars = this.add.graphics();
    // Top scanline bar
    accentBars.fillStyle(0x00f0ff, 0.8);
    accentBars.fillRect(440, 110, 400, 3);
    accentBars.fillStyle(0xffffff, 1);
    accentBars.fillRect(620, 109, 40, 5);

    // Bottom scanline bar
    accentBars.fillStyle(0x00f0ff, 0.8);
    accentBars.fillRect(440, 215, 400, 3);
    accentBars.fillStyle(0xffffff, 1);
    accentBars.fillRect(620, 214, 40, 5);

    // Layered Title Text for Crisp Depth & Controlled Cyan Glow
    const titleGlow = this.add.text(640, 162, 'AEROSTRIKE', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '76px',
      color: '#00f0ff',
      fontStyle: 'bold',
      shadow: { blur: 25, color: '#00f0ff', fill: true },
    }).setOrigin(0.5).setAlpha(0.6);

    const titleMain = this.add.text(640, 162, 'AEROSTRIKE', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '76px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { blur: 6, color: '#0284c7', fill: true },
    }).setOrigin(0.5);

    // Synchronized pulsing logo animation
    this.tweens.add({
      targets: [titleGlow, titleMain],
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const subTitle = this.add.text(640, 245, 'FUTURISTIC HIGH-SPEED JETPACK RACING & COMBAT', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
      letterSpacing: 4,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // 3. Menu Buttons (Identical 300x58px bounds, 85px step spacing)
    const buttons = [
      { text: 'START RACE ▶', isPrimary: true, action: () => this.scene.start('CharacterSelectScene') },
      { text: 'CHARACTERS & GARAGE', isPrimary: false, action: () => this.scene.start('CharacterSelectScene') },
      { text: 'HOW TO PLAY', isPrimary: false, action: () => this.showHowToPlayModal() },
    ];

    buttons.forEach((btn, index) => {
      const btnY = 345 + index * 85;
      this.createMenuButton(640, btnY, btn.text, btn.isPrimary, btn.action);
    });

    // 4. Version Footer
    this.add.text(640, 680, 'v1.1.0 MILESTONE 2: WORLD 1 BOSS | PHASER 3 • TYPESCRIPT • HOWLER', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      color: '#475569',
    }).setOrigin(0.5);

    // Developer Shortcut: Key B to enter World1BossScene directly
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-B', () => {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.scene.start('World1BossScene');
      });
    }
  }

  public update(time: number, delta: number): void {
    if (this.bgParallax) {
      this.bgParallax.tilePositionX += delta * 0.05;
    }
  }

  private createMenuButton(
    x: number,
    y: number,
    text: string,
    isPrimary: boolean,
    callback: () => void
  ): void {
    const container = this.add.container(x, y);

    const textureKey = isPrimary ? 'ui_button_primary' : 'ui_button';
    const bg = this.add.sprite(0, 0, textureKey);
    bg.setDisplaySize(300, 58);

    const txt = this.add.text(0, 0, text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: isPrimary ? '20px' : '17px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: isPrimary ? { blur: 12, color: '#00f0ff', fill: true } : undefined,
    }).setOrigin(0.5);

    container.add([bg, txt]);

    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      if (!this.isTransitioning) {
        if (isPrimary) {
          bg.setTint(0x67e8f9);
          txt.setColor('#ffffff');
          container.setScale(1.04);
        } else {
          bg.setTint(0x38bdf8);
          txt.setColor('#00f0ff');
          container.setScale(1.02);
        }
        AudioSystem.getInstance().playClick();
      }
    });

    bg.on('pointerout', () => {
      if (!this.isTransitioning) {
        bg.clearTint();
        txt.setColor('#ffffff');
        container.setScale(1.0);
      }
    });

    bg.on('pointerdown', () => {
      if (this.isTransitioning) return;
      if (!text.includes('HOW TO PLAY')) {
        this.isTransitioning = true;
        bg.disableInteractive();
      }
      container.setScale(0.97);
      bg.setTint(0x00f0ff);
      AudioSystem.getInstance().playClick();
      callback();
    });
  }

  private showHowToPlayModal(): void {
    const modal = this.add.container(640, 360);

    const bg = this.add.graphics();
    bg.fillStyle(0x030712, 0.95);
    bg.fillRect(-350, -220, 700, 440);
    bg.lineStyle(2, 0x00f0ff, 1);
    bg.strokeRect(-350, -220, 700, 440);
    modal.add(bg);

    const title = this.add.text(0, -180, 'CONTROLS & PILOT GUIDE', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '24px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const instructions = [
      'W / UP / SPACE  : Jetpack Vertical Thrust',
      'S / DOWN        : Dive Descent',
      'A / D           : Horizontal Steering & Trim',
      'SHIFT           : High-Speed Boost (Consumes Energy)',
      'J / LEFT CLICK  : Fire Equipped Weapon System',
      'R               : Quick Restart',
      'ESC             : Pause Race',
    ].join('\n\n');

    const text = this.add.text(0, -20, instructions, {
      fontFamily: 'Consolas, monospace',
      fontSize: '16px',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);

    const closeBtn = this.add.text(0, 170, '[ CLOSE ]', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#ef4444',
      fontStyle: 'bold',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    closeBtn.on('pointerdown', () => {
      AudioSystem.getInstance().playClick();
      modal.destroy();
    });

    modal.add([title, text, closeBtn]);
  }
}
