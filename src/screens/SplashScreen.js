/**
 * Splash Screen
 * Initial loading screen
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../config/colors';

const SplashScreen = ({ onComplete }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-transition after 2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>🛺</Text>
        </View>
        <Text style={styles.title}>AUTO RUSH</Text>
        <Text style={styles.subtitle}>Mumbai Traffic Run</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 120,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.TEXT_ON_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.TEXT_ON_PRIMARY,
    opacity: 0.9,
  },
});

export default SplashScreen;
