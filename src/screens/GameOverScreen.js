/**
 * Game Over Screen
 * Shows stats and offers to retry or watch ads
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/colors';
import Button from '../components/ui/Button';
import LocalizationService from '../services/LocalizationService';

const GameOverScreen = ({ stats, onTryAgain, onMainMenu }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{LocalizationService.t('GAME_OVER')}</Text>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{Math.floor(stats?.distance || 0)}m</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{stats?.score || 0}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Coins Earned</Text>
            <Text style={styles.statValue}>🪙 {stats?.coins || 0}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            variant="success"
            size="large"
            onPress={onTryAgain}
            style={styles.button}
          >
            {LocalizationService.t('TRY_AGAIN')}
          </Button>

          <Button
            variant="secondary"
            size="medium"
            onPress={onMainMenu}
            style={styles.button}
          >
            {LocalizationService.t('MAIN_MENU')}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MODAL_BACKDROP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.ERROR,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsCard: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_DISABLED,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  buttons: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});

export default GameOverScreen;
