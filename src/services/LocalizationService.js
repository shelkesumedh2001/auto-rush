/**
 * Localization Service
 * Handles language switching and text formatting
 */

import { TRANSLATIONS } from '../data/translations';
import StorageService from './StorageService';

class LocalizationService {
  constructor() {
    this.currentLanguage = 'en';
    this.listeners = [];
  }

  /**
   * Initialize localization
   */
  async initialize() {
    const settings = await StorageService.getSettings();
    this.currentLanguage = settings.language || 'en';
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Set language
   */
  async setLanguage(language) {
    if (language !== 'en' && language !== 'hi') {
      console.warn(`Unsupported language: ${language}, defaulting to English`);
      language = 'en';
    }

    this.currentLanguage = language;

    // Save to storage
    const settings = await StorageService.getSettings();
    settings.language = language;
    await StorageService.saveSettings(settings);

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Translate key
   */
  t(key, variables = {}) {
    const translation = TRANSLATIONS[key];

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    let text = translation[this.currentLanguage] || translation.en || key;

    // Replace variables (e.g., {distance} → 1234)
    Object.keys(variables).forEach(varKey => {
      const placeholder = `{${varKey}}`;
      text = text.replace(placeholder, variables[varKey]);
    });

    return text;
  }

  /**
   * Format number according to Indian system
   */
  formatNumber(num) {
    if (this.currentLanguage === 'hi' && num >= 100000) {
      if (num >= 10000000) {
        // Crores (1 crore = 10 million)
        return `${(num / 10000000).toFixed(1)} करोड़`;
      } else if (num >= 100000) {
        // Lakhs (1 lakh = 100 thousand)
        return `${(num / 100000).toFixed(1)} लाख`;
      }
    }

    // English or small numbers - Indian comma placement
    return this.formatIndianNumber(num);
  }

  /**
   * Format with Indian comma system (1,00,000 not 100,000)
   */
  formatIndianNumber(num) {
    const str = num.toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);

    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }

    return lastThree;
  }

  /**
   * Format distance with units
   */
  formatDistance(meters) {
    if (meters >= 1000) {
      const km = (meters / 1000).toFixed(1);
      return this.currentLanguage === 'hi' ? `${km} किमी` : `${km} km`;
    }
    return this.currentLanguage === 'hi' ? `${Math.floor(meters)} मी` : `${Math.floor(meters)}m`;
  }

  /**
   * Format time (MM:SS)
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Add language change listener
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of language change
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    ];
  }
}

// Export singleton instance
export default new LocalizationService();
