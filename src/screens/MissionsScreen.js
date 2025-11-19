/**
 * Missions Screen - Daily Missions
 * Shows 3 daily missions with progress tracking
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/colors';
import LocalizationService from '../services/LocalizationService';
import StorageService from '../services/StorageService';
import { generateDailyMissions } from '../data/missions';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';

const MissionsScreen = ({ onClose }) => {
  const { addCoins, addPowerup } = useUser();
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    let savedMissions = await StorageService.getDailyMissions();
    const lastReset = await StorageService.getLastMissionReset();
    const today = new Date().toDateString();

    // Reset missions if new day
    if (!lastReset || lastReset !== today) {
      savedMissions = generateDailyMissions();
      await StorageService.saveDailyMissions(savedMissions);
      await StorageService.saveLastMissionReset(today);
    }

    setMissions(savedMissions.length > 0 ? savedMissions : generateDailyMissions());
  };

  const claimReward = async (mission, index) => {
    // Award coins
    await addCoins(mission.reward.coins);

    // Award powerup if exists
    if (mission.reward.powerup) {
      await addPowerup(mission.reward.powerup, mission.reward.powerupCount || 1);
    }

    // Mark as claimed
    const updated = [...missions];
    updated[index].claimed = true;
    setMissions(updated);
    await StorageService.saveDailyMissions(updated);

    alert(`Claimed! +${mission.reward.coins} coins`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return COLORS.SUCCESS;
      case 'medium': return COLORS.WARNING;
      case 'hard': return COLORS.ERROR;
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{LocalizationService.t('DAILY_MISSIONS')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Complete missions to earn rewards!</Text>

        {missions.map((mission, index) => (
          <View
            key={mission.id}
            style={[
              styles.missionCard,
              mission.completed && styles.completedCard,
            ]}
          >
            <View style={styles.missionHeader}>
              <Text style={[styles.difficulty, { color: getDifficultyColor(mission.difficulty) }]}>
                {mission.difficulty.toUpperCase()}
              </Text>
              {mission.completed && !mission.claimed && (
                <View style={styles.readyBadge}>
                  <Text style={styles.readyText}>READY!</Text>
                </View>
              )}
            </View>

            <Text style={styles.missionName}>
              {mission.name[LocalizationService.getLanguage()]}
            </Text>

            <Text style={styles.missionDesc}>
              {mission.description[LocalizationService.getLanguage()]}
            </Text>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, (mission.progress / mission.target) * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {mission.progress} / {mission.target}
              </Text>
            </View>

            {/* Rewards */}
            <View style={styles.rewardSection}>
              <Text style={styles.rewardLabel}>Reward:</Text>
              <Text style={styles.rewardText}>🪙 {mission.reward.coins}</Text>
              {mission.reward.powerup && (
                <Text style={styles.rewardText}>
                  {mission.reward.powerup === 'shield' ? '🛡️' :
                   mission.reward.powerup === 'magnet' ? '🧲' :
                   mission.reward.powerup === 'speedBoost' ? '⚡' : '⭐'} ×
                  {mission.reward.powerupCount || 1}
                </Text>
              )}
            </View>

            {/* Claim button */}
            {mission.completed && !mission.claimed && (
              <Button
                variant="success"
                size="small"
                onPress={() => claimReward(mission, index)}
                style={styles.claimButton}
              >
                {LocalizationService.t('CLAIM')}
              </Button>
            )}

            {mission.claimed && (
              <View style={styles.claimedBadge}>
                <Text style={styles.claimedText}>✓ Claimed</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.info}>
          <Text style={styles.infoText}>
            ℹ️ Missions reset daily at 12:00 AM IST
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, backgroundColor: COLORS.SURFACE, borderBottomWidth: 1, borderBottomColor: COLORS.TEXT_DISABLED },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 32, color: COLORS.PRIMARY },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  placeholder: { width: 44 },
  content: { flex: 1, padding: 16 },
  subtitle: { fontSize: 16, color: COLORS.TEXT_SECONDARY, marginBottom: 16, textAlign: 'center' },
  missionCard: { backgroundColor: COLORS.SURFACE, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: 'transparent' },
  completedCard: { borderColor: COLORS.SUCCESS },
  missionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  difficulty: { fontSize: 12, fontWeight: 'bold' },
  readyBadge: { backgroundColor: COLORS.SUCCESS, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  readyText: { color: COLORS.TEXT_ON_PRIMARY, fontSize: 10, fontWeight: 'bold' },
  missionName: { fontSize: 18, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginBottom: 4 },
  missionDesc: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 12 },
  progressContainer: { marginBottom: 12 },
  progressBg: { height: 8, backgroundColor: COLORS.TEXT_DISABLED, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.PRIMARY },
  progressText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, marginTop: 4, textAlign: 'right' },
  rewardSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rewardLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginRight: 8 },
  rewardText: { fontSize: 16, marginRight: 8 },
  claimButton: { marginTop: 8 },
  claimedBadge: { backgroundColor: COLORS.TEXT_DISABLED, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  claimedText: { color: COLORS.TEXT_SECONDARY, fontWeight: 'bold' },
  info: { marginTop: 16, padding: 12, backgroundColor: COLORS.SURFACE, borderRadius: 8 },
  infoText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, textAlign: 'center' },
});

export default MissionsScreen;
