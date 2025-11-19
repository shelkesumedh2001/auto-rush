/**
 * 3D Game Constants - Subway Surfers Style
 * Intense, fast-paced endless runner configuration
 */

import { Dimensions, Platform } from 'react-native';

// Get screen dimensions (works on both web and mobile)
let SCREEN_WIDTH = 375; // Default fallback
let SCREEN_HEIGHT = 667; // Default fallback

try {
  if (Platform.OS === 'web') {
    // Use window dimensions on web
    SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 375;
    SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 667;
  } else {
    // Use Dimensions API on native
    const dims = Dimensions.get('window');
    SCREEN_WIDTH = dims.width;
    SCREEN_HEIGHT = dims.height;
  }
} catch (error) {
  console.warn('Could not get screen dimensions, using defaults:', error);
}

export const GAME_3D = {
  // Screen dimensions
  SCREEN_WIDTH,
  SCREEN_HEIGHT,

  // Camera configuration
  CAMERA: {
    FOV: 75,
    POSITION_Y: 3.5, // Height above ground
    POSITION_Z: 8, // Distance behind player
    LOOK_AHEAD: 5, // How far ahead camera looks
    TILT_ANGLE: -10, // Slight downward tilt (degrees)
  },

  // 3D Lane configuration (Subway Surfers style - 3 lanes)
  LANE_COUNT: 3,
  LANE_POSITIONS: [-2.5, 0, 2.5], // X positions in 3D space
  LANE_WIDTH: 2.5,

  // Speed settings - MUCH FASTER than 2D version
  INITIAL_SPEED: 15, // Starting speed (units per second)
  MAX_SPEED: 45, // Maximum speed
  SPEED_INCREMENT: 0.8, // Speed increase rate
  SPEED_INCREMENT_INTERVAL: 10, // Seconds between speed ups

  // Distance multiplier for score
  DISTANCE_TO_SCORE: 0.1, // Every unit traveled = 0.1 points

  // Auto-rickshaw settings
  AUTO: {
    POSITION_Y: 0.5, // Height off ground
    POSITION_Z: -3, // Distance from camera
    SIZE: { width: 1.2, height: 1.5, depth: 2 },

    // Lane switching
    LANE_SWITCH_SPEED: 12, // Speed of lane transitions

    // Jump mechanics
    JUMP_HEIGHT: 3, // Maximum jump height
    JUMP_DURATION: 0.6, // Seconds in air
    JUMP_GRAVITY: -25, // Gravity strength

    // Slide mechanics
    SLIDE_DURATION: 0.5, // Seconds sliding
    SLIDE_HEIGHT: 0.2, // Height when sliding
  },

  // Road configuration
  ROAD: {
    WIDTH: 8, // Total road width
    SEGMENT_LENGTH: 10, // Length of each road segment
    SEGMENTS_AHEAD: 50, // Number of segments to render ahead
    TEXTURE_REPEAT: 5, // How often road texture repeats
  },

  // Obstacle spawning - VERY AGGRESSIVE
  SPAWN: {
    INITIAL_INTERVAL: 1.2, // Seconds between obstacles (very fast!)
    MIN_INTERVAL: 0.6, // Minimum time between obstacles
    SPAWN_DISTANCE: 80, // Distance ahead to spawn
    DESPAWN_DISTANCE: -20, // Distance behind to remove

    // Pattern difficulty progression
    EASY_DURATION: 20, // Seconds of easy patterns
    MEDIUM_DURATION: 40, // Then medium difficulty
    // After 60 seconds = hard patterns
  },

  // Obstacle types and sizes
  OBSTACLES: {
    CAR: { width: 1.2, height: 1, depth: 2, speed: 0 },
    BUS: { width: 1.5, height: 2.5, depth: 4, speed: 0 },
    TRUCK: { width: 1.5, height: 2, depth: 3.5, speed: 0 },
    BARRIER: { width: 0.8, height: 1.2, depth: 0.5, speed: 0 },
    CONE: { width: 0.4, height: 0.8, depth: 0.4, speed: 0 },
    COW: { width: 1, height: 1.2, depth: 1.5, speed: 0.5 }, // Moves slowly
    DOG: { width: 0.6, height: 0.6, depth: 0.8, speed: 2 }, // Moves fast
  },

  // Collectibles
  COINS: {
    SIZE: 0.4,
    SPAWN_RATE: 0.7, // Probability per obstacle
    VALUE: 1,
    MAGNET_VALUE: 2, // Coins collected with magnet
    ROTATION_SPEED: 2, // Rotation per second
    FLOAT_AMPLITUDE: 0.2, // Bobbing motion
    FLOAT_SPEED: 1, // Bobbing speed
  },

  PASSENGERS: {
    SIZE: { width: 0.6, height: 1.5, depth: 0.6 },
    SPAWN_RATE: 0.15, // Less common than coins
    BASE_POINTS: 50,
    COMBO_WINDOW: 3, // Seconds to get next passenger for combo
    COMBO_MULTIPLIER: 25, // Bonus per combo level
  },

  // Power-ups (spawn less frequently, more valuable)
  POWERUPS: {
    SIZE: 0.6,
    SPAWN_RATE: 0.08, // Rare

    // Durations (can be upgraded)
    SHIELD_DURATION: 8,
    MAGNET_DURATION: 10,
    BOOST_DURATION: 5,
    MULTIPLIER_DURATION: 15,

    // Effects
    BOOST_SPEED_MULTIPLIER: 1.5,
    MAGNET_RADIUS: 5,
    SCORE_MULTIPLIER: 2,
  },

  // Lives system (Phase 2)
  LIVES: {
    MAX_LIVES: 5,
    REGENERATION_TIME: 30 * 60, // 30 minutes in seconds
    FREE_CONTINUES_PER_DAY: 1,
  },

  // Scoring
  SCORE: {
    DISTANCE_MULTIPLIER: 1,
    COIN: 10,
    PASSENGER: 50,
    NEAR_MISS: 15,
    PERFECT_DODGE: 25,
  },

  // Visual effects
  EFFECTS: {
    CAMERA_SHAKE_INTENSITY: 0.3,
    CAMERA_SHAKE_DURATION: 0.2,
    PARTICLE_COUNT: 20,
    TRAIL_ENABLED: true,
    MOTION_BLUR_ENABLED: true,
  },

  // Environment
  ENVIRONMENT: {
    FOG_NEAR: 30,
    FOG_FAR: 100,
    FOG_COLOR: 0x87CEEB, // Sky blue

    // Time of day
    DAY_LIGHT_INTENSITY: 1,
    NIGHT_LIGHT_INTENSITY: 0.3,

    // Side scenery
    BUILDING_DENSITY: 0.3,
    BUILDING_HEIGHT_MIN: 5,
    BUILDING_HEIGHT_MAX: 15,
  },
};

