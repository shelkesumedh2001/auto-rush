/**
 * User Context
 * Global state for user data (coins, purchases, progress)
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';

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
