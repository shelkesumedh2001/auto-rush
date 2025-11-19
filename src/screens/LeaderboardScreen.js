/**
 * Leaderboard Screen
 * Global and friends leaderboards
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/colors';
import LocalizationService from '../services/LocalizationService';
import { useUser } from '../context/UserContext';

const LeaderboardScreen = ({ onClose }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('global'); // 'friends', 'global', 'weekly'

  // Mock leaderboard data (in production, fetch from backend/Google Play Games)
  const mockLeaderboard = [
    { rank: 1, name: 'Rahul K.', score: 45820, avatar: '🛺' },
    { rank: 2, name: 'Priya S.', score: 42150, avatar: '🛺' },
    { rank: 3, name: 'Amit P.', score: 38900, avatar: '🛺' },
    { rank: 4, name: 'Neha M.', score: 35600, avatar: '🛺' },
    { rank: 5, name: 'Vijay R.', score: 32100, avatar: '🛺' },
    { rank: 347, name: 'You', score: user.highScore || 0, avatar: '🛺', isPlayer: true },
  ];

  const getRankColor = (rank) => {
    if (rank === 1) return COLORS.RANK_GOLD;
    if (rank === 2) return COLORS.RANK_SILVER;
    if (rank === 3) return COLORS.RANK_BRONZE;
    return COLORS.TEXT_PRIMARY;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{LocalizationService.t('LEADERBOARD')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab selector */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && styles.activeTab]}
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
            Global
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      {/* Player position */}
      <View style={styles.playerPosition}>
        <Text style={styles.playerRank}>#{mockLeaderboard.find(p => p.isPlayer)?.rank || '---'}</Text>
        <Text style={styles.playerLabel}>Your Rank</Text>
        <Text style={styles.playerScore}>
          High Score: {LocalizationService.formatNumber(user.highScore || 0)}
        </Text>
      </View>

      {/* Leaderboard list */}
      <ScrollView style={styles.list}>
        {mockLeaderboard.map((entry) => (
          <View
            key={entry.rank}
            style={[
              styles.entry,
              entry.isPlayer && styles.playerEntry,
            ]}
          >
            <Text style={[styles.rank, { color: getRankColor(entry.rank) }]}>
              {getRankIcon(entry.rank)}
            </Text>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{entry.avatar}</Text>
            </View>

            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, entry.isPlayer && styles.highlightText]}>
                {entry.name}
              </Text>
              <Text style={styles.playerScoreSmall}>
                {LocalizationService.formatNumber(entry.score)} pts
              </Text>
            </View>

            {entry.rank <= 3 && (
              <View style={styles.medalBadge}>
                <Text style={styles.medalText}>👑</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Google Play Games notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          🎮 Sign in with Google Play Games to compete globally
        </Text>
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
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
  tabs: { flexDirection: 'row', backgroundColor: COLORS.SURFACE, paddingVertical: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.PRIMARY },
  tabText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, fontWeight: '600' },
  activeTabText: { color: COLORS.PRIMARY, fontWeight: 'bold' },
  playerPosition: { backgroundColor: COLORS.PRIMARY_LIGHT, padding: 16, alignItems: 'center' },
  playerRank: { fontSize: 48, fontWeight: 'bold', color: COLORS.PRIMARY },
  playerLabel: { fontSize: 14, color: COLORS.TEXT_SECONDARY, marginBottom: 4 },
  playerScore: { fontSize: 16, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  list: { flex: 1 },
  entry: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.SURFACE, marginVertical: 1 },
  playerEntry: { backgroundColor: COLORS.PRIMARY_LIGHT, borderLeftWidth: 4, borderLeftColor: COLORS.PRIMARY },
  rank: { fontSize: 18, fontWeight: 'bold', width: 60, textAlign: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.BACKGROUND, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 24 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  highlightText: { color: COLORS.PRIMARY },
  playerScoreSmall: { fontSize: 14, color: COLORS.TEXT_SECONDARY },
  medalBadge: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  medalText: { fontSize: 24 },
  notice: { backgroundColor: COLORS.SURFACE, padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.TEXT_DISABLED },
  noticeText: { fontSize: 12, color: COLORS.TEXT_SECONDARY, textAlign: 'center', marginBottom: 8 },
  signInButton: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  signInText: { color: COLORS.TEXT_ON_PRIMARY, fontWeight: 'bold' },
});

export default LeaderboardScreen;