// Obstacle patterns (Subway Surfers style)
export const PATTERNS_3D = {
  // Easy patterns
  SINGLE: [
    { lane: 1, type: 'CAR', offset: 0 },
  ],

  TWO_SIDES: [
    { lane: 0, type: 'CAR', offset: 0 },
    { lane: 2, type: 'CAR', offset: 0 },
  ],

  ALTERNATING: [
    { lane: 0, type: 'CAR', offset: 0 },
    { lane: 2, type: 'CAR', offset: 5 },
    { lane: 1, type: 'CAR', offset: 10 },
  ],

  // Medium patterns
  ZIGZAG: [
    { lane: 0, type: 'BARRIER', offset: 0 },
    { lane: 1, type: 'BARRIER', offset: 3 },
    { lane: 2, type: 'BARRIER', offset: 6 },
  ],

  JUMP_REQUIRED: [
    { lane: 0, type: 'BARRIER', offset: 0, height: 'low' },
    { lane: 1, type: 'BARRIER', offset: 0, height: 'low' },
    { lane: 2, type: 'BARRIER', offset: 0, height: 'low' },
  ],

  SLIDE_REQUIRED: [
    { lane: 1, type: 'BUS', offset: 0 },
  ],

  // Hard patterns
  SLALOM: [
    { lane: 0, type: 'BARRIER', offset: 0 },
    { lane: 2, type: 'BARRIER', offset: 2 },
    { lane: 0, type: 'BARRIER', offset: 4 },
    { lane: 2, type: 'BARRIER', offset: 6 },
  ],

  GAUNTLET: [
    { lane: 0, type: 'BUS', offset: 0 },
    { lane: 2, type: 'BARRIER', offset: 3, height: 'low' },
    { lane: 1, type: 'TRUCK', offset: 8 },
  ],

  CHAOS: [
    { lane: 0, type: 'CAR', offset: 0 },
    { lane: 1, type: 'BARRIER', offset: 2, height: 'low' },
    { lane: 2, type: 'BUS', offset: 4 },
    { lane: 1, type: 'DOG', offset: 7, moving: true },
    { lane: 0, type: 'BARRIER', offset: 10, height: 'low' },
  ],
};

