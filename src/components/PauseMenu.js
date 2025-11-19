/**
 * Pause Menu Modal
 * Displayed when user pauses the game
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/colors';
import LocalizationService from '../services/LocalizationService';
import Button from './ui/Button';

const PauseMenu = ({ visible, onResume, onRestart, onMainMenu, gameStats }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onResume} // Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {/* Title */}
          <Text style={styles.title}>⏸ {LocalizationService.t('PAUSED')}</Text>

          {/* Current Stats */}
          {gameStats && (
            <View style={styles.stats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{LocalizationService.t('SCORE')}:</Text>
                <Text style={styles.statValue}>{LocalizationService.formatNumber(gameStats.score)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{LocalizationService.t('DISTANCE')}:</Text>
                <Text style={styles.statValue}>{Math.floor(gameStats.distance)}m</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>{LocalizationService.t('COINS')}:</Text>
                <Text style={styles.statValue}>🪙 {gameStats.coins}</Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttons}>
            <Button
              variant="primary"
              onPress={onResume}
              style={styles.button}
            >
              ▶️ {LocalizationService.t('RESUME')}
            </Button>

            <Button
              variant="secondary"
              onPress={onRestart}
              style={styles.button}
            >
              🔄 {LocalizationService.t('RESTART')}
            </Button>

            <Button
              variant="secondary"
              onPress={onMainMenu}
              style={styles.button}
            >
              🏠 {LocalizationService.t('MAIN_MENU')}
            </Button>
          </View>

          {/* Tips */}
          <View style={styles.tips}>
            <Text style={styles.tipTitle}>💡 {LocalizationService.t('TIP')}:</Text>
            <Text style={styles.tipText}>
              {getTip()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Random gameplay tips
const getTip = () => {
  const tips = {
    en: [
      'Collect passengers in quick succession for combo bonuses!',
      'Power-ups stack - grab multiple for maximum effect!',
      'Near-miss bonuses add up quickly - stay sharp!',
      'Watch for moving dogs - they change direction!',
      'Jump over potholes to avoid damage.',
      'Shield power-ups protect you from one collision.',
      'Magnet power-ups auto-collect nearby coins.',
    ],
    hi: [
      'कॉम्बो बोनस के लिए यात्रियों को तेजी से इकट्ठा करें!',
      'पावर-अप जमा होते हैं - अधिकतम प्रभाव के लिए कई इकट्ठा करें!',
      'निकट-मिस बोनस तेजी से जुड़ते हैं - सतर्क रहें!',
      'चलने वाले कुत्तों पर ध्यान दें - वे दिशा बदलते हैं!',
      'नुकसान से बचने के लिए गड्ढों पर कूदें।',
      'ढाल पावर-अप आपको एक टकराव से बचाता है।',
      'चुंबक पावर-अप पास के सिक्कों को स्वतः एकत्र करता है।',
    ],
  };

  const lang = LocalizationService.getLanguage();
  const langTips = tips[lang] || tips.en;
  return langTips[Math.floor(Math.random() * langTips.length)];
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  stats: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginVertical: 0,
  },
  tips: {
    marginTop: 20,
    padding: 12,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    borderRadius: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.TEXT_ON_PRIMARY,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.TEXT_ON_PRIMARY,
    lineHeight: 18,
  },
});

export default PauseMenu;
