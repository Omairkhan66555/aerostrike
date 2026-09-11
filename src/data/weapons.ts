import { WeaponData } from '../types/weapon';

export const WEAPONS: WeaponData[] = [
  {
    id: 'pulse_blaster',
    name: 'PULSE BLASTER',
    type: 'pulse_blaster',
    stats: {
      damage: 6,
      fireRate: 4,      // 4 shots per second
      range: 800,
      energyCost: 10,
      projectileSpeed: 1200,
    },
    description: 'High-frequency energy carbine firing rapid energy bolts. Excellent for tracking fast targets.',
    projectileColor: 0x00f0ff,
    glowColor: 0x38bdf8,
    muzzleFlashType: 'rapid',
  },
  {
    id: 'plasma_cannon',
    name: 'PLASMA CANNON',
    type: 'plasma_cannon',
    stats: {
      damage: 10,
      fireRate: 1.5,    // 1.5 shots per second
      range: 1000,
      energyCost: 25,
      projectileSpeed: 750,
    },
    description: 'Heavy plasma launcher emitting dense destructive energy spheres. Causes heavy flinch and spinouts.',
    projectileColor: 0xff3300,
    glowColor: 0xfacc15,
    muzzleFlashType: 'heavy',
  },
  {
    id: 'shockwave',
    name: 'SHOCKWAVE',
    type: 'shockwave',
    stats: {
      damage: 8,
      fireRate: 1,      // 1 pulse per second
      range: 400,
      energyCost: 35,
      projectileSpeed: 500,
    },
    description: 'Omni-directional EMP pulse emitter. Expands in a wide ring, knocking out control for nearby racers.',
    projectileColor: 0xa855f7,
    glowColor: 0xe879f9,
    muzzleFlashType: 'wave',
  },
];
