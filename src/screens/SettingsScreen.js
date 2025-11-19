/**
 * Settings Screen
 * User preferences and configuration
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS } from '../config/colors';
import { useSettings } from '../context/SettingsContext';
import LocalizationService from '../services/LocalizationService';
import Button from '../components/ui/Button';

const SettingsScreen = ({ onClose }) => {
  const { settings, setLanguage, setVibration } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{LocalizationService.t('SETTINGS')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{LocalizationService.t('LANGUAGE')}</Text>

          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[
                styles.option,
                settings.language === 'en' && styles.optionSelected,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text style={styles.optionText}>English</Text>
              {settings.language === 'en' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                settings.language === 'hi' && styles.optionSelected,
              ]}
              onPress={() => setLanguage('hi')}
            >
              <Text style={styles.optionText}>हिंदी (Hindi)</Text>
              {settings.language === 'hi' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{LocalizationService.t('SOUND_EFFECTS')}</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{LocalizationService.t('VIBRATION')}</Text>
            <Switch
              value={settings.vibration}
              onValueChange={setVibration}
              trackColor={{ false: COLORS.TEXT_DISABLED, true: COLORS.SUCCESS }}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>Auto Rush: Mumbai Traffic Run</Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_DISABLED,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  optionGroup: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.TEXT_DISABLED,
  },
  optionSelected: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.SUCCESS,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
});

export default SettingsScreen;
