import Phaser from 'phaser';

export class Pickup extends Phaser.Physics.Arcade.Sprite {
  public energyAmount: number = 30;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tex_energy_pickup');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    // Floating bobbing effect
    scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }
}
