export class AudioSystem {
  private static instance: AudioSystem;
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private thrustOsc: OscillatorNode | null = null;
  private thrustGain: GainNode | null = null;
  private isThrustPlaying: boolean = false;

  private constructor() {
    // Initialize Web Audio API context on first user interaction
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
  }

  public static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  public resumeContext(): void {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // --- UI SOUNDS ---
  public playClick(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  // --- WEAPON SOUNDS ---
  public playLaser(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.12);
  }

  public playPlasma(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  public playShockwaveSound(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.audioCtx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.4);
  }

  // --- BOOST & IMPACT SOUNDS ---
  public playBoost(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  public playHit(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  public playPickup(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, this.audioCtx.currentTime + 0.16); // G5

    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  // --- THRUST LOOP ---
  public startThrustLoop(): void {
    if (this.isThrustPlaying || this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    this.thrustOsc = this.audioCtx.createOscillator();
    this.thrustGain = this.audioCtx.createGain();

    this.thrustOsc.type = 'sawtooth';
    this.thrustOsc.frequency.setValueAtTime(70, this.audioCtx.currentTime);

    this.thrustGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

    this.thrustOsc.connect(this.thrustGain);
    this.thrustGain.connect(this.audioCtx.destination);

    this.thrustOsc.start();
    this.isThrustPlaying = true;
  }

  public updateThrustPitch(speedRatio: number): void {
    if (this.thrustOsc && this.audioCtx) {
      const targetFreq = 70 + speedRatio * 150;
      this.thrustOsc.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.1);
    }
  }

  public stopThrustLoop(): void {
    if (this.thrustOsc && this.audioCtx) {
      try {
        this.thrustOsc.stop();
        this.thrustOsc.disconnect();
      } catch {
        // Ignore if already stopped
      }
      this.thrustOsc = null;
      this.thrustGain = null;
      this.isThrustPlaying = false;
    }
  }

  // --- BOSS AUDIO EFFECTS ---
  public playBossArrival(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, this.audioCtx.currentTime + 0.8);
    osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.5);
  }

  public playBossWarning(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    for (let i = 0; i < 3; i++) {
      const startTime = this.audioCtx.currentTime + i * 0.12;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.08);
    }
  }

  public playBossBeam(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, this.audioCtx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(250, this.audioCtx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.45, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.2);
  }

  public playBossWeakPointHit(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2200, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  public playBossPhase(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.6);
  }

  public playBossDefeat(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const now = this.audioCtx.currentTime;

    // Heavy bass rumble
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 2.0);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.0);

    // Staggered explosion bursts
    for (let i = 0; i < 5; i++) {
      const burstTime = now + i * 0.35;
      const bOsc = this.audioCtx.createOscillator();
      const bGain = this.audioCtx.createGain();

      bOsc.type = 'square';
      bOsc.frequency.setValueAtTime(200 - i * 30, burstTime);
      bOsc.frequency.exponentialRampToValueAtTime(40, burstTime + 0.25);

      bGain.gain.setValueAtTime(0.4, burstTime);
      bGain.gain.exponentialRampToValueAtTime(0.01, burstTime + 0.25);

      bOsc.connect(bGain);
      bGain.connect(this.audioCtx.destination);

      bOsc.start(burstTime);
      bOsc.stop(burstTime + 0.25);
    }
  }

  public playVictoryChime(): void {
    if (this.isMuted || !this.audioCtx) return;
    this.resumeContext();

    const ctx = this.audioCtx;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }
}
