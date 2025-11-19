/**
 * Analytics Service
 * Firebase Analytics wrapper for tracking events
 */

class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.enabled = true;
  }

  /**
   * Initialize analytics
   * Note: Firebase Analytics setup requires google-services.json
   * For now, this logs events to console in development
   */
  async initialize() {
    try {
      // In production, initialize Firebase Analytics here
      // import * as Analytics from 'expo-firebase-analytics';
      // await Analytics.setAnalyticsCollectionEnabled(true);

      this.initialized = true;
      console.log('Analytics initialized');
      return { success: true };
    } catch (error) {
      console.error('Analytics initialization error:', error);
      return { success: false, error };
    }
  }

  /**
   * Log event
   */
  async logEvent(eventName, params = {}) {
    if (!this.enabled) return;

    try {
      // In development, log to console
      if (__DEV__) {
        console.log(`[Analytics] ${eventName}`, params);
      }

      // In production, send to Firebase
      // await Analytics.logEvent(eventName, params);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  // === Game Events ===

  logGameStart() {
    this.logEvent('game_start', {
      timestamp: Date.now(),
    });
  }

  logGameOver(stats) {
    this.logEvent('game_over', {
      score: stats.score,
      distance: stats.distance,
      coins: stats.coins,
      passengers: stats.passengers,
      duration: stats.duration,
    });
  }

  logLevelUp(level) {
    this.logEvent('level_up', {
      level,
    });
  }

  // === Monetization Events ===

  logAdImpression(placement, adType, revenue = 0) {
    this.logEvent('ad_impression', {
      ad_placement: placement,
      ad_type: adType,
      revenue_inr: revenue,
      ad_network: 'admob',
    });
  }

  logAdClick(placement, adType) {
    this.logEvent('ad_click', {
      ad_placement: placement,
      ad_type: adType,
    });
  }

  logAdReward(placement, reward) {
    this.logEvent('ad_reward', {
      ad_placement: placement,
      reward_type: reward,
    });
  }

  logPurchaseAttempt(productId, price) {
    this.logEvent('purchase_attempt', {
      product_id: productId,
      price_inr: price,
    });
  }

  logPurchaseComplete(productId, price, currency = 'INR') {
    this.logEvent('purchase', {
      product_id: productId,
      price: price,
      currency: currency,
    });
  }

  // === Progression Events ===

  logMissionComplete(missionId, difficulty, reward) {
    this.logEvent('mission_complete', {
      mission_id: missionId,
      difficulty,
      reward_coins: reward,
    });
  }

  logAchievementUnlock(achievementId) {
    this.logEvent('achievement_unlock', {
      achievement_id: achievementId,
    });
  }

  logItemPurchase(itemId, category, price) {
    this.logEvent('item_purchase', {
      item_id: itemId,
      category,
      price_coins: price,
    });
  }

  // === Engagement Events ===

  logScreenView(screenName) {
    this.logEvent('screen_view', {
      screen_name: screenName,
    });
  }

  logTutorialComplete() {
    this.logEvent('tutorial_complete');
  }

  logShare(method) {
    this.logEvent('share', {
      method, // 'whatsapp', 'instagram', etc.
    });
  }

  // === Retention Events ===

  logDailyLogin(streak) {
    this.logEvent('daily_login', {
      streak_days: streak,
    });
  }

  logSessionDuration(duration) {
    this.logEvent('session_duration', {
      duration_seconds: duration,
    });
  }

  /**
   * Set user properties
   */
  async setUserProperty(name, value) {
    try {
      if (__DEV__) {
        console.log(`[Analytics] User Property: ${name} = ${value}`);
      }

      // In production:
      // await Analytics.setUserProperty(name, value);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  /**
   * Set user ID
   */
  async setUserId(userId) {
    try {
      if (__DEV__) {
        console.log(`[Analytics] User ID: ${userId}`);
      }

      // In production:
      // await Analytics.setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

// Export singleton instance
export default new AnalyticsService();
