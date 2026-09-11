import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { JETPACKS } from '../data/jetpacks';
import { WEAPONS } from '../data/weapons';
import { CharacterData } from '../types/character';
import { JetpackData } from '../types/jetpack';
import { WeaponData } from '../types/weapon';
import { LoadoutSystem } from '../systems/LoadoutSystem';
import { StatBar } from '../ui/StatBar';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';

export class CharacterSelectScene extends Phaser.Scene {
  private selectedChar: CharacterData = CHARACTERS[0];
  private selectedJetpack: JetpackData = JETPACKS[0];
  private selectedWeapon: WeaponData = WEAPONS[0];
  private isTransitioning: boolean = false;

  // UI Containers & Cards
  private charCards: Phaser.GameObjects.Container[] = [];
  private jetpackCards: Phaser.GameObjects.Container[] = [];
  private weaponCards: Phaser.GameObjects.Container[] = [];

  // Live Model Preview
  private previewCharSprite!: Phaser.GameObjects.Sprite;
  private previewJetpackSprite!: Phaser.GameObjects.Sprite;
  private previewWeaponSprite!: Phaser.GameObjects.Sprite;

  // Stat Bars
  private statSpeed!: StatBar;
  private statThrust!: StatBar;
  private statDamage!: StatBar;
  private statDurability!: StatBar;

  // Summary Text
  private summaryText!: Phaser.GameObjects.Text;

  constructor() {
    super('CharacterSelectScene');
  }

  public create(): void {
    console.log('[RaceDebug] CharacterSelectScene create() reached');
    this.isTransitioning = false;

    // Load active player loadout from LoadoutSystem
    const activeLoadout = LoadoutSystem.getInstance().getPlayerLoadout();
    if (activeLoadout) {
      if (activeLoadout.character) this.selectedChar = activeLoadout.character;
      if (activeLoadout.jetpack && SaveSystem.getInstance().isJetpackUnlocked(activeLoadout.jetpack.id)) {
        this.selectedJetpack = activeLoadout.jetpack;
      }
      if (activeLoadout.weapon) this.selectedWeapon = activeLoadout.weapon;
    }

    // 1. Background
    this.add.rectangle(640, 360, 1280, 720, 0x030712);

    // Grid pattern
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00f0ff, 0.1);
    for (let x = 0; x < 1280; x += 40) grid.lineBetween(x, 0, x, 720);
    for (let y = 0; y < 720; y += 40) grid.lineBetween(0, y, 1280, y);

