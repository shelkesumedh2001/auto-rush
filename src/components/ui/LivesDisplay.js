/**
 * Lives Display Component
 * Shows hearts/energy in the UI with regeneration timer
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../../context/UserContext';
import { GAME_3D } from '../../config/constants3D';
import { COLORS } from '../../config/colors';

const LivesDisplay = ({ style }) => {
  const { user } = useUser();
  const [timeToNext, setTimeToNext] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      if (user.lives < GAME_3D.LIVES.MAX_LIVES) {
        const now = Date.now();
        const timeSinceRegen = (now - user.lastLifeRegenTime) / 1000;
        const timeUntilNext = GAME_3D.LIVES.REGENERATION_TIME - (timeSinceRegen % GAME_3D.LIVES.REGENERATION_TIME);

        const minutes = Math.floor(timeUntilNext / 60);
        const seconds = Math.floor(timeUntilNext % 60);
        setTimeToNext(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeToNext('FULL');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user.lives, user.lastLifeRegenTime]);

  const renderHearts = () => {
    const hearts = [];
    for (let i = 0; i < GAME_3D.LIVES.MAX_LIVES; i++) {
      hearts.push(
        <Text key={i} style={styles.heart}>
          {i < user.lives ? '❤️' : '🤍'}
        </Text>
      );
    }
    return hearts;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.heartsRow}>
        {renderHearts()}
      </View>
      {user.lives < GAME_3D.LIVES.MAX_LIVES && (
        <Text style={styles.timer}>+1 in {timeToNext}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  heart: {
    fontSize: 24,
  },
  timer: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default LivesDisplay;
