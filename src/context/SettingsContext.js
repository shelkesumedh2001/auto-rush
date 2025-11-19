/**
 * Settings Context
 * Global state for user preferences
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';
import LocalizationService from '../services/LocalizationService';
import AudioService from '../services/AudioService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    language: 'en',
    musicVolume: 0.7,
    sfxVolume: 0.8,
    vibration: true,
    graphicsQuality: 'medium',
    showFPS: false,
    loaded: false,
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      setSettings({ ...savedSettings, loaded: true });

      // Apply settings to services
      LocalizationService.setLanguage(savedSettings.language);
      AudioService.setMusicVolume(savedSettings.musicVolume);
      AudioService.setSFXVolume(savedSettings.sfxVolume);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await StorageService.saveSettings(updated);

    // Apply to services
    if (newSettings.language) {
      await LocalizationService.setLanguage(newSettings.language);
    }
    if (newSettings.musicVolume !== undefined) {
      await AudioService.setMusicVolume(newSettings.musicVolume);
    }
    if (newSettings.sfxVolume !== undefined) {
      await AudioService.setSFXVolume(newSettings.sfxVolume);
    }
  };

  const setLanguage = async (language) => {
    await updateSettings({ language });
  };

  const setMusicVolume = async (volume) => {
    await updateSettings({ musicVolume: volume });
  };

  const setSFXVolume = async (volume) => {
    await updateSettings({ sfxVolume: volume });
  };

  const setVibration = async (enabled) => {
    await updateSettings({ vibration: enabled });
  };

  const setGraphicsQuality = async (quality) => {
    await updateSettings({ graphicsQuality: quality });
  };

  const toggleFPS = async () => {
    await updateSettings({ showFPS: !settings.showFPS });
  };

  const value = {
    settings,
    updateSettings,
    setLanguage,
    setMusicVolume,
    setSFXVolume,
    setVibration,
    setGraphicsQuality,
    toggleFPS,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export default SettingsContext;
