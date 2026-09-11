export interface CharacterStats {
  speed: number;       // 1 to 10 scale
  acceleration: number; // 1 to 10 scale
  boost: number;        // 1 to 10 scale
  durability: number;   // 1 to 10 scale
}

export interface CharacterData {
  id: string;
  name: string;
  role: string;
  stats: CharacterStats;
  description: string;
  primaryColor: number;
  secondaryColor: number;
  glowColor: number;
  silhouetteType: 'sleek' | 'needle' | 'heavy' | 'winged' | 'phase';
}
