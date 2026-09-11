import { CHARACTERS } from '../data/characters';
import { JETPACKS } from '../data/jetpacks';
import { WEAPONS } from '../data/weapons';
import { Loadout } from '../types/race';

export class LoadoutSystem {
  private static instance: LoadoutSystem;

  private playerLoadout: Loadout;

  private constructor() {
    // Default loadout: VOLT + VECTOR + PULSE BLASTER
    this.playerLoadout = {
      character: CHARACTERS[0],
      jetpack: JETPACKS[0],
      weapon: WEAPONS[0],
    };
  }

  public static getInstance(): LoadoutSystem {
    if (!LoadoutSystem.instance) {
      LoadoutSystem.instance = new LoadoutSystem();
    }
    return LoadoutSystem.instance;
  }

  public setPlayerLoadout(loadout: Partial<Loadout>): void {
    if (loadout.character) this.playerLoadout.character = loadout.character;
    if (loadout.jetpack) this.playerLoadout.jetpack = loadout.jetpack;
    if (loadout.weapon) this.playerLoadout.weapon = loadout.weapon;
  }

  public getPlayerLoadout(): Loadout {
    return this.playerLoadout;
  }

  /**
   * Returns preset rival AI loadouts using distinct character/jetpack/weapon combinations.
   */
  public getAIRivalLoadouts(): { name: string; loadout: Loadout }[] {
    return [
      {
        name: 'VIPER (NOVA)',
        loadout: {
          character: CHARACTERS[1], // NOVA (Speed)
          jetpack: JETPACKS[1],   // OVERDRIVE
          weapon: WEAPONS[0],     // PULSE BLASTER
        },
      },
      {
        name: 'GOLIATH (TITAN)',
        loadout: {
          character: CHARACTERS[2], // TITAN (Heavy)
          jetpack: JETPACKS[2],   // TITAN CORE
          weapon: WEAPONS[1],     // PLASMA CANNON
        },
      },
      {
        name: 'SPECTRE (ECHO)',
        loadout: {
          character: CHARACTERS[3], // ECHO (Agility)
          jetpack: JETPACKS[0],   // VECTOR
          weapon: WEAPONS[2],     // SHOCKWAVE
        },
      },
    ];
  }
}
