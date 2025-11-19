/**
 * Continue Dialog Component
 * Appears after game over - offers continue options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { COLORS, SHADOWS } from '../config/colors';
import Button from './ui/Button';
import AdManager from '../monetization/AdManager';

const ContinueDialog = ({
  visible,
  onContinue,
  onMainMenu,
  currentScore,
  currentCoins,
}) => {
  const { user, spendCoins, canUseFreeContinue, useFreeContinue } = useUser();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Countdown timer
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleFreeContinue = async () => {
    if (canUseFreeContinue()) {
      await useFreeContinue();
      onContinue();
    }
  };

  const handleAdContinue = async () => {
    const success = await AdManager.showRewarded('continue_game');
    if (success) {
      onContinue();
    }
  };

  const handleCoinContinue = async () => {
    const CONTINUE_COST = 300;
    const success = await spendCoins(CONTINUE_COST);
    if (success) {
      onContinue();
    }
  };

  const canAffordCoinContinue = user.coins >= 300;
  const hasFreeContinue = canUseFreeContinue();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onMainMenu}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.dialog,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Continue?</Text>
            <Text style={styles.subtitle}>Don't give up!</Text>
          </View>

          {/* Current stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentScore}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentCoins} 🪙</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
          </View>

          {/* Countdown */}
          {countdown > 0 && (
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}

          {/* Continue options */}
          <View style={styles.options}>
            {/* Free continue (once per day) */}
            {hasFreeContinue && (
              <Button
                variant="success"
                size="large"
                onPress={handleFreeContinue}
                style={styles.optionButton}
              >
                FREE CONTINUE
                {'\n'}
                <Text style={styles.optionSubtext}>1 Free per Day</Text>
              </Button>
            )}

            {/* Watch ad to continue */}
            <Button
              variant="primary"
              size="large"
              onPress={handleAdContinue}
              style={styles.optionButton}
            >
              WATCH AD
              {'\n'}
              <Text style={styles.optionSubtext}>Continue Game</Text>
            </Button>

            {/* Use coins to continue */}
            <Button
              variant="secondary"
              size="large"
              onPress={handleCoinContinue}
              disabled={!canAffordCoinContinue}
              style={styles.optionButton}
            >
              300 COINS
              {'\n'}
              <Text style={styles.optionSubtext}>
                {canAffordCoinContinue ? 'Continue Game' : 'Not Enough Coins'}
              </Text>
            </Button>
          </View>

          {/* Give up option */}
          <TouchableOpacity
            onPress={onMainMenu}
            style={styles.giveUpButton}
            disabled={countdown > 0}
          >
            <Text style={[styles.giveUpText, countdown > 0 && styles.disabled]}>
              {countdown > 0 ? `Give Up (${countdown})` : 'Give Up'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.LARGE,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  countdownCircle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  options: {
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    minHeight: 70,
  },
  optionSubtext: {
    fontSize: 12,
    fontWeight: 'normal',
    opacity: 0.8,
  },
  giveUpButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  giveUpText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textDecorationLine: 'underline',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default ContinueDialog;
