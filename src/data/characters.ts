import { CharacterData } from '../types/character';

export const CHARACTERS: CharacterData[] = [
  {
    id: 'volt',
    name: 'VOLT',
    role: 'Balanced Racer',
    stats: {
      speed: 7,
      acceleration: 7,
      boost: 7,
      durability: 7,
    },
    description: 'Versatile pilot equipped with electric exo-plating. Well-rounded stats suitable for any track condition.',
    primaryColor: 0x00f0ff,   // Cyan
    secondaryColor: 0x1e293b, // Dark Slate
    glowColor: 0x38bdf8,      // Light Blue
    silhouetteType: 'sleek',
  },
  {
    id: 'nova',
    name: 'NOVA',
    role: 'Speed Specialist',
    stats: {
      speed: 10,
      acceleration: 8,
      boost: 9,
      durability: 4,
    },
    description: 'Ultra-light needle-frame racer built for extreme top speed. High performance at the cost of fragile armor.',
    primaryColor: 0xff2a5f,   // Crimson Magenta
    secondaryColor: 0x3b0764, // Deep Purple
    glowColor: 0xfacc15,      // Gold
    silhouetteType: 'needle',
  },
  {
    id: 'titan',
    name: 'TITAN',
    role: 'Heavy Racer',
    stats: {
      speed: 5,
      acceleration: 5,
      boost: 6,
      durability: 10,
    },
    description: 'Armored juggernaut built with dense blast plating. Nearly immune to collision spinouts and heavy hazards.',
    primaryColor: 0xf97316,   // Heavy Orange
    secondaryColor: 0x27272a, // Dark Metal
    glowColor: 0xfde047,      // Bright Amber
    silhouetteType: 'heavy',
  },
  {
    id: 'echo',
    name: 'ECHO',
    role: 'Agility Specialist',
    stats: {
      speed: 8,
      acceleration: 10,
      boost: 8,
      durability: 5,
    },
    description: 'Aerodynamic mobility frame capable of instantaneous acceleration and extreme maneuverability.',
    primaryColor: 0x10b981,   // Emerald Green
    secondaryColor: 0x064e3b, // Forest Dark
    glowColor: 0x34d399,      // Mint Glow
    silhouetteType: 'winged',
  },
  {
    id: 'rift',
    name: 'RIFT',
    role: 'Ability Specialist',
    stats: {
      speed: 7,
      acceleration: 7,
      boost: 7,
      durability: 6,
    },
    description: 'Infused with void energy cells. Efficient energy regeneration and high combat stability.',
    primaryColor: 0xa855f7,   // Void Purple
    secondaryColor: 0x1e1b4b, // Deep Indigo
    glowColor: 0xc084fc,      // Bright Violet
    silhouetteType: 'phase',
  },
];
