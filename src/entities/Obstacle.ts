import Phaser from 'phaser';
import { TrackElement } from '../data/levels';

export class Obstacle extends Phaser.Physics.Arcade.Sprite {
  public elementType: TrackElement['type'];
  private initialY: number;
  private moving: boolean;
  private moveRangeY: number;
  private moveSpeed: number;
  private direction: number = 1;

  constructor(scene: Phaser.Scene, element: TrackElement) {
    let textureKey = 'tex_drone';
    switch (element.type) {
      case 'speed_zone': textureKey = 'tex_speed_zone'; break;
      case 'boost_pad': textureKey = 'tex_boost_pad'; break;
      case 'laser_barrier': textureKey = 'tex_laser_barrier'; break;
      case 'drone': textureKey = 'tex_drone'; break;
      case 'obstacle': textureKey = 'tex_drone'; break;
    }

    super(scene, element.x, element.y, textureKey);
    this.elementType = element.type;
    this.initialY = element.y;
    this.moving = !!element.moving;
    this.moveRangeY = element.moveRangeY || 100;
    this.moveSpeed = element.moveSpeed || 100;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body

    if (this.body) {
      if ('setAllowGravity' in this.body) {
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      }
      if (element.width && element.height) {
        this.body.setSize(element.width, element.height);
      }
    }
  }

  public update(deltaSeconds: number): void {
    if (this.moving) {
      this.y += this.direction * this.moveSpeed * deltaSeconds;
      if (Math.abs(this.y - this.initialY) > this.moveRangeY) {
        this.direction *= -1;
      }
    }
  }
}
