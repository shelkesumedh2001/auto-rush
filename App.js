/**
 * Auto Rush: Mumbai Traffic Run
 * Main Application Entry Point
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { UserProvider } from './src/context/UserContext';
import { GameProvider } from './src/context/GameContext';
import { SettingsProvider } from './src/context/SettingsContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import Game3DScreen from './src/screens/Game3DScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import ShopScreen from './src/screens/ShopScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import CharacterSelectScreen from './src/screens/CharacterSelectScreen';
import UpgradeScreen from './src/screens/UpgradeScreen';
import SeasonPassScreen from './src/screens/SeasonPassScreen';

// Services
import StorageService from './src/services/StorageService';
import LocalizationService from './src/services/LocalizationService';
import AudioService from './src/services/AudioService';
import AnalyticsService from './src/services/AnalyticsService';
import AdManager from './src/monetization/AdManager';
import IAPManager from './src/monetization/IAPManager';

import { COLORS } from './src/config/colors';

// App screens enum
const SCREENS = {
  SPLASH: 'splash',
  MAIN_MENU: 'main_menu',
  GAME: 'game',
  GAME_OVER: 'game_over',
  SHOP: 'shop',
  SETTINGS: 'settings',
  MISSIONS: 'missions',
  LEADERBOARD: 'leaderboard',
  CHARACTER_SELECT: 'character_select',
  UPGRADES: 'upgrades',
  SEASON_PASS: 'season_pass',
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.SPLASH);
  const [gameStats, setGameStats] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing Auto Rush...');

      // Initialize services
      await LocalizationService.initialize();
      await AudioService.initialize();
      await AnalyticsService.initialize();
      await AdManager.initialize();
      await IAPManager.initialize();

      console.log('Auto Rush initialized successfully!');
      setInitialized(true);
    } catch (error) {
      console.error('Initialization error:', error);
      setInitialized(true); // Continue anyway
    }
  };

  const handleSplashComplete = () => {
    setCurrentScreen(SCREENS.MAIN_MENU);
  };

  const handlePlayPress = () => {
    AnalyticsService.logGameStart();
    setCurrentScreen(SCREENS.GAME);
  };

  const handleGameOver = (stats) => {
    AnalyticsService.logGameOver(stats);
    setGameStats(stats);
    setCurrentScreen(SCREENS.GAME_OVER);
  };

  const handleTryAgain = () => {
    setCurrentScreen(SCREENS.GAME);
  };

  const handleMainMenu = () => {
    setCurrentScreen(SCREENS.MAIN_MENU);
  };

  const handleShopPress = () => {
    AnalyticsService.logScreenView('shop');
    setCurrentScreen(SCREENS.SHOP);
  };

  const handleSettingsPress = () => {
    AnalyticsService.logScreenView('settings');
    setCurrentScreen(SCREENS.SETTINGS);
  };

  const handleMissionsPress = () => {
    AnalyticsService.logScreenView('missions');
    setCurrentScreen(SCREENS.MISSIONS);
  };

  const handleLeaderboardPress = () => {
    AnalyticsService.logScreenView('leaderboard');
    setCurrentScreen(SCREENS.LEADERBOARD);
  };

  const handleCharacterPress = () => {
    AnalyticsService.logScreenView('character_select');
    setCurrentScreen(SCREENS.CHARACTER_SELECT);
  };

  const handleUpgradePress = () => {
    AnalyticsService.logScreenView('upgrades');
    setCurrentScreen(SCREENS.UPGRADES);
  };

  const handleSeasonPassPress = () => {
    AnalyticsService.logScreenView('season_pass');
    setCurrentScreen(SCREENS.SEASON_PASS);
  };

  const handlePause = () => {
    // Could show pause menu here
    console.log('Game paused');
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;

      case SCREENS.MAIN_MENU:
        return (
          <MainMenuScreen
            onPlayPress={handlePlayPress}
            onShopPress={handleShopPress}
            onSettingsPress={handleSettingsPress}
            onMissionsPress={handleMissionsPress}
            onLeaderboardPress={handleLeaderboardPress}
            onCharacterPress={handleCharacterPress}
            onUpgradePress={handleUpgradePress}
            onSeasonPassPress={handleSeasonPassPress}
          />
        );

      case SCREENS.GAME:
        return (
          <Game3DScreen
            onGameOver={handleGameOver}
            onPause={handleMainMenu}
          />
        );

      case SCREENS.GAME_OVER:
        return (
          <GameOverScreen
            stats={gameStats}
            onTryAgain={handleTryAgain}
            onMainMenu={handleMainMenu}
          />
        );

      case SCREENS.SHOP:
        return <ShopScreen onClose={handleMainMenu} />;

      case SCREENS.SETTINGS:
        return <SettingsScreen onClose={handleMainMenu} />;

      case SCREENS.MISSIONS:
        return <MissionsScreen onClose={handleMainMenu} />;

      case SCREENS.LEADERBOARD:
        return <LeaderboardScreen onClose={handleMainMenu} />;

      case SCREENS.CHARACTER_SELECT:
        return <CharacterSelectScreen onClose={handleMainMenu} />;

      case SCREENS.UPGRADES:
        return <UpgradeScreen onClose={handleMainMenu} />;

      case SCREENS.SEASON_PASS:
        return <SeasonPassScreen onClose={handleMainMenu} />;

      default:
        return <MainMenuScreen onPlayPress={handlePlayPress} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {renderScreen()}
    </SafeAreaView>
  );
}

// Root App with Providers
export default function App() {
  return (
    <SettingsProvider>
      <UserProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </UserProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});
