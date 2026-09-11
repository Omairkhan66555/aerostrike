import { CharacterData } from './character';
import { JetpackData } from './jetpack';
import { WeaponData } from './weapon';

export interface Loadout {
  character: CharacterData;
  jetpack: JetpackData;
  weapon: WeaponData;
}

export interface RacerProgress {
  id: string;
  name: string;
  isPlayer: boolean;
  distance: number;
  progressPercent: number; // 0 to 100
  position: number;        // 1 to 4
  speed: number;           // current km/h equivalent
  lapTime: number;         // seconds elapsed
  isFinished: boolean;
  finishTime?: number;
}

export interface RaceResult {
  racerId: string;
  racerName: string;
  isPlayer: boolean;
  position: number;
  time: number;
  topSpeed: number;
  rewardCredits: number;
}