// Character abilities (Phase 2)
export const CHARACTERS = {
  STANDARD: {
    id: 'standard',
    name: { en: 'Classic Yellow', hi: 'क्लासिक पीला' },
    price: 0, // Free
    ability: null,
    color: 0xFFD700,
  },

  SPEED_DEMON: {
    id: 'speed_demon',
    name: { en: 'Speed Demon', hi: 'गति दानव' },
    price: 2000,
    ability: 'START_BOOST',
    description: { en: 'Start each run with Speed Boost', hi: 'गति बूस्ट के साथ शुरू करें' },
    color: 0xFF4500,
  },

  TANK: {
    id: 'tank',
    name: { en: 'Iron Tank', hi: 'लोहा टैंक' },
    price: 2500,
    ability: 'START_SHIELD',
    description: { en: 'Start with Shield protection', hi: 'ढाल सुरक्षा के साथ शुरू करें' },
    color: 0x4169E1,
  },

  MAGNET_MASTER: {
    id: 'magnet_master',
    name: { en: 'Coin Magnet', hi: 'सिक्का चुंबक' },
    price: 3000,
    ability: 'LONGER_MAGNET',
    description: { en: 'Magnet lasts 50% longer', hi: 'चुंबक 50% लंबे समय तक रहता है' },
    color: 0x9370DB,
  },

  LUCKY: {
    id: 'lucky',
    name: { en: 'Lucky Star', hi: 'भाग्यशाली तारा' },
    price: 5000,
    ability: 'DOUBLE_COINS',
    description: { en: 'All coins worth 2x', hi: 'सभी सिक्के 2x मूल्य के' },
    color: 0xFFD700,
  },
};

// Power-up upgrade levels (Phase 2)
export const POWERUP_UPGRADES = {
  SHIELD: [
    { level: 1, duration: 8, cost: 0 },
    { level: 2, duration: 10, cost: 500 },
    { level: 3, duration: 13, cost: 1000 },
    { level: 4, duration: 16, cost: 2000 },
    { level: 5, duration: 20, cost: 4000 },
  ],

  MAGNET: [
    { level: 1, duration: 10, cost: 0 },
    { level: 2, duration: 13, cost: 500 },
    { level: 3, duration: 16, cost: 1000 },
    { level: 4, duration: 20, cost: 2000 },
    { level: 5, duration: 25, cost: 4000 },
  ],

  BOOST: [
    { level: 1, duration: 5, cost: 0 },
    { level: 2, duration: 7, cost: 500 },
    { level: 3, duration: 9, cost: 1000 },
    { level: 4, duration: 12, cost: 2000 },
    { level: 5, duration: 15, cost: 4000 },
  ],

  MULTIPLIER: [
    { level: 1, duration: 15, cost: 0 },
    { level: 2, duration: 18, cost: 500 },
    { level: 3, duration: 22, cost: 1000 },
    { level: 4, duration: 27, cost: 2000 },
    { level: 5, duration: 35, cost: 4000 },
  ],
};

export default GAME_3D;
