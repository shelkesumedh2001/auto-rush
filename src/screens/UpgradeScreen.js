/**
 * Power-up Upgrade Screen
 * Upgrade power-ups to make them last longer
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { COLORS, SHADOWS } from '../config/colors';
import { POWERUP_UPGRADES } from '../config/constants3D';
import Button from '../components/ui/Button';
import LocalizationService from '../services/LocalizationService';

const POWERUP_INFO = {
  shield: {
    icon: '🛡️',
    name: { en: 'Shield', hi: 'ढाल' },
    description: { en: 'Protects from one collision', hi: 'एक टक्कर से बचाता है' },
    color: '#4169E1',
  },
  magnet: {
    icon: '🧲',
    name: { en: 'Coin Magnet', hi: 'सिक्का चुंबक' },
    description: { en: 'Automatically collect nearby coins', hi: 'पास के सिक्के स्वचालित रूप से इकट्ठा करें' },
    color: '#9370DB',
  },
  boost: {
    icon: '⚡',
    name: { en: 'Speed Boost', hi: 'गति बूस्ट' },
    description: { en: 'Temporary speed increase', hi: 'अस्थायी गति वृद्धि' },
    color: '#FFD700',
  },
  multiplier: {
    icon: '✖️',
    name: { en: 'Score Multiplier', hi: 'स्कोर गुणक' },
    description: { en: 'Double your score gains', hi: 'अपने स्कोर लाभ को दोगुना करें' },
    color: '#FF4500',
  },
};

const UpgradeScreen = ({ onClose }) => {
  const { user, upgradePowerup } = useUser();
  const [upgrading, setUpgrading] = useState(null);

  const handleUpgrade = async (powerupType) => {
    setUpgrading(powerupType);

    const currentLevel = user.powerupLevels[powerupType] || 1;
    const nextLevelData = POWERUP_UPGRADES[powerupType.toUpperCase()][currentLevel];

    if (nextLevelData) {
      await upgradePowerup(powerupType, nextLevelData.cost);
    }

    setUpgrading(null);
  };

  const renderPowerupCard = (powerupType) => {
    const info = POWERUP_INFO[powerupType];
    const currentLevel = user.powerupLevels[powerupType] || 1;
    const levels = POWERUP_UPGRADES[powerupType.toUpperCase()];
    const currentData = levels[currentLevel - 1];
    const nextData = levels[currentLevel];

    const isMaxLevel = currentLevel >= 5;
    const canAfford = nextData && user.coins >= nextData.cost;

    return (
      <View key={powerupType} style={[styles.card, { borderLeftColor: info.color }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer} style={{ backgroundColor: info.color }}>
            <Text style={styles.icon}>{info.icon}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.powerupName}>
              {LocalizationService.getLanguage() === 'hi' ? info.name.hi : info.name.en}
            </Text>
            <Text style={styles.powerupDescription}>
              {LocalizationService.getLanguage() === 'hi'
                ? info.description.hi
                : info.description.en}
            </Text>
          </View>
        </View>

        {/* Level progress */}
        <View style={styles.levelSection}>
          <View style={styles.levelBar}>
            {[1, 2, 3, 4, 5].map(level => (
              <View
                key={level}
                style={[
                  styles.levelDot,
                  level <= currentLevel && styles.levelDotActive,
                  { backgroundColor: level <= currentLevel ? info.color : '#444' },
                ]}
              />
            ))}
          </View>
          <Text style={styles.levelText}>
            Level {currentLevel} / 5
          </Text>
        </View>

        {/* Current stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Current</Text>
            <Text style={styles.statValue}>{currentData.duration}s</Text>
          </View>
          {nextData && (
            <>
              <Text style={styles.arrow}>→</Text>
              <View style={[styles.statBox, styles.statBoxNext]}>
                <Text style={styles.statLabel}>Next Level</Text>
                <Text style={[styles.statValue, { color: COLORS.SUCCESS }]}>
                  {nextData.duration}s
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Upgrade button */}
        {isMaxLevel ? (
          <View style={styles.maxLevelBadge}>
            <Text style={styles.maxLevelText}>⭐ MAX LEVEL ⭐</Text>
          </View>
        ) : (
          <Button
            variant="success"
            size="medium"
            onPress={() => handleUpgrade(powerupType)}
            loading={upgrading === powerupType}
            disabled={!canAfford}
            style={styles.upgradeButton}
          >
            UPGRADE - 🪙 {nextData.cost}
            {!canAfford && '\n(Not enough coins)'}
          </Button>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Upgrade Power-ups</Text>
        <Text style={styles.subtitle}>Make them last longer!</Text>
        <Text style={styles.coinsDisplay}>🪙 {user.coins}</Text>
      </View>

      {/* Power-up cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(POWERUP_INFO).map(renderPowerupCard)}

        {/* Tip box */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Pro Tip</Text>
          <Text style={styles.tipText}>
            Upgraded power-ups last longer, giving you more time to collect coins and score
            points!
          </Text>
        </View>
      </ScrollView>

      {/* Back button */}
      <View style={styles.footer}>
        <Button variant="secondary" size="large" onPress={onClose} style={styles.backButton}>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 16,
  },
  coinsDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
    ...SHADOWS.MEDIUM,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  headerInfo: {
    flex: 1,
  },
  powerupName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  powerupDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  levelSection: {
    marginBottom: 16,
  },
  levelBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  levelDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  levelDotActive: {
    opacity: 1,
  },
  levelText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statBoxNext: {
    borderWidth: 2,
    borderColor: COLORS.SUCCESS,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    marginHorizontal: 8,
  },
  upgradeButton: {
    width: '100%',
  },
  maxLevelBadge: {
    backgroundColor: COLORS.SUCCESS,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  maxLevelText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipBox: {
    backgroundColor: COLORS.PRIMARY + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...SHADOWS.MEDIUM,
  },
  backButton: {
    width: '100%',
  },
});

export default UpgradeScreen;
