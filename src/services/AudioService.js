/**
 * Audio Service
 * Manages sound effects and music playback
 */

import { Audio } from 'expo-av';
import StorageService from './StorageService';

class AudioService {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.7;
    this.sfxVolume = 0.8;
    this.initialized = false;
  }

  /**
   * Initialize audio system
   */
  async initialize() {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load settings
      const settings = await StorageService.getSettings();
      this.musicVolume = settings.musicVolume || 0.7;
      this.sfxVolume = settings.sfxVolume || 0.8;

      this.initialized = true;
      return { success: true };
    } catch (error) {
      console.error('Audio initialization error:', error);
      return { success: false, error };
    }
  }

  /**
   * Load a sound effect
   */
  async loadSound(name, source) {
    try {
      if (this.sounds[name]) {
        // Already loaded
        return this.sounds[name];
      }

      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds[name] = sound;
      return sound;
    } catch (error) {
      console.error(`Error loading sound ${name}:`, error);
      return null;
    }
  }

  /**
   * Play sound effect
   */
  async playSound(name, options = {}) {
    try {
      const sound = this.sounds[name];
      if (!sound) {
        console.warn(`Sound ${name} not loaded`);
        return;
      }

      // Set volume
      await sound.setVolumeAsync(options.volume !== undefined ? options.volume : this.sfxVolume);

      // Rewind to start
      await sound.setPositionAsync(0);

      // Play
      await sound.playAsync();
    } catch (error) {
      console.error(`Error playing sound ${name}:`, error);
    }
  }

  /**
   * Play music (looping)
   */
  async playMusic(source, loop = true) {
    try {
      // Stop current music
      if (this.music) {
        await this.music.stopAsync();
        await this.music.unloadAsync();
      }

      // Load and play new music
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: loop,
        volume: this.musicVolume,
      });

      this.music = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }

  /**
   * Stop music
   */
  async stopMusic() {
    if (this.music) {
      try {
        await this.music.stopAsync();
      } catch (error) {
        console.error('Error stopping music:', error);
      }
    }
  }

  /**
   * Pause music
   */
  async pauseMusic() {
    if (this.music) {
      try {
        await this.music.pauseAsync();
      } catch (error) {
        console.error('Error pausing music:', error);
      }
    }
  }

  /**
   * Resume music
   */
  async resumeMusic() {
    if (this.music) {
      try {
        await this.music.playAsync();
      } catch (error) {
        console.error('Error resuming music:', error);
      }
    }
  }

  /**
   * Set music volume
   */
  async setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));

    if (this.music) {
      try {
        await this.music.setVolumeAsync(this.musicVolume);
      } catch (error) {
        console.error('Error setting music volume:', error);
      }
    }

    // Save to settings
    const settings = await StorageService.getSettings();
    settings.musicVolume = this.musicVolume;
    await StorageService.saveSettings(settings);
  }

  /**
   * Set SFX volume
   */
  async setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));

    // Save to settings
    const settings = await StorageService.getSettings();
    settings.sfxVolume = this.sfxVolume;
    await StorageService.saveSettings(settings);
  }

  /**
   * Unload all sounds
   */
  async unloadAll() {
    // Unload SFX
    for (const name in this.sounds) {
      try {
        await this.sounds[name].unloadAsync();
      } catch (error) {
        console.error(`Error unloading sound ${name}:`, error);
      }
    }
    this.sounds = {};

    // Unload music
    if (this.music) {
      try {
        await this.music.unloadAsync();
      } catch (error) {
        console.error('Error unloading music:', error);
      }
      this.music = null;
    }
  }
}

// Export singleton instance
export default new AudioService();
