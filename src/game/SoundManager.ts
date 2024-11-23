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
            
            // Preload audio
            audio.load();
            await audio.play().catch(() => {});
            audio.pause();
            audio.currentTime = 0;
            
            this.sounds[key] = audio;
          } catch (error) {
            console.warn(`Failed to load sound ${key}:`, error);
          }
        })
      );

      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio system:', error);
    }
  }

  play(sound: keyof typeof SOUND_URLS) {
    if (this.muted || !this.sounds[sound]) return;

    try {
      // Resume AudioContext if it was suspended
      if (this.audioContext?.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a new audio instance for each play
      const audioClone = this.sounds[sound].cloneNode() as HTMLAudioElement;
      audioClone.volume = 0.3;
      
      // Play the sound with promise handling
      const playPromise = audioClone.play();
      if (playPromise) {
        playPromise.catch((error) => {
          if (error.name !== 'NotAllowedError') {
            console.warn(`Sound playback failed: ${error}`);
          }
        });
      }
    } catch (error) {
      console.warn(`Sound system error: ${error}`);
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