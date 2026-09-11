import Phaser from 'phaser';
import { Poolable } from '../systems/ObjectPool';
import { WeaponType } from '../types/weapon';

export class Projectile extends Phaser.Physics.Arcade.Sprite implements Poolable {
  public active: boolean = false;
  public ownerId: string = '';
  public damage: number = 0;
  public weaponType: WeaponType = 'pulse_blaster';
  private maxLifetime: number = 2500; // ms
  private spawnTime: number = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'proj_pulse');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }
    this.setVisible(false);
  }

  public spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    ownerId: string,
    damage: number,
    type: WeaponType,
    textureKey: string,
    tint: number
  ): void {
    this.setPosition(x, y);
    this.ownerId = ownerId;
    this.damage = damage;
    this.weaponType = type;
    this.setTexture(textureKey);
    this.setTint(tint);
    this.setVisible(true);
    this.setActive(true);
    this.active = true;

    if (this.body) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.enable = true;
      body.setVelocity(vx, vy);
    }

    this.spawnTime = this.scene.time.now;
  }

  public update(time: number): void {
    if (!this.active) return;

    // Auto despawn after lifetime expiry or leaving camera view area
    if (time - this.spawnTime > this.maxLifetime || this.x > this.scene.cameras.main.scrollX + 1500) {
      this.despawn();
    }
  }

  public despawn(): void {
    this.setVisible(false);
    this.setActive(false);
    this.active = false;
    if (this.body) {
      (this.body as Phaser.Physics.Arcade.Body).enable = false;
    }
  }
}