    // 2. Header & Points
    this.add.text(640, 32, 'SELECT YOUR RACER & LOADOUT', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '30px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const points = SaveSystem.getInstance().getPoints();
    this.add.text(1240, 32, `POINTS: ${points.toLocaleString()}`, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '15px',
      color: '#facc15',
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // 3. Selection Panels
    this.createCharacterSelector(40, 95);
    this.createJetpackSelector(40, 310);
    this.createWeaponSelector(40, 480);

    // 4. Right Side: Model Preview & Build Summary
    this.createPreviewPanel(850, 100);

    // 5. Bottom Navigation Buttons
    this.createBottomButtons();

    // 6. Developer Shortcut: Key B jumps directly to Boss Arena
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-B', () => {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        LoadoutSystem.getInstance().setPlayerLoadout({
          character: this.selectedChar,
          jetpack: this.selectedJetpack,
          weapon: this.selectedWeapon,
        });
        this.scene.start('World1BossScene');
      });
    }
  }

  private createCharacterSelector(startX: number, startY: number): void {
    this.add.text(startX, startY, '1. CHOOSE HUMANOID RACER', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#38bdf8',
      fontStyle: 'bold',
    });

    CHARACTERS.forEach((char, idx) => {
      const cardX = startX + 70 + idx * 155;
      const cardY = startY + 95;

      const card = this.add.container(cardX, cardY);
      card.setSize(140, 120);

      const bg = this.add.graphics();

      const sprite = this.add.sprite(0, -20, `char_${char.id}`).setScale(0.95);
      const name = this.add.text(0, 24, char.name, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '13px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5, 0.5);

      const role = this.add.text(0, 42, char.role, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '10px',
        color: '#94a3b8',
      }).setOrigin(0.5, 0.5);

      card.add([bg, sprite, name, role]);
      card.setInteractive({ useHandCursor: true });

      const redraw = () => {
        bg.clear();
        const isSel = this.selectedChar.id === char.id;
        bg.fillStyle(isSel ? 0x0f172a : 0x1e293b, 0.9);
        bg.fillRect(-70, -60, 140, 120);
        bg.lineStyle(isSel ? 3 : 1, isSel ? 0x00f0ff : 0x475569);
        bg.strokeRect(-70, -60, 140, 120);
      };

      card.on('pointerdown', () => {
        AudioSystem.getInstance().playClick();
        this.selectedChar = char;
        LoadoutSystem.getInstance().setPlayerLoadout({ character: char });
        this.updateSelectionState();
      });

      (card as unknown as { redraw: () => void }).redraw = redraw;
      this.charCards.push(card);
      redraw();
    });
  }

  private createJetpackSelector(startX: number, startY: number): void {
    this.add.text(startX, startY, '2. CHOOSE JETPACK EQUIPMENT', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#38bdf8',
      fontStyle: 'bold',
    });

    JETPACKS.forEach((jp, idx) => {
      const cardX = startX + 90 + idx * 193;
      const cardY = startY + 80;

      const isUnlocked = SaveSystem.getInstance().isJetpackUnlocked(jp.id);

      const card = this.add.container(cardX, cardY);
      card.setSize(180, 90);

      const bg = this.add.graphics();

      const sprite = this.add.sprite(-52, 0, `jp_${jp.id}`).setScale(1.15);
      if (!isUnlocked) sprite.setTint(0x475569);

      const isLongName = jp.name.length > 12;
      const name = this.add.text(-15, -14, jp.name, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: isLongName ? '11px' : '13px',
        color: isUnlocked ? '#ffffff' : '#94a3b8',
        fontStyle: 'bold',
        wordWrap: { width: 98 },
      }).setOrigin(0, 0.5);

      const statusText = isUnlocked ? (jp.id === 'overdrive_mk2' ? 'UNLOCKED' : jp.type) : 'LOCKED (BOSS)';
      const statusColor = isUnlocked ? (jp.id === 'overdrive_mk2' ? '#22c55e' : '#94a3b8') : '#e879f9';

      const type = this.add.text(-15, 10, statusText, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '10px',
        color: statusColor,
        fontStyle: isUnlocked ? (jp.id === 'overdrive_mk2' ? 'bold' : 'normal') : 'bold',
        wordWrap: { width: 98 },
      }).setOrigin(0, 0.5);

      card.add([bg, sprite, name, type]);
      card.setInteractive({ useHandCursor: isUnlocked });

      const redraw = () => {
        bg.clear();
        const isSel = this.selectedJetpack.id === jp.id;
        bg.fillStyle(isSel ? 0x0f172a : (isUnlocked ? 0x1e293b : 0x090d16), 0.9);
        bg.fillRect(-90, -45, 180, 90);
        bg.lineStyle(isSel ? 3 : 1, isSel ? 0x00f0ff : (isUnlocked ? 0x475569 : 0x334155));
        bg.strokeRect(-90, -45, 180, 90);
      };

      card.on('pointerdown', () => {
        if (!isUnlocked) {
          AudioSystem.getInstance().playHit();
          return;
        }
        AudioSystem.getInstance().playClick();
        this.selectedJetpack = jp;
        LoadoutSystem.getInstance().setPlayerLoadout({ jetpack: jp });
        this.updateSelectionState();
      });

      (card as unknown as { redraw: () => void }).redraw = redraw;
      this.jetpackCards.push(card);
      redraw();
    });
  }

  private createWeaponSelector(startX: number, startY: number): void {
    this.add.text(startX, startY, '3. CHOOSE WEAPON SYSTEM', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#38bdf8',
      fontStyle: 'bold',
    });

    WEAPONS.forEach((wp, idx) => {
      const cardX = startX + 120 + idx * 260;
      const cardY = startY + 80;

      const card = this.add.container(cardX, cardY);
      card.setSize(240, 90);

      const bg = this.add.graphics();

      const sprite = this.add.sprite(-70, 0, `wp_${wp.id}`).setScale(1.3);

      const isLongName = wp.name.length > 12;
      const name = this.add.text(-20, -14, wp.name, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: isLongName ? '13px' : '14px',
        color: '#ffffff',
        fontStyle: 'bold',
        wordWrap: { width: 130 },
      }).setOrigin(0, 0.5);

      const type = this.add.text(-20, 10, `DMG: ${wp.stats.damage}/10`, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '11px',
        color: '#facc15',
      }).setOrigin(0, 0.5);

      card.add([bg, sprite, name, type]);
      card.setInteractive({ useHandCursor: true });

      const redraw = () => {
        bg.clear();
        const isSel = this.selectedWeapon.id === wp.id;
        bg.fillStyle(isSel ? 0x0f172a : 0x1e293b, 0.9);
        bg.fillRect(-120, -45, 240, 90);
        bg.lineStyle(isSel ? 3 : 1, isSel ? 0x00f0ff : 0x475569);
        bg.strokeRect(-120, -45, 240, 90);
      };

      card.on('pointerdown', () => {
        AudioSystem.getInstance().playClick();
        this.selectedWeapon = wp;
        LoadoutSystem.getInstance().setPlayerLoadout({ weapon: wp });
        this.updateSelectionState();
      });

      (card as unknown as { redraw: () => void }).redraw = redraw;
      this.weaponCards.push(card);
      redraw();
    });
  }

  private createPreviewPanel(x: number, y: number): void {
    const container = this.add.container(x, y);

    // Panel Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 0.95);
    bg.fillRect(0, 0, 390, 535);
    bg.lineStyle(2, 0x00f0ff, 0.8);
    bg.strokeRect(0, 0, 390, 535);
    container.add(bg);

    // Model Viewport Platform
    const platform = this.add.graphics();
    platform.fillStyle(0x1e293b, 1);
    platform.fillEllipse(195, 175, 200, 45);
    platform.lineStyle(2, 0x00f0ff, 0.6);
    platform.strokeEllipse(195, 175, 200, 45);
    container.add(platform);

    // Mounted Full-Body Model Sprites
    this.previewJetpackSprite = this.add.sprite(150, 125, `jp_${this.selectedJetpack.id}`).setScale(2.2);
    this.previewCharSprite = this.add.sprite(195, 125, `char_${this.selectedChar.id}`).setScale(2.2);
    this.previewWeaponSprite = this.add.sprite(240, 135, `wp_${this.selectedWeapon.id}`).setScale(2.2);
    container.add([this.previewJetpackSprite, this.previewCharSprite, this.previewWeaponSprite]);

    // Floating idle animation
    this.tweens.add({
      targets: [this.previewCharSprite, this.previewJetpackSprite, this.previewWeaponSprite],
      y: '+=8',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Build Summary Title
    const summaryTitle = this.add.text(195, 225, 'COMPACT BUILD SUMMARY', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#00f0ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(summaryTitle);

    // Selected Names Summary
    this.summaryText = this.add.text(195, 255, '', {
      fontFamily: 'Consolas, monospace',
      fontSize: '14px',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);
    container.add(this.summaryText);

    // Stat Meters
    this.statSpeed = new StatBar(this, x + 45, y + 295, 'SPEED', 7, 10, 0x00f0ff);
    this.statThrust = new StatBar(this, x + 45, y + 345, 'THRUST', 7, 10, 0x38bdf8);
    this.statDamage = new StatBar(this, x + 45, y + 395, 'DAMAGE', 6, 10, 0xef4444);
    this.statDurability = new StatBar(this, x + 45, y + 445, 'DURABILITY', 7, 10, 0x22c55e);

    this.updateSelectionState();
  }

  private updateSelectionState(): void {
    // Redraw cards
    this.charCards.forEach((c) => (c as unknown as { redraw: () => void }).redraw());
    this.jetpackCards.forEach((c) => (c as unknown as { redraw: () => void }).redraw());
    this.weaponCards.forEach((c) => (c as unknown as { redraw: () => void }).redraw());

    // Update Model Sprites
    if (this.previewCharSprite) {
      this.previewCharSprite.setTexture(`char_${this.selectedChar.id}`);
      this.previewJetpackSprite.setTexture(`jp_${this.selectedJetpack.id}`);
      this.previewWeaponSprite.setTexture(`wp_${this.selectedWeapon.id}`);
    }

    // Update Summary Text
    if (this.summaryText) {
      this.summaryText.setText(
        `${this.selectedChar.name}  •  ${this.selectedJetpack.name}\n${this.selectedWeapon.name}`
      );
    }

    // Combined Stat Calculations
    const totalSpeed = Math.min(10, Math.round((this.selectedChar.stats.speed + this.selectedJetpack.stats.thrust) / 2));
    const totalThrust = Math.min(10, this.selectedJetpack.stats.thrust);
    const totalDamage = Math.min(10, this.selectedWeapon.stats.damage);
    const totalDurability = Math.min(10, Math.round((this.selectedChar.stats.durability + this.selectedJetpack.stats.stability) / 2));

    if (this.statSpeed) {
      this.statSpeed.setValue(totalSpeed, 10, 0x00f0ff);
      this.statThrust.setValue(totalThrust, 10, 0x38bdf8);
      this.statDamage.setValue(totalDamage, 10, 0xef4444);
      this.statDurability.setValue(totalDurability, 10, 0x22c55e);
    }
  }

  private createBottomButtons(): void {
    // BACK TO MENU BUTTON
    const backBtn = this.add.text(80, 668, '← BACK TO MAIN MENU', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#94a3b8',
      fontStyle: 'bold',
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      if (!this.isTransitioning) backBtn.setColor('#00f0ff');
    });
    backBtn.on('pointerout', () => {
      if (!this.isTransitioning) backBtn.setColor('#94a3b8');
    });
    backBtn.on('pointerdown', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      backBtn.disableInteractive();
      AudioSystem.getInstance().playClick();
      this.scene.start('MainMenuScene');
    });

    // START RACE BUTTON (PRIMARY ACTIVE CTA)
    const startContainer = this.add.container(1040, 668);

    const startBg = this.add.sprite(0, 0, 'ui_button_primary').setDisplaySize(240, 56);
    const startText = this.add.text(0, 0, 'START RACE ▶', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
      shadow: { blur: 10, color: '#00f0ff', fill: true },
    }).setOrigin(0.5);

    startContainer.add([startBg, startText]);

    // Gentle CTA Breathing Glow Pulse
    this.tweens.add({
      targets: startText,
      alpha: 0.88,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    startBg.setInteractive({ useHandCursor: true });

    startBg.on('pointerover', () => {
      if (!this.isTransitioning) {
        startBg.setTint(0x67e8f9);
        startText.setColor('#ffffff');
        startContainer.setScale(1.04);
        AudioSystem.getInstance().playClick();
      }
    });

    startBg.on('pointerout', () => {
      if (!this.isTransitioning) {
        startBg.clearTint();
        startText.setColor('#ffffff');
        startContainer.setScale(1.0);
      }
    });

    startBg.on('pointerdown', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      startBg.disableInteractive();
      startContainer.setScale(0.97);
      startBg.setTint(0x00f0ff);
      console.log('[RaceDebug] START RACE button clicked!');
      AudioSystem.getInstance().playClick();
      const loadout = {
        character: this.selectedChar,
        jetpack: this.selectedJetpack,
        weapon: this.selectedWeapon,
      };
      console.log('[RaceDebug] Selected Loadout:', loadout);
      LoadoutSystem.getInstance().setPlayerLoadout(loadout);
      console.log('[RaceDebug] Calling this.scene.start("RaceScene", { loadout })...');
      this.scene.start('RaceScene', { loadout });
    });
  }
}
