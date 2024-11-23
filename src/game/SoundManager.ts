import { SOUND_URLS } from './constants';

export class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement };
  private audioContext: AudioContext | null;
  private muted: boolean;
  private initialized: boolean;

  constructor() {
    this.sounds = {};
    this.audioContext = null;
    this.muted = false;
    this.initialized = false;
    this.init();
  }

  private async init() {
    if (this.initialized) return;

    try {
      // Create AudioContext on user interaction to comply with browser policies
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Initialize and load all sounds
      await Promise.all(
        Object.entries(SOUND_URLS).map(async ([key, url]) => {
          try {
            const audio = new Audio();
            audio.src = url;
            audio.volume = 0.3;
            audio.preload = 'auto';
            this.sounds[key] = audio;
          } catch (error) {
            // Silently fail if sound loading isn't possible
          }
        })
      );

      this.initialized = true;
    } catch (error) {
      // Silently fail if initialization isn't possible
    }
  }

  play(sound: keyof typeof SOUND_URLS) {
    if (this.muted || !this.sounds[sound]) return;

    try {
      // Only try to play if the audio element exists
      const audio = this.sounds[sound];
      if (!audio) return;

      // If the sound is already playing, don't try to play it again
      if (!audio.paused && !audio.ended) return;

      // Reset the audio to start
      audio.currentTime = 0;
      audio.volume = 0.3;
      
      // Play the sound without creating new instances
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Silently fail if playback isn't possible
          // This prevents console errors on mobile
        });
      }
    } catch (error) {
      // Silently fail if sound playback isn't possible
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    
    // Stop all currently playing sounds when muted
    if (muted) {
      Object.values(this.sounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
  }

  // Call this method on user interaction to initialize audio
  async initializeAudio() {
    if (!this.audioContext) {
      await this.init();
    }
  }
}