import Phaser from 'phaser';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { JETPACKS } from '../data/jetpacks';

export class World1VictoryScene extends Phaser.Scene {
  private isTransitioning: boolean = false;

  constructor() {
    super('World1VictoryScene');
  }

  public create(): void {
    console.log('[VictoryDebug] World1VictoryScene create() reached');
    this.isTransitioning = false;

    AudioSystem.getInstance().playVictoryChime();

    // Ensure OVERDRIVE MK-II is unlocked in SaveSystem
    SaveSystem.getInstance().unlockJetpack('overdrive_mk2');
    SaveSystem.getInstance().setBossDefeated();

    // 1. Background
    this.add.rectangle(640, 360, 1280, 720, 0x030712);

    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00f0ff, 0.1);
    for (let x = 0; x < 1280; x += 40) grid.lineBetween(x, 0, x, 720);
    for (let y = 0; y < 720; y += 40) grid.lineBetween(0, y, 1280, y);

    // 2. Header
    this.add.text(640, 75, 'WORLD 1 COMPLETE!', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '46px',
      color: '#00f0ff',
      fontStyle: 'bold',
      shadow: { blur: 20, color: '#00f0ff', fill: true },
    }).setOrigin(0.5);

    this.add.text(640, 130, 'NEON DISTRICT CHAMPION & BEHEMOTH SLAYER', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    // 3. Rewards Container
    const rewardsContainer = this.add.container(640, 370);

    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.9);
    bg.fillRect(-400, -180, 800, 360);
    bg.lineStyle(2, 0x00f0ff, 0.8);
    bg.strokeRect(-400, -180, 800, 360);
    rewardsContainer.add(bg);

    // Reward 1: Points
    const crText = this.add.text(0, -135, '+5,000 POINTS AWARDED', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '26px',
      color: '#22c55e',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const totalPoints = SaveSystem.getInstance().getPoints();
    const totalCrText = this.add.text(0, -100, `TOTAL POINTS: ${totalPoints.toLocaleString()}`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#facc15',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Reward 2: Equipment Unlock Banner
    const unlockTitle = this.add.text(0, -50, 'NEW EQUIPMENT UNLOCKED!', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      color: '#e879f9',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // OVERDRIVE MK-II Card
    const mk2Data = JETPACKS.find((j) => j.id === 'overdrive_mk2') || JETPACKS[3];

    const cardContainer = this.add.container(0, 45);

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1e293b, 0.95);
    cardBg.fillRect(-320, -65, 640, 130);
    cardBg.lineStyle(2, 0xe879f9, 1);
    cardBg.strokeRect(-320, -65, 640, 130);

    const sprite = this.add.sprite(-240, 0, `jp_${mk2Data.id}`).setScale(1.8);
    const jpName = this.add.text(-160, -42, mk2Data.name, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    const jpType = this.add.text(-160, -14, 'UNLOCKED • ' + mk2Data.type, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '13px',
      color: '#22c55e',
      fontStyle: 'bold',
    });

    const jpDesc = this.add.text(-160, 10, mk2Data.description, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      color: '#94a3b8',
      wordWrap: { width: 440 },
    });

    // Stats Preview
    const statText = this.add.text(180, -40, `THRUST: 10/10\nBOOST: 9/10\nEFFICIENCY: 7/10\nSTABILITY: 8/10`, {
      fontFamily: 'Consolas, monospace',
      fontSize: '12px',
      color: '#38bdf8',
    });

    cardContainer.add([cardBg, sprite, jpName, jpType, jpDesc, statText]);
    rewardsContainer.add([crText, totalCrText, unlockTitle, cardContainer]);

    // 4. Action Buttons
    this.createActionButton(440, 620, 'CONTINUE TO GARAGE', () => this.scene.start('CharacterSelectScene'));
    this.createActionButton(840, 620, 'MAIN MENU', () => this.scene.start('MainMenuScene'));
  }

  private createActionButton(x: number, y: number, text: string, callback: () => void): void {
    const bg = this.add.sprite(x, y, 'ui_button');
    bg.setDisplaySize(280, 56);

    const txt = this.add.text(x, y, text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      if (!this.isTransitioning) {
        bg.setTint(0x38bdf8);
        txt.setColor('#00f0ff');
      }
    });

    bg.on('pointerout', () => {
      if (!this.isTransitioning) {
        bg.clearTint();
        txt.setColor('#ffffff');
      }
    });

    bg.on('pointerdown', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      bg.disableInteractive();
      bg.setTint(0x00f0ff);
      AudioSystem.getInstance().playClick();
      console.log(`[VictoryDebug] Button clicked: "${text}", transitioning scene...`);
      callback();
    });
  }
}
