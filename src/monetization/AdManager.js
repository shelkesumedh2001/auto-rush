/**
 * Ad Manager
 * Complete AdMob integration for all ad placements
 */

import { Platform } from 'react-native';
import { AD_UNITS, AD_FREQUENCY, AD_PLACEMENTS } from '../config/admob';
import AnalyticsService from '../services/AnalyticsService';

class AdManager {
  constructor() {
    this.initialized = false;
    this.lastInterstitialTime = 0;
    this.gameOverCount = 0;
    this.rewardedAdsShown = 0;
    this.interstitialAdsShown = 0;
    this.adsRemoved = false;
  }

  /**
   * Initialize AdMob
   */
  async initialize() {
    try {
      // Note: expo-ads-admob requires native configuration
      // For development, we'll mock the ad system

      if (__DEV__) {
        console.log('AdMob initialized in test mode');
        console.log('Ad Units:', AD_UNITS);
      }

      // In production, initialize like this:
      // import {
      //   AdMobBanner,
      //   AdMobInterstitial,
      //   AdMobRewarded,
      //   setTestDeviceIDAsync,
      // } from 'expo-ads-admob';
      //
      // await setTestDeviceIDAsync('EMULATOR');
      // await AdMobInterstitial.setAdUnitID(AD_UNITS.INTERSTITIAL_GAME_OVER);
      // await AdMobRewarded.setAdUnitID(AD_UNITS.REWARDED_CONTINUE);

      this.initialized = true;
      return { success: true };
    } catch (error) {
      console.error('AdMob initialization error:', error);
      return { success: false, error };
    }
  }

  /**
   * Set if ads are removed (via IAP)
   */
  setAdsRemoved(removed) {
    this.adsRemoved = removed;
  }

  // === REWARDED AD: Continue After Crash ===

  async showContinueAd() {
    if (this.adsRemoved) {
      return { success: false, reason: 'ads_removed' };
    }

    try {
      // In development, simulate ad
      if (__DEV__) {
        console.log('[AdMob] Showing Continue Ad (simulated)');
        await this.simulateAd(2000); // 2 second delay

        AnalyticsService.logAdImpression(
          AD_PLACEMENTS.CONTINUE_AFTER_CRASH,
          'rewarded',
          1.2
        );

        return { success: true, reward: 'continue' };
      }

      // Production implementation:
      // import { AdMobRewarded } from 'expo-ads-admob';
      //
      // await AdMobRewarded.setAdUnitID(AD_UNITS.REWARDED_CONTINUE);
      // await AdMobRewarded.requestAdAsync();
      // await AdMobRewarded.showAdAsync();
      //
      // return { success: true, reward: 'continue' };

      return { success: false, reason: 'not_implemented' };
    } catch (error) {
      console.error('Error showing continue ad:', error);
      return { success: false, error };
    }
  }

  // === REWARDED AD: Double Coins ===

  async showDoubleCoinsAd() {
    if (this.adsRemoved) {
      return { success: false, reason: 'ads_removed' };
    }

    try {
      if (__DEV__) {
        console.log('[AdMob] Showing Double Coins Ad (simulated)');
        await this.simulateAd(2000);

        AnalyticsService.logAdImpression(
          AD_PLACEMENTS.DOUBLE_COINS_GAME_OVER,
          'rewarded',
          1.2
        );

        return { success: true, reward: 'double_coins' };
      }

      // Production:
      // await AdMobRewarded.setAdUnitID(AD_UNITS.REWARDED_DOUBLE_COINS);
      // await AdMobRewarded.requestAdAsync();
      // await AdMobRewarded.showAdAsync();

      return { success: false, reason: 'not_implemented' };
    } catch (error) {
      console.error('Error showing double coins ad:', error);
      return { success: false, error };
    }
  }

  // === REWARDED AD: Free Daily Power-Up ===

  async showFreePowerupAd() {
    if (this.adsRemoved) {
      return { success: false, reason: 'ads_removed' };
    }

    try {
      if (__DEV__) {
        console.log('[AdMob] Showing Free Power-Up Ad (simulated)');
        await this.simulateAd(2000);

        AnalyticsService.logAdImpression(
          AD_PLACEMENTS.FREE_DAILY_POWERUP,
          'rewarded',
          1.2
        );

        return { success: true, reward: 'free_powerup' };
      }

      // Production:
      // await AdMobRewarded.setAdUnitID(AD_UNITS.REWARDED_FREE_POWERUP);
      // await AdMobRewarded.requestAdAsync();
      // await AdMobRewarded.showAdAsync();

      return { success: false, reason: 'not_implemented' };
    } catch (error) {
      console.error('Error showing free powerup ad:', error);
      return { success: false, error };
    }
  }

  // === INTERSTITIAL AD: Game Over ===

  async showGameOverInterstitial() {
    if (this.adsRemoved) {
      return { success: false, reason: 'ads_removed' };
    }

    // Check frequency limits
    if (!this.canShowInterstitial()) {
      return { success: false, reason: 'frequency_cap' };
    }

    try {
      if (__DEV__) {
        console.log('[AdMob] Showing Game Over Interstitial (simulated)');
        await this.simulateAd(1000);

        this.recordInterstitialShown();

        AnalyticsService.logAdImpression(
          AD_PLACEMENTS.GAME_OVER_INTERSTITIAL,
          'interstitial',
          0.4
        );

        return { success: true };
      }

      // Production:
      // import { AdMobInterstitial } from 'expo-ads-admob';
      // await AdMobInterstitial.setAdUnitID(AD_UNITS.INTERSTITIAL_GAME_OVER);
      // await AdMobInterstitial.requestAdAsync();
      // await AdMobInterstitial.showAdAsync();

      return { success: false, reason: 'not_implemented' };
    } catch (error) {
      console.error('Error showing interstitial:', error);
      return { success: false, error };
    }
  }

  // === Frequency Control ===

  canShowInterstitial() {
    const now = Date.now();
    const timeSinceLast = now - this.lastInterstitialTime;

    // Must be at least 3 minutes since last interstitial
    if (timeSinceLast < AD_FREQUENCY.MIN_INTERSTITIAL_GAP) {
      return false;
    }

    // Only show on every 3rd game over
    this.gameOverCount++;
    if (this.gameOverCount % AD_FREQUENCY.GAME_OVER_INTERSTITIAL_FREQUENCY !== 0) {
      return false;
    }

    return true;
  }

  recordInterstitialShown() {
    this.lastInterstitialTime = Date.now();
    this.interstitialAdsShown++;
  }

  // === Helper: Simulate Ad (Development) ===

  simulateAd(duration) {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    });
  }

  // === Get Ad Revenue Stats ===

  getStats() {
    return {
      rewardedAdsShown: this.rewardedAdsShown,
      interstitialAdsShown: this.interstitialAdsShown,
      estimatedRevenue:
        (this.rewardedAdsShown * 1.2) + // ₹1.20 per rewarded ad
        (this.interstitialAdsShown * 0.4), // ₹0.40 per interstitial
    };
  }
}

// Export singleton instance
export default new AdManager();
