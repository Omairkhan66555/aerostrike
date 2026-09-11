import Phaser from 'phaser';
import { TextureGenerator } from '../systems/TextureGenerator';
import { AudioSystem } from '../systems/AudioSystem';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  public create(): void {
    // 1. Loading Text
    const titleText = this.add.text(640, 320, 'INITIALIZING AEROSTRIKE ARCHITECTURE...', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const subText = this.add.text(640, 360, 'GENERATING ASSETS & POPULATING OBJECT POOLS', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    // Progress Bar Outer
    const barBox = this.add.graphics();
    barBox.fillStyle(0x0f172a, 0.8);
    barBox.fillRect(440, 410, 400, 20);
    barBox.lineStyle(2, 0x00f0ff, 0.8);
    barBox.strokeRect(440, 410, 400, 20);

    const barFill = this.add.graphics();
    barFill.fillStyle(0x00f0ff, 1);

    // 2. Generate Cached Textures
    this.time.delayedCall(100, () => {
      barFill.fillRect(442, 412, 180, 16);
      TextureGenerator.generateAll(this);
    });

    // 3. Initialize Audio
    this.time.delayedCall(300, () => {
      barFill.fillRect(442, 412, 396, 16);
      AudioSystem.getInstance();
    });

    // 4. Transition to Main Menu
    this.time.delayedCall(600, () => {
      this.scene.start('MainMenuScene');
    });
  }
}
