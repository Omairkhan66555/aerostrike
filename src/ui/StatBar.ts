import Phaser from 'phaser';

export class StatBar {
  private container: Phaser.GameObjects.Container;
  private labelText: Phaser.GameObjects.Text;
  private barGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, label: string, initialVal: number = 7, maxVal: number = 10, color: number = 0x00f0ff) {
    this.container = scene.add.container(x, y);

    this.labelText = scene.add.text(0, 0, label.toUpperCase(), {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '14px',
      color: '#94a3b8',
      fontStyle: 'bold',
    });

    this.barGraphics = scene.add.graphics();
    this.container.add([this.labelText, this.barGraphics]);

    this.setValue(initialVal, maxVal, color);
  }

  public setValue(val: number, maxVal: number = 10, color: number = 0x00f0ff): void {
    this.barGraphics.clear();

    const barWidth = 140;
    const barHeight = 12;
    const fillWidth = (Math.min(val, maxVal) / maxVal) * barWidth;

    // Background track
    this.barGraphics.fillStyle(0x1e293b, 0.8);
    this.barGraphics.fillRect(100, 2, barWidth, barHeight);

    // Fill bar
    this.barGraphics.fillStyle(color, 1);
    this.barGraphics.fillRect(100, 2, fillWidth, barHeight);

    // Segment lines
    this.barGraphics.lineStyle(1, 0x030712, 0.7);
    for (let i = 1; i < maxVal; i++) {
      const sx = 100 + (i / maxVal) * barWidth;
      this.barGraphics.lineBetween(sx, 2, sx, 2 + barHeight);
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}
