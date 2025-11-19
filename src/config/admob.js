/**
 * AdMob Configuration
 * Ad unit IDs and monetization settings
 */

import { Platform } from 'react-native';

// Test ad unit IDs (use during development)
const TEST_ADS = {
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
};

// Production ad unit IDs (replace with your actual AdMob IDs)
const PRODUCTION_ADS = {
  ANDROID: {
    APP_ID: process.env.ADMOB_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
    REWARDED_CONTINUE: process.env.ADMOB_REWARDED_CONTINUE || TEST_ADS.REWARDED,
    REWARDED_DOUBLE_COINS: process.env.ADMOB_REWARDED_DOUBLE || TEST_ADS.REWARDED,
    REWARDED_FREE_POWERUP: process.env.ADMOB_REWARDED_POWERUP || TEST_ADS.REWARDED,
    INTERSTITIAL_GAME_OVER: process.env.ADMOB_INTERSTITIAL || TEST_ADS.INTERSTITIAL,
    INTERSTITIAL_MAIN_MENU: process.env.ADMOB_INTERSTITIAL || TEST_ADS.INTERSTITIAL,
    BANNER_SHOP: process.env.ADMOB_BANNER || TEST_ADS.BANNER,
  },
  IOS: {
    // iOS ad units (if you expand to iOS later)
    APP_ID: 'ca-app-pub-XXXXX~XXXXX',
    REWARDED_CONTINUE: TEST_ADS.REWARDED,
    REWARDED_DOUBLE_COINS: TEST_ADS.REWARDED,
    REWARDED_FREE_POWERUP: TEST_ADS.REWARDED,
    INTERSTITIAL_GAME_OVER: TEST_ADS.INTERSTITIAL,
    INTERSTITIAL_MAIN_MENU: TEST_ADS.INTERSTITIAL,
    BANNER_SHOP: TEST_ADS.BANNER,
  },
};

// Get ad units for current platform
const getAdUnits = () => {
  if (Platform.OS === 'ios') {
    return PRODUCTION_ADS.IOS;
  }
  return PRODUCTION_ADS.ANDROID;
};

export const AD_UNITS = getAdUnits();

// Ad frequency controls (prevent ad fatigue)
export const AD_FREQUENCY = {
  // Interstitial frequency
  MIN_INTERSTITIAL_GAP: 180000, // 3 minutes in milliseconds
  GAME_OVER_INTERSTITIAL_FREQUENCY: 3, // Show every 3rd game over

  // Rewarded ad availability
  CONTINUE_AD_COOLDOWN: 0, // No cooldown, always available
  DOUBLE_COINS_COOLDOWN: 0, // No cooldown
  FREE_POWERUP_COOLDOWN: 86400000, // 24 hours

  // Session limits (anti-spam)
  MAX_REWARDED_PER_SESSION: 50, // Generous limit
  MAX_INTERSTITIAL_PER_SESSION: 10,
};

// eCPM rates for India (for analytics/revenue tracking)
export const ECPM_RATES = {
  REWARDED: 1.2, // ₹1.20 per view (average in India)
  INTERSTITIAL: 0.4, // ₹0.40 per view
  BANNER: 0.05, // ₹0.05 per impression
};

// Ad placement names (for analytics)
export const AD_PLACEMENTS = {
  CONTINUE_AFTER_CRASH: 'continue_after_crash',
  DOUBLE_COINS_GAME_OVER: 'double_coins_game_over',
  FREE_DAILY_POWERUP: 'free_daily_powerup',
  GAME_OVER_INTERSTITIAL: 'game_over_interstitial',
  MAIN_MENU_INTERSTITIAL: 'main_menu_interstitial',
  SHOP_BANNER: 'shop_banner',
};

// Test mode configuration
export const AD_CONFIG = {
  USE_TEST_ADS: __DEV__, // Use test ads in development
  SHOW_AD_INSPECTOR: __DEV__, // Show ad inspector in dev mode
};

export default AD_UNITS;
