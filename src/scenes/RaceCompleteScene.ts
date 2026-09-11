import Phaser from 'phaser';
import { RaceResult } from '../types/race';
import { AudioSystem } from '../systems/AudioSystem';

export class RaceCompleteScene extends Phaser.Scene {
  private results: RaceResult[] = [];

  constructor() {
    super('RaceCompleteScene');
  }

  public init(data: { results: RaceResult[] }): void {
    this.results = data.results || [];
  }

  public create(): void {
    // 1. Dark Overlay
    this.add.rectangle(640, 360, 1280, 720, 0x030712);

    // Background Grid
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00f0ff, 0.1);
    for (let x = 0; x < 1280; x += 40) grid.lineBetween(x, 0, x, 720);
    for (let y = 0; y < 720; y += 40) grid.lineBetween(0, y, 1280, y);

    // Find Player Result
    const playerResult = this.results.find((r) => r.isPlayer);
    const playerPos = playerResult ? playerResult.position : 4;
    const isVictory = playerPos === 1;

    // Play Audio Chime
    if (isVictory) {
      AudioSystem.getInstance().playPickup();
    } else {
      AudioSystem.getInstance().playHit();
    }

    // 2. Header
    const titleText = this.add.text(640, 80, isVictory ? 'VICTORY! RACE WIN' : 'RACE COMPLETE', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '42px',
      color: isVictory ? '#00f0ff' : '#f97316',
      fontStyle: 'bold',
      shadow: { blur: 15, color: isVictory ? '#00f0ff' : '#f97316', fill: true },
    }).setOrigin(0.5);

    const subText = isVictory
      ? 'WORLD 1: NEON DISTRICT — 1ST PLACE! BOSS ARENA UNLOCKED!'
      : `WORLD 1: NEON DISTRICT — FINISHING POSITION: ${playerPos}${['ST', 'ND', 'RD', 'TH'][playerPos - 1]} (BOSS ARENA LOCKED)`;

    this.add.text(640, 130, subText, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '17px',
      color: isVictory ? '#facc15' : '#94a3b8',
      fontStyle: isVictory ? 'bold' : 'normal',
    }).setOrigin(0.5);

    // 3. Results Leaderboard Table
    const tableContainer = this.add.container(640, 330);
    const tableBg = this.add.graphics();
    tableBg.fillStyle(0x0f172a, 0.9);
    tableBg.fillRect(-450, -140, 900, 280);
    tableBg.lineStyle(2, 0x00f0ff, 0.8);
    tableBg.strokeRect(-450, -140, 900, 280);
    tableContainer.add(tableBg);

    // Table Headers
    const headers = ['POS', 'PILOT', 'RACE TIME', 'TOP SPEED', 'REWARD'];
    const colX = [-380, -220, 0, 180, 340];

    headers.forEach((h, idx) => {
      const txt = this.add.text(colX[idx], -115, h, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '14px',
        color: '#00f0ff',
        fontStyle: 'bold',
      }).setOrigin(idx === 1 ? 0 : 0.5, 0.5);
      tableContainer.add(txt);
    });

    // Divider Line
    const divLine = this.add.graphics();
    divLine.lineStyle(1, 0x334155, 1);
    divLine.lineBetween(-430, -95, 430, -95);
    tableContainer.add(divLine);

    // Render Rows
    this.results.forEach((res, idx) => {
      const rowY = -60 + idx * 50;

      const posStr = `${res.position}${['ST', 'ND', 'RD', 'TH'][res.position - 1]}`;
      const nameStr = res.racerName;
      const mins = Math.floor(res.time / 60).toString().padStart(2, '0');
      const secs = (res.time % 60).toFixed(1).padStart(4, '0');
      const timeStr = `${mins}:${secs}`;
      const speedStr = `${res.topSpeed} KM/H`;
      const rewardStr = `+${res.rewardCredits} POINTS`;

      const isP = res.isPlayer;
      const rowColor = isP ? '#00f0ff' : '#f8fafc';

      if (isP) {
        const rowBg = this.add.graphics();
        rowBg.fillStyle(0x00f0ff, 0.15);
        rowBg.fillRect(-430, rowY - 20, 860, 40);
        tableContainer.add(rowBg);
      }

      const pText = this.add.text(colX[0], rowY, posStr, { fontFamily: 'Segoe UI, sans-serif', fontSize: '18px', color: rowColor, fontStyle: 'bold' }).setOrigin(0.5);
      const nText = this.add.text(colX[1], rowY, nameStr, { fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: rowColor, fontStyle: isP ? 'bold' : 'normal' }).setOrigin(0, 0.5);
      const tText = this.add.text(colX[2], rowY, timeStr, { fontFamily: 'Consolas, monospace', fontSize: '16px', color: rowColor }).setOrigin(0.5);
      const sText = this.add.text(colX[3], rowY, speedStr, { fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: '#facc15' }).setOrigin(0.5);
      const rText = this.add.text(colX[4], rowY, rewardStr, { fontFamily: 'Segoe UI, sans-serif', fontSize: '16px', color: '#22c55e', fontStyle: 'bold' }).setOrigin(0.5);

      tableContainer.add([pText, nText, tText, sText, rText]);
    });

    // 4. Action Buttons
    if (isVictory) {
      this.createActionButton(320, 575, 'RESTART RACE', () => this.scene.start('RaceScene'));
      this.createActionButton(640, 575, 'ENTER BOSS ARENA', () => this.scene.start('World1BossScene'));
      this.createActionButton(960, 575, 'MAIN MENU', () => this.scene.start('MainMenuScene'));
    } else {
      this.createActionButton(480, 575, 'RESTART RACE', () => this.scene.start('RaceScene'));
      this.createActionButton(800, 575, 'MAIN MENU', () => this.scene.start('MainMenuScene'));
    }

    // 5. Developer Shortcut: Key B to enter Boss Scene directly
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-B', () => {
        this.scene.start('World1BossScene');
      });
    }
  }

  private createActionButton(x: number, y: number, text: string, callback: () => void): void {
    const container = this.add.container(x, y);
    const bg = this.add.sprite(0, 0, 'ui_button').setDisplaySize(240, 56);
    const txt = this.add.text(0, 0, text, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, txt]);
    container.setInteractive(new Phaser.Geom.Rectangle(-120, -28, 240, 56), Phaser.Geom.Rectangle.Contains);

    container.on('pointerover', () => bg.setTint(0x38bdf8));
    container.on('pointerout', () => bg.clearTint());
    container.on('pointerdown', () => {
      AudioSystem.getInstance().playClick();
      callback();
    });
  }
}
