/**
 * Season Pass Screen
 * Battle Pass style progression system
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react';
import { useUser } from '../context/UserContext';
import { COLORS, SHADOWS } from '../config/colors';
import Button from '../components/ui/Button';
import IAPManager from '../monetization/IAPManager';
import LocalizationService from '../services/LocalizationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Season Pass configuration
const SEASON_CONFIG = {
  name: 'Mumbai Monsoon Season',
  endDate: '2025-12-31',
  maxLevel: 30,
  priceUSD: 9.99,
  priceCoins: 5000,
};

// Rewards for each level (simplified - would be more elaborate in production)
const generateRewards = () => {
  const rewards = [];
  for (let level = 1; level <= SEASON_CONFIG.maxLevel; level++) {
    rewards.push({
      level,
      free: {
        coins: level * 100,
        type: 'coins',
      },
      premium: {
        ...getSpecialReward(level),
      },
    });
  }
  return rewards;
};

const getSpecialReward = (level) => {
  if (level === 5) return { type: 'character', id: 'speed_demon', name: 'Speed Demon' };
  if (level === 10) return { type: 'coins', amount: 2000 };
  if (level === 15) return { type: 'character', id: 'tank', name: 'Iron Tank' };
  if (level === 20) return { type: 'powerup_pack', amount: 10, name: '10 Power-ups' };
  if (level === 25) return { type: 'character', id: 'magnet_master', name: 'Coin Magnet' };
  if (level === 30) return { type: 'character', id: 'lucky', name: 'Lucky Star + 5000 Coins' };

  return { type: 'coins', amount: level * 50 };
};

const SeasonPassScreen = ({ onClose }) => {
  const { user, purchases, setPurchase } = useUser();
  const [purchasing, setPurchasing] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(5); // Mock current level
  const hasPremiumPass = purchases.seasonPass || false;

  const rewards = generateRewards();

  const handlePurchasePass = async () => {
    setPurchasing(true);

    // Try IAP first
    const iapSuccess = await IAPManager.purchaseProduct('season_pass');

    if (iapSuccess) {
      await setPurchase('seasonPass', true);
    }

    setPurchasing(false);
  };

  const renderRewardTier = (reward) => {
    const isUnlocked = reward.level <= currentLevel;
    const isPremium = reward.premium;
    const isFree = reward.free;

    return (
      <View key={reward.level} style={styles.tierContainer}>
        {/* Level indicator */}
        <View style={[styles.levelBadge, isUnlocked && styles.levelBadgeUnlocked]}>
          <Text style={styles.levelText}>{reward.level}</Text>
        </View>

        {/* Free reward */}
        <View style={[styles.rewardBox, styles.freeReward]}>
          <Text style={styles.rewardType}>FREE</Text>
          <View style={[styles.rewardContent, !isUnlocked && styles.rewardLocked]}>
            <Text style={styles.rewardIcon}>🪙</Text>
            <Text style={styles.rewardAmount}>{reward.free.coins}</Text>
          </View>
          {isUnlocked && (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedText}>✓</Text>
            </View>
          )}
        </View>

        {/* Premium reward */}
        <View style={[styles.rewardBox, styles.premiumReward]}>
          <Text style={styles.rewardType}>PREMIUM</Text>
          <View
            style={[
              styles.rewardContent,
              (!isUnlocked || !hasPremiumPass) && styles.rewardLocked,
            ]}
          >
            {reward.premium.type === 'character' ? (
              <>
                <Text style={styles.rewardIcon}>🛺</Text>
                <Text style={styles.rewardName}>{reward.premium.name}</Text>
              </>
            ) : reward.premium.type === 'powerup_pack' ? (
              <>
                <Text style={styles.rewardIcon}>⚡</Text>
                <Text style={styles.rewardName}>{reward.premium.name}</Text>
              </>
            ) : (
              <>
                <Text style={styles.rewardIcon}>🪙</Text>
                <Text style={styles.rewardAmount}>{reward.premium.amount}</Text>
              </>
            )}
          </View>
          {isUnlocked && hasPremiumPass && (
            <View style={styles.claimedBadge}>
              <Text style={styles.claimedText}>✓</Text>
            </View>
          )}
          {!hasPremiumPass && (
            <View style={styles.lockedIcon}>
              <Text>🔒</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{SEASON_CONFIG.name}</Text>
        <Text style={styles.subtitle}>Level {currentLevel} / {SEASON_CONFIG.maxLevel}</Text>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentLevel / SEASON_CONFIG.maxLevel) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.endDate}>
          Ends: {SEASON_CONFIG.endDate}
        </Text>
      </View>

      {/* Rewards list */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.rewardsList}
        showsVerticalScrollIndicator={false}
      >
        {rewards.map(renderRewardTier)}
      </ScrollView>

      {/* Purchase panel */}
      {!hasPremiumPass && (
        <View style={styles.purchasePanel}>
          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseTitle}>Unlock Premium Pass</Text>
            <Text style={styles.purchaseDescription}>
              Get exclusive characters, extra coins, and special rewards!
            </Text>

            <View style={styles.benefitsList}>
              <Text style={styles.benefit}>✓ All premium rewards</Text>
              <Text style={styles.benefit}>✓ 4 Exclusive characters</Text>
              <Text style={styles.benefit}>✓ 10,000+ bonus coins</Text>
              <Text style={styles.benefit}>✓ Power-up packs</Text>
            </View>
          </View>

          <Button
            variant="success"
            size="large"
            onPress={handlePurchasePass}
            loading={purchasing}
            style={styles.purchaseButton}
          >
            BUY PASS - ${SEASON_CONFIG.priceUSD}
          </Button>
        </View>
      )}

      {/* Back button */}
      <View style={styles.footer}>
        <Button variant="secondary" size="medium" onPress={onClose}>
          BACK
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...SHADOWS.MEDIUM,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.SUCCESS,
  },
  endDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  rewardsList: {
    padding: 16,
    gap: 12,
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.TEXT_DISABLED,
  },
  levelBadgeUnlocked: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  rewardBox: {
    flex: 1,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    position: 'relative',
    ...SHADOWS.SMALL,
  },
  freeReward: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
  },
  premiumReward: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.SUCCESS,
  },
  rewardType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  rewardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardLocked: {
    opacity: 0.3,
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  rewardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  rewardName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  claimedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  purchasePanel: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    padding: 20,
    ...SHADOWS.LARGE,
  },
  purchaseInfo: {
    marginBottom: 16,
  },
  purchaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  purchaseDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 8,
  },
  benefit: {
    fontSize: 14,
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  purchaseButton: {
    width: '100%',
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
});

export default SeasonPassScreen;
