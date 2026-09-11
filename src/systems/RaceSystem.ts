import { Racer } from '../entities/Racer';
import { RacerProgress, RaceResult } from '../types/race';

export class RaceSystem {
  private trackLength: number;
  private racers: Racer[];
  private raceStartTime: number = 0;
  public isRaceFinished: boolean = false;

  constructor(trackLength: number, racers: Racer[]) {
    this.trackLength = trackLength;
    this.racers = racers;
  }

  public startRace(time: number): void {
    this.raceStartTime = time;
    this.isRaceFinished = false;
  }

  public update(time: number): RacerProgress[] {
    const elapsedSeconds = (time - this.raceStartTime) / 1000;

    // Calculate distance and progress % for each racer
    const progressList: RacerProgress[] = this.racers.map((racer) => {
      const progressPercent = Math.min(100, Math.max(0, (racer.x / this.trackLength) * 100));
      const bodyVx = racer.body ? (racer.body as Phaser.Physics.Arcade.Body).velocity.x : 0;
      const kmhSpeed = Math.round(bodyVx * 0.45); // Scale px/s to futuristic km/h

      if (progressPercent >= 100) {
        racer.isSpinningOut = false;
      }

      return {
        id: racer.racerId,
        name: racer.racerName,
        isPlayer: racer.isPlayer,
        distance: racer.x,
        progressPercent,
        position: 1,
        speed: Math.max(0, kmhSpeed),
        lapTime: elapsedSeconds,
        isFinished: progressPercent >= 100,
      };
    });

    // Sort racers by distance descending to compute live positions (1st, 2nd, 3rd, 4th)
    const sorted = [...progressList].sort((a, b) => b.distance - a.distance);
    sorted.forEach((item, index) => {
      const found = progressList.find((p) => p.id === item.id);
      if (found) {
        found.position = index + 1;
      }
    });

    // Check if player has finished (100%)
    const playerProgress = progressList.find((p) => p.isPlayer);
    if (playerProgress && playerProgress.progressPercent >= 100) {
      this.isRaceFinished = true;
    }

    return progressList;
  }

  public getFinalResults(time: number): RaceResult[] {
    const elapsedSeconds = (time - this.raceStartTime) / 1000;
    const progressList = this.update(time);

    return progressList.map((p) => ({
      racerId: p.id,
      racerName: p.name,
      isPlayer: p.isPlayer,
      position: p.position,
      time: Math.round(elapsedSeconds * 100) / 100,
      topSpeed: Math.round(p.speed * 1.25),
      rewardCredits: Math.max(100, (5 - p.position) * 500),
    }));
  }
}
