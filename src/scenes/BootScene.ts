import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  public create(): void {
    // Configure crisp scale & orientation
    this.scale.refresh();
    this.scene.start('PreloadScene');
  }
}
