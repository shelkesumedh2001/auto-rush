/**
 * Main Menu Screen
 * Central hub with play button, missions, stats
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../config/colors';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import LocalizationService from '../services/LocalizationService';
import Button from '../components/ui/Button';
import LivesDisplay from '../components/ui/LivesDisplay';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MainMenuScreen = ({
  onPlayPress,
  onShopPress,
  onSettingsPress,
  onMissionsPress,
  onLeaderboardPress,
  onCharacterPress,
  onUpgradePress,
  onSeasonPassPress,
}) => {
  const { user } = useUser();
  const { settings } = useSettings();
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Pulse animation for play button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
          <Text style={styles.icon}>⚙️</Text>
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={styles.title}>AUTO RUSH</Text>
          <LivesDisplay style={styles.livesDisplay} />
        </View>

        <View style={styles.coinDisplay}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinText}>{user.coins || 0}</Text>
        </View>
      </View>

      {/* Center - Auto Preview */}
      <View style={styles.center}>
        <View style={styles.autoPreview}>
          <Text style={styles.autoIcon}>🛺</Text>
        </View>

        <Text style={styles.playerName}>
          {LocalizationService.t('HIGH_SCORE')}: {user.highScore || 0}
        </Text>

        <Text style={styles.distance}>
          {LocalizationService.formatDistance(user.totalDistance || 0)} total
        </Text>
      </View>

      {/* Season Pass Banner */}
      <TouchableOpacity style={styles.seasonPassBanner} onPress={onSeasonPassPress}>
        <View style={styles.seasonPassContent}>
          <Text style={styles.seasonPassTitle}>🎁 SEASON PASS</Text>
          <Text style={styles.seasonPassSubtitle}>Exclusive rewards & characters!</Text>
        </View>
        <Text style={styles.seasonPassArrow}>›</Text>
      </TouchableOpacity>

      {/* Mission Panel */}
      <View style={styles.missionPanel}>
        <Text style={styles.missionTitle}>
          {LocalizationService.t('DAILY_MISSIONS')}
        </Text>
        <Text style={styles.missionSubtitle}>Complete missions for rewards</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={onCharacterPress}>
          <Text style={styles.quickActionIcon}>🛺</Text>
          <Text style={styles.quickActionLabel}>Characters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionButton} onPress={onUpgradePress}>
          <Text style={styles.quickActionIcon}>⬆️</Text>
          <Text style={styles.quickActionLabel}>Upgrades</Text>
        </TouchableOpacity>
      </View>

      {/* Play Button */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Button
          variant="success"
          size="large"
          onPress={onPlayPress}
          style={styles.playButton}
        >
          {LocalizationService.t('PLAY')}
        </Button>
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={onShopPress}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navLabel}>{LocalizationService.t('SHOP')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onMissionsPress}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>{LocalizationService.t('MISSIONS')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onLeaderboardPress}>
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>{LocalizationService.t('LEADERBOARD')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onSettingsPress}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>{LocalizationService.t('SETTINGS')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  topCenter: {
    alignItems: 'center',
    flex: 1,
  },
  livesDisplay: {
    marginTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoPreview: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 100,
    marginBottom: 24,
  },
  autoIcon: {
    fontSize: 100,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  seasonPassBanner: {
    backgroundColor: COLORS.SUCCESS,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seasonPassContent: {
    flex: 1,
  },
  seasonPassTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  seasonPassSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  seasonPassArrow: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
  missionPanel: {
    backgroundColor: COLORS.SURFACE,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  missionSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.SURFACE,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  playButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: COLORS.SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.TEXT_DISABLED,
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default MainMenuScreen;
