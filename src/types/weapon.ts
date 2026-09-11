export type WeaponType = 'pulse_blaster' | 'plasma_cannon' | 'shockwave';

export interface WeaponStats {
  damage: number;       // 1 to 10 scale
  fireRate: number;     // shots per second (or cooldown ms)
  range: number;        // pixel effective range
  energyCost: number;   // heat / energy cost per shot
  projectileSpeed: number; // velocity in px/s
}

export interface WeaponData {
  id: string;
  name: string;
  type: WeaponType;
  stats: WeaponStats;
  description: string;
  projectileColor: number;
  glowColor: number;
  muzzleFlashType: 'rapid' | 'heavy' | 'wave';
}
