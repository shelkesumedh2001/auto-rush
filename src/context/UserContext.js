/**
 * User Context
 * Global state for user data (coins, purchases, progress)
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';
import { GAME_3D } from '../config/constants3D';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    coins: 0,
    highScore: 0,
    totalDistance: 0,
    level: 1,
    xp: 0,
    gamesPlayed: 0,
    loaded: false,

    // Lives system (Phase 2)
    lives: GAME_3D.LIVES.MAX_LIVES,
    lastLifeRegenTime: Date.now(),
    freeContinuesUsedToday: 0,
    lastContinueDate: null,

    // Character selection (Phase 2)
    selectedCharacter: 'standard',
    ownedCharacters: ['standard'], // Free character

    // Power-up upgrades (Phase 2)
    powerupLevels: {
      shield: 1,
      magnet: 1,
      boost: 1,
      multiplier: 1,
    },
  });

  const [purchases, setPurchases] = useState({
    adsRemoved: false,
    vipPass: false,
    premiumStart: false,
  });

  const [equippedItems, setEquippedItems] = useState({
    bodyPaint: 'body_mumbai',
    lights: 'lights_none',
    horn: 'horn_standard',
    accessory: 'accessory_none',
  });

  const [ownedItems, setOwnedItems] = useState({
    bodyPaint: ['body_mumbai'],
    lights: ['lights_none'],
    horns: ['horn_standard'],
    accessories: ['accessory_none'],
  });

  const [powerupInventory, setPowerupInventory] = useState({
    shield: 0,
    magnet: 0,
    speedBoost: 0,
    multiplier: 0,
  });

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await StorageService.getUserData();
      const purchaseData = await StorageService.getPurchases();
      const equipped = await StorageService.getEquippedItems();
      const owned = await StorageService.getOwnedItems();
      const powerups = await StorageService.getPowerupInventory();

      setUser({ ...userData, loaded: true });
      setPurchases(purchaseData);
      setEquippedItems(equipped);
      setOwnedItems(owned);
      setPowerupInventory(powerups);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const addCoins = async (amount) => {
    const newCoins = await StorageService.updateCoins(amount);
    setUser(prev => ({ ...prev, coins: newCoins }));
    return newCoins;
  };

  const spendCoins = async (amount) => {
    if (user.coins >= amount) {
      const newCoins = await StorageService.updateCoins(-amount);
      setUser(prev => ({ ...prev, coins: newCoins }));
      return true;
    }
    return false;
  };

  const updateHighScore = async (score) => {
    const isNewRecord = await StorageService.saveHighScore(score);
    if (isNewRecord) {
      setUser(prev => ({ ...prev, highScore: score }));
    }
    return isNewRecord;
  };

  const updateTotalDistance = async (distance) => {
    const userData = await StorageService.getUserData();
    userData.totalDistance += distance;
    await StorageService.saveUserData(userData);
    setUser(prev => ({ ...prev, totalDistance: userData.totalDistance }));
  };

  const purchaseItem = async (category, itemId, price) => {
    if (await spendCoins(price)) {
      const updated = await StorageService.addOwnedItem(category, itemId);
      setOwnedItems(updated);
      return true;
    }
    return false;
  };

  const equipItem = async (category, itemId) => {
    await StorageService.equipItem(category, itemId);
    setEquippedItems(prev => ({ ...prev, [category]: itemId }));
  };

  const setPurchase = async (purchaseId, value = true) => {
    await StorageService.savePurchase(purchaseId, value);
    setPurchases(prev => ({ ...prev, [purchaseId]: value }));
  };

  const addPowerup = async (type, count = 1) => {
    await StorageService.updatePowerupInventory(type, count);
    setPowerupInventory(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + count,
    }));
  };

  const usePowerup = async (type) => {
    if (powerupInventory[type] > 0) {
      await StorageService.updatePowerupInventory(type, -1);
      setPowerupInventory(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1),
      }));
      return true;
    }
    return false;
  };

  // Lives system functions (Phase 2)
  const regenerateLives = () => {
    const now = Date.now();
    const timeSinceLastRegen = (now - user.lastLifeRegenTime) / 1000; // seconds
    const livesToAdd = Math.floor(timeSinceLastRegen / GAME_3D.LIVES.REGENERATION_TIME);

    if (livesToAdd > 0 && user.lives < GAME_3D.LIVES.MAX_LIVES) {
      const newLives = Math.min(user.lives + livesToAdd, GAME_3D.LIVES.MAX_LIVES);
      const newRegenTime = now - ((timeSinceLastRegen % GAME_3D.LIVES.REGENERATION_TIME) * 1000);

      setUser(prev => ({
        ...prev,
        lives: newLives,
        lastLifeRegenTime: newRegenTime,
      }));

      StorageService.saveUserData({
        ...user,
        lives: newLives,
        lastLifeRegenTime: newRegenTime,
      });
    }
  };

  const useLife = async () => {
    if (user.lives > 0) {
      const newLives = user.lives - 1;
      setUser(prev => ({ ...prev, lives: newLives }));
      await StorageService.saveUserData({ ...user, lives: newLives });
      return true;
    }
    return false;
  };

  const addLife = async () => {
    if (user.lives < GAME_3D.LIVES.MAX_LIVES) {
      const newLives = user.lives + 1;
      setUser(prev => ({ ...prev, lives: newLives }));
      await StorageService.saveUserData({ ...user, lives: newLives });
    }
  };

  const canUseFreeContinue = () => {
    const today = new Date().toDateString();
    const lastDate = user.lastContinueDate ? new Date(user.lastContinueDate).toDateString() : null;

    // Reset counter if it's a new day
    if (lastDate !== today) {
      setUser(prev => ({
        ...prev,
        freeContinuesUsedToday: 0,
        lastContinueDate: Date.now(),
      }));
      return true;
    }

    return user.freeContinuesUsedToday < GAME_3D.LIVES.FREE_CONTINUES_PER_DAY;
  };

  const useFreeContinue = async () => {
    const today = Date.now();
    const newCount = user.freeContinuesUsedToday + 1;

    setUser(prev => ({
      ...prev,
      freeContinuesUsedToday: newCount,
      lastContinueDate: today,
    }));

    await StorageService.saveUserData({
      ...user,
      freeContinuesUsedToday: newCount,
      lastContinueDate: today,
    });
  };

  // Character functions (Phase 2)
  const selectCharacter = async (characterId) => {
    setUser(prev => ({ ...prev, selectedCharacter: characterId }));
    await StorageService.saveUserData({ ...user, selectedCharacter: characterId });
  };

  const unlockCharacter = async (characterId, price) => {
    if (await spendCoins(price)) {
      const newOwned = [...user.ownedCharacters, characterId];
      setUser(prev => ({ ...prev, ownedCharacters: newOwned }));
      await StorageService.saveUserData({ ...user, ownedCharacters: newOwned });
      return true;
    }
    return false;
  };

  // Power-up upgrade functions (Phase 2)
  const upgradePowerup = async (powerupType, cost) => {
    if (await spendCoins(cost)) {
      const currentLevel = user.powerupLevels[powerupType] || 1;
      const newLevel = Math.min(currentLevel + 1, 5);

      setUser(prev => ({
        ...prev,
        powerupLevels: {
          ...prev.powerupLevels,
          [powerupType]: newLevel,
        },
      }));

      await StorageService.saveUserData({
        ...user,
        powerupLevels: {
          ...user.powerupLevels,
          [powerupType]: newLevel,
        },
      });

      return true;
    }
    return false;
  };

  const getPowerupLevel = (powerupType) => {
    return user.powerupLevels[powerupType] || 1;
  };

  // Check for life regeneration periodically
  useEffect(() => {
    if (user.loaded) {
      regenerateLives();
      const interval = setInterval(regenerateLives, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [user.loaded, user.lives, user.lastLifeRegenTime]);

  const value = {
    user,
    purchases,
    equippedItems,
    ownedItems,
    powerupInventory,
    addCoins,
    spendCoins,
    updateHighScore,
    updateTotalDistance,
    purchaseItem,
    equipItem,
    setPurchase,
    addPowerup,
    usePowerup,
    reload: loadUserData,

    // Phase 2: Lives & Energy
    useLife,
    addLife,
    regenerateLives,
    canUseFreeContinue,
    useFreeContinue,

    // Phase 2: Characters
    selectCharacter,
    unlockCharacter,

    // Phase 2: Power-up Upgrades
    upgradePowerup,
    getPowerupLevel,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
