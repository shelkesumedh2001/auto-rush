/**
 * Storage Service
 * AsyncStorage wrapper for persisting game data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Storage keys
  static KEYS = {
    USER_DATA: '@auto_rush_user_data',
    HIGH_SCORE: '@auto_rush_high_score',
    TOTAL_DISTANCE: '@auto_rush_total_distance',
    COINS: '@auto_rush_coins',
    PURCHASES: '@auto_rush_purchases',
    SETTINGS: '@auto_rush_settings',
    DAILY_MISSIONS: '@auto_rush_daily_missions',
    ACHIEVEMENTS: '@auto_rush_achievements',
    LAST_MISSION_RESET: '@auto_rush_last_mission_reset',
    TUTORIAL_COMPLETED: '@auto_rush_tutorial_completed',
    DAILY_STREAK: '@auto_rush_daily_streak',
    LAST_PLAY_DATE: '@auto_rush_last_play_date',
    EQUIPPED_ITEMS: '@auto_rush_equipped_items',
    OWNED_ITEMS: '@auto_rush_owned_items',
    POWERUP_INVENTORY: '@auto_rush_powerup_inventory',
    STATS: '@auto_rush_stats',
  };

  /**
   * Save data to storage
   */
  static async save(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return { success: true };
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return { success: false, error };
    }
  }

  /**
   * Load data from storage
   */
  static async load(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from storage
   */
  static async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return { success: false, error };
    }
  }

  /**
   * Clear all game data (for reset)
   */
  static async clearAll() {
    try {
      const keys = Object.values(this.KEYS);
      await AsyncStorage.multiRemove(keys);
      return { success: true };
    } catch (error) {
      console.error('Error clearing storage:', error);
      return { success: false, error };
    }
  }

  // === User Data Methods ===

  static async getUserData() {
    return await this.load(this.KEYS.USER_DATA, {
      highScore: 0,
      totalDistance: 0,
      coins: 0,
      level: 1,
      xp: 0,
      gamesPlayed: 0,
      totalPassengers: 0,
      totalCoinsCollected: 0,
      totalNearMisses: 0,
    });
  }

  static async saveUserData(data) {
    return await this.save(this.KEYS.USER_DATA, data);
  }

  static async updateCoins(amount) {
    const userData = await this.getUserData();
    userData.coins = Math.max(0, userData.coins + amount);
    await this.saveUserData(userData);
    return userData.coins;
  }

  // === High Score ===

  static async getHighScore() {
    return await this.load(this.KEYS.HIGH_SCORE, 0);
  }

  static async saveHighScore(score) {
    const current = await this.getHighScore();
    if (score > current) {
      await this.save(this.KEYS.HIGH_SCORE, score);
      return true; // New record
    }
    return false;
  }

  // === Settings ===

  static async getSettings() {
    return await this.load(this.KEYS.SETTINGS, {
      language: 'en',
      musicVolume: 0.7,
      sfxVolume: 0.8,
      vibration: true,
      graphicsQuality: 'medium',
      showFPS: false,
    });
  }

  static async saveSettings(settings) {
    return await this.save(this.KEYS.SETTINGS, settings);
  }

  // === Purchases ===

  static async getPurchases() {
    return await this.load(this.KEYS.PURCHASES, {
      adsRemoved: false,
      vipPass: false,
      premiumStart: false,
    });
  }

  static async savePurchase(purchaseId, value = true) {
    const purchases = await this.getPurchases();
    purchases[purchaseId] = value;
    return await this.save(this.KEYS.PURCHASES, purchases);
  }

  // === Daily Missions ===

  static async getDailyMissions() {
    return await this.load(this.KEYS.DAILY_MISSIONS, []);
  }

  static async saveDailyMissions(missions) {
    return await this.save(this.KEYS.DAILY_MISSIONS, missions);
  }

  static async getLastMissionReset() {
    return await this.load(this.KEYS.LAST_MISSION_RESET, null);
  }

  static async saveLastMissionReset(date) {
    return await this.save(this.KEYS.LAST_MISSION_RESET, date);
  }

  // === Achievements ===

  static async getAchievements() {
    return await this.load(this.KEYS.ACHIEVEMENTS, {});
  }

  static async saveAchievement(achievementId, progress = 0, completed = false) {
    const achievements = await this.getAchievements();
    achievements[achievementId] = { progress, completed, unlockedAt: completed ? Date.now() : null };
    return await this.save(this.KEYS.ACHIEVEMENTS, achievements);
  }

  // === Tutorial ===

  static async isTutorialCompleted() {
    return await this.load(this.KEYS.TUTORIAL_COMPLETED, false);
  }

  static async setTutorialCompleted() {
    return await this.save(this.KEYS.TUTORIAL_COMPLETED, true);
  }

  // === Daily Streak ===

  static async getDailyStreak() {
    return await this.load(this.KEYS.DAILY_STREAK, 0);
  }

  static async updateDailyStreak() {
    const lastPlayDate = await this.load(this.KEYS.LAST_PLAY_DATE, null);
    const today = new Date().toDateString();

    if (lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      let streak = await this.getDailyStreak();

      if (lastPlayDate === yesterdayStr) {
        // Consecutive day
        streak += 1;
      } else {
        // Streak broken
        streak = 1;
      }

      await this.save(this.KEYS.DAILY_STREAK, streak);
      await this.save(this.KEYS.LAST_PLAY_DATE, today);

      return streak;
    }

    return await this.getDailyStreak();
  }

  // === Equipped Items ===

  static async getEquippedItems() {
    return await this.load(this.KEYS.EQUIPPED_ITEMS, {
      bodyPaint: 'body_mumbai',
      lights: 'lights_none',
      horn: 'horn_standard',
      accessory: 'accessory_none',
    });
  }

  static async equipItem(category, itemId) {
    const equipped = await this.getEquippedItems();
    equipped[category] = itemId;
    return await this.save(this.KEYS.EQUIPPED_ITEMS, equipped);
  }

  // === Owned Items ===

  static async getOwnedItems() {
    return await this.load(this.KEYS.OWNED_ITEMS, {
      bodyPaint: ['body_mumbai'],
      lights: ['lights_none'],
      horns: ['horn_standard'],
      accessories: ['accessory_none'],
    });
  }

  static async addOwnedItem(category, itemId) {
    const owned = await this.getOwnedItems();
    if (!owned[category].includes(itemId)) {
      owned[category].push(itemId);
      await this.save(this.KEYS.OWNED_ITEMS, owned);
    }
    return owned;
  }

  // === Power-up Inventory ===

  static async getPowerupInventory() {
    return await this.load(this.KEYS.POWERUP_INVENTORY, {
      shield: 0,
      magnet: 0,
      speedBoost: 0,
      multiplier: 0,
    });
  }

  static async updatePowerupInventory(powerupType, amount) {
    const inventory = await this.getPowerupInventory();
    inventory[powerupType] = Math.max(0, (inventory[powerupType] || 0) + amount);
    return await this.save(this.KEYS.POWERUP_INVENTORY, inventory);
  }

  // === Stats ===

  static async getStats() {
    return await this.load(this.KEYS.STATS, {
      totalGames: 0,
      totalCrashes: 0,
      totalCoins: 0,
      totalPassengers: 0,
      totalNearMisses: 0,
      totalPowerupsUsed: 0,
      longestRun: 0,
      highestCombo: 0,
      cowsAvoided: 0,
      cowsHit: 0,
    });
  }

  static async updateStats(updates) {
    const stats = await this.getStats();
    Object.keys(updates).forEach(key => {
      if (key.startsWith('total') || key === 'totalCoins') {
        stats[key] = (stats[key] || 0) + updates[key];
      } else {
        stats[key] = Math.max(stats[key] || 0, updates[key]);
      }
    });
    return await this.save(this.KEYS.STATS, stats);
  }
}

export default StorageService;
