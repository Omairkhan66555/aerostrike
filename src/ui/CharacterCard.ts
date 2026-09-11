import Phaser from 'phaser';

export class CharacterCard {
  public container: Phaser.GameObjects.Container;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private isSelected: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    title: string,
    subtitle: string,
    textureKey: string,
    onClick: () => void
  ) {
    this.container = scene.add.container(x, y);
    this.bgGraphics = scene.add.graphics();
    this.container.add(this.bgGraphics);

    // Sprite preview
    const sprite = scene.add.sprite(0, -15, textureKey);
    sprite.setScale(1.2);
    this.container.add(sprite);

    // Title
    const titleText = scene.add.text(0, 30, title, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle
    const subText = scene.add.text(0, 48, subtitle, {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '12px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    this.container.add([titleText, subText]);

    // Hit area interactive button
    const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
    this.container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    this.container.on('pointerdown', onClick);
    this.container.on('pointerover', () => {
      if (!this.isSelected) this.drawCard(width, height, true);
    });
    this.container.on('pointerout', () => {
      if (!this.isSelected) this.drawCard(width, height, false);
    });

    this.drawCard(width, height, false);
  }

  public setSelected(selected: boolean, width: number = 180, height: number = 150): void {
    this.isSelected = selected;
    this.drawCard(width, height, false);
  }

  private drawCard(width: number, height: number, hover: boolean): void {
    this.bgGraphics.clear();
    const halfW = width / 2;
    const halfH = height / 2;

    if (this.isSelected) {
      this.bgGraphics.fillStyle(0x0f172a, 0.95);
      this.bgGraphics.fillRect(-halfW, -halfH, width, height);
      this.bgGraphics.lineStyle(3, 0x00f0ff, 1);
      this.bgGraphics.strokeRect(-halfW, -halfH, width, height);
    } else if (hover) {
      this.bgGraphics.fillStyle(0x1e293b, 0.85);
      this.bgGraphics.fillRect(-halfW, -halfH, width, height);
      this.bgGraphics.lineStyle(2, 0x38bdf8, 0.8);
      this.bgGraphics.strokeRect(-halfW, -halfH, width, height);
    } else {
      this.bgGraphics.fillStyle(0x0f172a, 0.7);
      this.bgGraphics.fillRect(-halfW, -halfH, width, height);
      this.bgGraphics.lineStyle(1, 0x334155, 0.6);
      this.bgGraphics.strokeRect(-halfW, -halfH, width, height);
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}
