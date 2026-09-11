export interface SaveData {
  credits: number;
  unlockedJetpacks: string[];
  world1BossDefeated: boolean;
}

const SAVE_KEY = 'aerostrike_save_v1';

export class SaveSystem {
  private static instance: SaveSystem;

  private data: SaveData;

  private constructor() {
    this.data = this.loadData();
  }

  public static getInstance(): SaveSystem {
    if (!SaveSystem.instance) {
      SaveSystem.instance = new SaveSystem();
    }
    return SaveSystem.instance;
  }

  private loadData(): SaveData {
    const defaultData: SaveData = {
      credits: 0,
      unlockedJetpacks: ['vector', 'overdrive', 'titan_core'],
      world1BossDefeated: false,
    };

    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultData;
      const parsed = JSON.parse(raw);
      return {
        credits: typeof parsed.credits === 'number' ? parsed.credits : defaultData.credits,
        unlockedJetpacks: Array.isArray(parsed.unlockedJetpacks) ? parsed.unlockedJetpacks : defaultData.unlockedJetpacks,
        world1BossDefeated: !!parsed.world1BossDefeated,
      };
    } catch {
      return defaultData;
    }
  }

  public save(): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore localStorage errors in restricted environments
    }
  }

  public getCredits(): number {
    return this.data.credits;
  }

  public getPoints(): number {
    return this.data.credits;
  }

  public addCredits(amount: number): number {
    this.data.credits += Math.max(0, amount);
    this.save();
    return this.data.credits;
  }

  public addPoints(amount: number): number {
    return this.addCredits(amount);
  }

  public isJetpackUnlocked(id: string): boolean {
    return this.data.unlockedJetpacks.includes(id);
  }

  public unlockJetpack(id: string): void {
    if (!this.data.unlockedJetpacks.includes(id)) {
      this.data.unlockedJetpacks.push(id);
      this.save();
    }
  }

  public isBossDefeated(): boolean {
    return this.data.world1BossDefeated;
  }

  public setBossDefeated(): void {
    this.data.world1BossDefeated = true;
    this.save();
  }

  public getData(): SaveData {
    return { ...this.data };
  }
}
