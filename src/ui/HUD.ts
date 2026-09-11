import Phaser from 'phaser';
import { RacerProgress } from '../types/race';
import { WeaponData } from '../types/weapon';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  // Text Elements
  private posText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;

  // Graphics Elements
  private progressBarGraphics!: Phaser.GameObjects.Graphics;
  private energyBarGraphics!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setScrollFactor(0); // Fixed screen overlay
    this.container.setDepth(100);

    this.createUIElements();
  }

  private createUIElements(): void {
    // Top Bar Background
    const bgGraphics = this.scene.add.graphics();
    bgGraphics.fillStyle(0x030712, 0.75);
    bgGraphics.fillRect(0, 0, 1280, 70);
    bgGraphics.lineStyle(1, 0x00f0ff, 0.3);
    bgGraphics.lineBetween(0, 70, 1280, 70);
    this.container.add(bgGraphics);

    // 1. POSITION (1ST - 4TH)
    this.posText = this.scene.add.text(30, 15, 'POS: 1ST', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '28px',
      color: '#00f0ff',
      fontStyle: 'bold',
    });
    this.container.add(this.posText);

    // 2. TIME
    this.timeText = this.scene.add.text(180, 22, 'TIME: 00:00.0', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#94a3b8',
    });
    this.container.add(this.timeText);

    // 3. PROGRESS BAR (CENTER)
    const progLabel = this.scene.add.text(640, 12, 'TRACK PROGRESS', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      color: '#94a3b8',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.progressText = this.scene.add.text(640, 48, '0%', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.progressBarGraphics = this.scene.add.graphics();
    this.container.add([progLabel, this.progressText, this.progressBarGraphics]);

    // 4. SPEED (TOP RIGHT)
    this.speedText = this.scene.add.text(1250, 15, '0 KM/H', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '28px',
      color: '#facc15',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.container.add(this.speedText);

    // 5. BOTTOM ENERGY & WEAPON STATUS
    const bottomBg = this.scene.add.graphics();
    bottomBg.fillStyle(0x030712, 0.75);
    bottomBg.fillRect(0, 650, 1280, 70);
    bottomBg.lineStyle(1, 0x00f0ff, 0.3);
    bottomBg.lineBetween(0, 650, 1280, 650);
    this.container.add(bottomBg);

    // BOOST ENERGY GAUGE (BOTTOM LEFT)
    const energyLabel = this.scene.add.text(30, 662, 'BOOST ENERGY', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      color: '#00f0ff',
      fontStyle: 'bold',
    });
    this.energyBarGraphics = this.scene.add.graphics();
    this.container.add([energyLabel, this.energyBarGraphics]);

    // WEAPON DISPLAY (BOTTOM RIGHT)
    this.weaponText = this.scene.add.text(1250, 665, 'WEAPON: PULSE BLASTER', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#38bdf8',
      fontStyle: 'bold',
    }).setOrigin(1, 0);
    this.container.add(this.weaponText);
  }

  public updateHUD(playerProgress: RacerProgress, playerEnergy: number, equippedWeapon: WeaponData): void {
    // 1. Position Text
    const posSuffix = ['ST', 'ND', 'RD', 'TH'][Math.min(3, playerProgress.position - 1)];
    this.posText.setText(`POS: ${playerProgress.position}${posSuffix}`);
    this.posText.setColor(playerProgress.position === 1 ? '#00f0ff' : playerProgress.position === 2 ? '#38bdf8' : '#f97316');

    // 2. Lap Time
    const mins = Math.floor(playerProgress.lapTime / 60).toString().padStart(2, '0');
    const secs = (playerProgress.lapTime % 60).toFixed(1).padStart(4, '0');
    this.timeText.setText(`TIME: ${mins}:${secs}`);

    // 3. Speed
    this.speedText.setText(`${playerProgress.speed} KM/H`);

    // 4. Progress Bar
    const pct = Math.round(playerProgress.progressPercent);
    this.progressText.setText(`${pct}%`);

    this.progressBarGraphics.clear();
    const barW = 320;
    const barH = 14;
    const fillW = (pct / 100) * barW;
    const startX = 640 - barW / 2;
    const startY = 30;

    this.progressBarGraphics.fillStyle(0x1e293b, 0.8);
    this.progressBarGraphics.fillRect(startX, startY, barW, barH);
    this.progressBarGraphics.fillStyle(0x00f0ff, 1);
    this.progressBarGraphics.fillRect(startX, startY, fillW, barH);
    this.progressBarGraphics.lineStyle(1, 0x030712, 0.8);
    this.progressBarGraphics.strokeRect(startX, startY, barW, barH);

    // 5. Energy Bar
    this.energyBarGraphics.clear();
    const eBarW = 240;
    const eBarH = 16;
    const eFillW = (playerEnergy / 100) * eBarW;
    this.energyBarGraphics.fillStyle(0x1e293b, 0.8);
    this.energyBarGraphics.fillRect(30, 684, eBarW, eBarH);
    this.energyBarGraphics.fillStyle(playerEnergy > 25 ? 0x00f0ff : 0xef4444, 1);
    this.energyBarGraphics.fillRect(30, 684, eFillW, eBarH);

    // 6. Weapon Text
    this.weaponText.setText(`WEAPON: ${equippedWeapon.name}`);
  }

  public destroy(): void {
    this.container.destroy();
  }
}
