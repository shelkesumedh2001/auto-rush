/**
 * Game Entities for react-native-game-engine
 * Each entity renders a game object with its physics body
 */

import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { COLORS } from '../config/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Player Auto-rickshaw Entity
export const Player = (props) => {
  const { body, isJumping, isSliding, activeCustomization, shieldActive, magnetActive } = props;
  const x = body.position.x - 30;
  const y = body.position.y - 40;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 60,
        height: isSliding ? 40 : 80,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Shield effect */}
      {shieldActive && (
        <View
          style={{
            position: 'absolute',
            width: 80,
            height: isSliding ? 60 : 100,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: COLORS.POWERUP_SHIELD,
            backgroundColor: `${COLORS.POWERUP_SHIELD}20`,
          }}
        />
      )}

      {/* Magnet effect */}
      {magnetActive && (
        <View
          style={{
            position: 'absolute',
            width: 90,
            height: isSliding ? 70 : 110,
            borderRadius: 45,
            borderWidth: 2,
            borderColor: COLORS.POWERUP_MAGNET,
            backgroundColor: `${COLORS.POWERUP_MAGNET}10`,
          }}
        />
      )}

      {/* Auto body with customization color */}
      <View
        style={{
          width: 60,
          height: isSliding ? 40 : 80,
          backgroundColor: activeCustomization?.bodyPaint?.color || COLORS.AUTO_YELLOW,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: COLORS.TEXT_PRIMARY,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 32 }}>🛺</Text>
      </View>

      {/* Lights customization */}
      {activeCustomization?.lights && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            flexDirection: 'row',
            gap: 4,
          }}
        >
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: activeCustomization.lights.color }} />
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: activeCustomization.lights.color }} />
        </View>
      )}
    </View>
  );
};

// Obstacle Entity (Cars, Buses, Trucks, etc.)
export const Obstacle = (props) => {
  const { body, obstacleType } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const getObstacleEmoji = () => {
    switch (obstacleType) {
      case 'car': return '🚗';
      case 'bus': return '🚌';
      case 'truck': return '🚚';
      case 'cow': return '🐄';
      case 'dog': return '🐕';
      case 'pothole': return '🕳️';
      case 'construction': return '🚧';
      default: return '🚗';
    }
  };

  const getBackgroundColor = () => {
    switch (obstacleType) {
      case 'cow': return COLORS.OBSTACLE_COW;
      case 'pothole': return COLORS.OBSTACLE_POTHOLE;
      default: return COLORS.OBSTACLE_VEHICLE;
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: getBackgroundColor(),
        borderRadius: obstacleType === 'pothole' ? width / 2 : 8,
        borderWidth: obstacleType === 'construction' ? 3 : 2,
        borderColor: obstacleType === 'construction' ? COLORS.WARNING : COLORS.TEXT_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: obstacleType === 'bus' || obstacleType === 'truck' ? 40 : 32 }}>
        {getObstacleEmoji()}
      </Text>
    </View>
  );
};

// Coin Entity
export const Coin = (props) => {
  const { body } = props;
  const radius = 15;
  const x = body.position.x - radius;
  const y = body.position.y - radius;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: radius * 2,
        height: radius * 2,
        backgroundColor: COLORS.COIN,
        borderRadius: radius,
        borderWidth: 2,
        borderColor: COLORS.WARNING,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 20 }}>🪙</Text>
    </View>
  );
};

// Power-up Entity
export const Powerup = (props) => {
  const { body, powerupType } = props;
  const size = 40;
  const x = body.position.x - size / 2;
  const y = body.position.y - size / 2;

  const getPowerupConfig = () => {
    switch (powerupType) {
      case 'shield':
        return { emoji: '🛡️', color: COLORS.POWERUP_SHIELD };
      case 'magnet':
        return { emoji: '🧲', color: COLORS.POWERUP_MAGNET };
      case 'speedBoost':
        return { emoji: '⚡', color: COLORS.POWERUP_BOOST };
      case 'multiplier':
        return { emoji: '✖️2️⃣', color: COLORS.POWERUP_MULTIPLIER };
      default:
        return { emoji: '⭐', color: COLORS.PRIMARY };
    }
  };

  const config = getPowerupConfig();

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: config.color,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: COLORS.TEXT_ON_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: config.color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      }}
    >
      <Text style={{ fontSize: 24 }}>{config.emoji}</Text>
    </View>
  );
};

// Passenger Entity
export const Passenger = (props) => {
  const { body } = props;
  const size = 35;
  const x = body.position.x - size / 2;
  const y = body.position.y - size / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 28 }}>👤</Text>
      <View
        style={{
          position: 'absolute',
          bottom: -8,
          backgroundColor: COLORS.SUCCESS,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 10, color: COLORS.TEXT_ON_PRIMARY, fontWeight: 'bold' }}>+50</Text>
      </View>
    </View>
  );
};

// Background road Entity
export const Road = () => {
  return (
    <View
      style={{
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: COLORS.ROAD_GRAY,
      }}
    >
      {/* Road markings */}
      {[...Array(10)].map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: SCREEN_WIDTH / 2 - 5,
            top: i * (SCREEN_HEIGHT / 5) - 20,
            width: 10,
            height: 40,
            backgroundColor: COLORS.TEXT_ON_PRIMARY,
            borderRadius: 5,
          }}
        />
      ))}

      {/* Side buildings/scenery */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 30,
          backgroundColor: COLORS.SURFACE,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 30,
          backgroundColor: COLORS.SURFACE,
        }}
      />
    </View>
  );
};

// Particle Entity for effects
export const Particle = (props) => {
  const { x, y, color, size = 8, opacity = 1 } = props;

  return (
    <View
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        opacity,
      }}
    />
  );
};
