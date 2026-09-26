/**
 * Audio synthesis helper using Web Audio API for chat sounds, voice note cues, and calling ringtones
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  unlockAudio() {
    if (this.isUnlocked && this.ctx && this.ctx.state === 'running') return;
    try {
      const ctx = this.getContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.isUnlocked = true;
        }).catch(() => {});
      } else if (ctx) {
        this.isUnlocked = true;
      }
    } catch {
      // ignore
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Sent message sound - whisper-soft and gentle so it never annoys the user
  playSendMessage() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.035);

      // Very soft gain (0.035) for a quiet, gentle subtle click
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // ignore
    }
  }

  // Received message chime - sweet, pleasant and melodious notification tone
  playReceiveMessage() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note sequence: E5 (659Hz), A5 (880Hz), C#6 (1108Hz)
      const notes = [
        { freq: 659.25, time: now, dur: 0.12, gain: 0.22 },
        { freq: 880.00, time: now + 0.08, dur: 0.14, gain: 0.28 },
        { freq: 1108.73, time: now + 0.16, dur: 0.28, gain: 0.32 },
      ];

      notes.forEach(({ freq, time, dur, gain: noteGain }) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        subOsc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        subOsc.frequency.setValueAtTime(freq * 0.5, time); // warm undertone

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(noteGain, time + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.connect(gainNode);
        subOsc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(time);
        subOsc.start(time);
        osc.stop(time + dur);
        subOsc.stop(time + dur);
      });
    } catch {
      // ignore
    }
  }

  // Voice note record start
  playRecordStart() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Voice note record stop
  playRecordStop() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  // Soft, realistic outgoing call ringback tone (Caller hears subtle standard dial pulse: "tut... tut...")
  startOutgoingDialTone(): () => void {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const playDialPulse = () => {
      if (!active) return;
      try {
        const ctx = this.getContext();
        if (ctx) {
          const now = ctx.currentTime;
          // Standard soft European/PBX dial tone frequency pair (400Hz + 450Hz)
          [400, 450].forEach((freq) => {
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // Double soft beep: beep 1 (0 to 0.4s), beep 2 (0.6s to 1.0s)
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
            gain.gain.setValueAtTime(0.04, now + 0.35);
            gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);

            gain.gain.setValueAtTime(0, now + 0.55);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.6);
            gain.gain.setValueAtTime(0.04, now + 0.95);
            gain.gain.linearRampToValueAtTime(0.0001, now + 1.0);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.05);
          });
        }
      } catch {
        // ignore
      }

      if (active) {
        timeoutId = setTimeout(playDialPulse, 3200);
      }
    };

    playDialPulse();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }

  // Authentic smartphone melodious incoming phone ringtone for recipient
  startIncomingRingtone(): () => void {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const playRingtonePhrase = () => {
      if (!active) return;
      try {
        const ctx = this.getContext();
        if (ctx) {
          if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
          const now = ctx.currentTime;

          // Realistic phone marimba melody pattern with rich pleasant tone:
          const melody = [
            { freq: 1318.51, time: 0.00, dur: 0.16, gain: 0.40 }, // E6
            { freq: 987.77,  time: 0.12, dur: 0.16, gain: 0.42 }, // B5
            { freq: 830.61,  time: 0.24, dur: 0.16, gain: 0.40 }, // G#5
            { freq: 659.25,  time: 0.36, dur: 0.18, gain: 0.38 }, // E5
            { freq: 987.77,  time: 0.48, dur: 0.16, gain: 0.42 }, // B5
            { freq: 1318.51, time: 0.60, dur: 0.18, gain: 0.45 }, // E6
            { freq: 1661.22, time: 0.74, dur: 0.28, gain: 0.48 }, // G#6
            { freq: 1318.51, time: 0.96, dur: 0.38, gain: 0.42 }, // E6 (resolving ring)
          ];

          melody.forEach(({ freq, time: noteOffset, dur, gain: noteGain }) => {
            if (!ctx) return;
            const noteTime = now + noteOffset;
            const osc = ctx.createOscillator();
            const harmonicOsc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            harmonicOsc.type = 'triangle';

            osc.frequency.setValueAtTime(freq, noteTime);
            harmonicOsc.frequency.setValueAtTime(freq * 2, noteTime); // 2nd harmonic chime

            gainNode.gain.setValueAtTime(0, noteTime);
            gainNode.gain.linearRampToValueAtTime(noteGain, noteTime + 0.012);
            gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

            osc.connect(gainNode);
            harmonicOsc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(noteTime);
            harmonicOsc.start(noteTime);
            osc.stop(noteTime + dur);
            harmonicOsc.stop(noteTime + dur);
          });
        }
      } catch {
        // ignore
      }

      if (active) {
        timeoutId = setTimeout(playRingtonePhrase, 2600);
      }
    };

    playRingtonePhrase();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }

  // Alias for backward compatibility
  startCallingTone(): () => void {
    return this.startIncomingRingtone();
  }

  // End call beep
  playEndCall() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.setValueAtTime(400, now + 0.15);
      osc.frequency.setValueAtTime(300, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // ignore
    }
  }

  // Play authentic recorded voice message using HTML5 Audio
  playVoiceNote(
    voiceDataUrl?: string,
    durationSeconds: number = 8,
    onProgress?: (progressPercent: number) => void,
    onEnded?: () => void
  ): () => void {
    if (!voiceDataUrl || (!voiceDataUrl.startsWith('data:audio') && !voiceDataUrl.startsWith('blob:') && !voiceDataUrl.startsWith('http'))) {
      console.warn('No recorded audio data available to play');
      if (onEnded) onEnded();
      return () => {};
    }

    try {
      const audio = new Audio(voiceDataUrl);
      audio.preload = 'auto';
      let progressInterval: ReturnType<typeof setInterval> | null = null;

      const cleanup = () => {
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        audio.onplay = null;
        audio.ontimeupdate = null;
        audio.onended = null;
        audio.onerror = null;
      };

      audio.onplay = () => {
        progressInterval = setInterval(() => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration) * 100;
            if (onProgress) onProgress(Math.min(100, Math.max(0, progress)));
          }
        }, 60);
      };

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          const progress = (audio.currentTime / audio.duration) * 100;
          if (onProgress) onProgress(Math.min(100, Math.max(0, progress)));
        }
      };

      audio.onended = () => {
        cleanup();
        if (onProgress) onProgress(100);
        if (onEnded) onEnded();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback error:', e);
        cleanup();
        if (onEnded) onEnded();
      };

      audio.play().catch((err) => {
        console.warn('Audio playback start failed:', err);
        cleanup();
        if (onEnded) onEnded();
      });

      return () => {
        cleanup();
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {
          // ignore
        }
      };
    } catch (err) {
      console.warn('HTML5 audio initialization failed:', err);
      if (onEnded) onEnded();
      return () => {};
    }
  }
}

export const soundEffects = new SoundEffects();
