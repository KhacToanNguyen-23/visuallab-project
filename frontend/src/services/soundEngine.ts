import * as Tone from 'tone';

class SoundEngine {
  private inited = false;
  private collisionSynth: Tone.MembraneSynth | null = null;
  
  public async init() {
    if (this.inited) return;
    await Tone.start();
    
    // Create a simple synth for collisions
    this.collisionSynth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: 'exponential',
      },
    }).toDestination();

    this.inited = true;
  }

  public playCollision(velocity: number) {
    if (!this.inited || !this.collisionSynth) return;
    
    // velocity defines volume (and perhaps pitch slightly)
    const normalizedVel = Math.min(Math.abs(velocity) / 10, 1);
    if (normalizedVel < 0.05) return; // Too soft to hear

    // Dynamic volume
    this.collisionSynth.volume.value = -30 + (normalizedVel * 20); // -30dB to -10dB
    
    this.collisionSynth.triggerAttackRelease('C2', '8n');
  }
}

export const soundEngine = new SoundEngine();
