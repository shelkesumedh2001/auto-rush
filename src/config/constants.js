/**
 * Game Constants
 * All core game values, speeds, spawn rates, and difficulty settings
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GAME = {
  // Screen dimensions
  SCREEN_WIDTH,
  SCREEN_HEIGHT,

  // Lane configuration
  LANE_COUNT: 3,
  LANE_WIDTH: SCREEN_WIDTH / 3,
  LANES: {
    LEFT: SCREEN_WIDTH * 0.25,
    CENTER: SCREEN_WIDTH * 0.5,
    RIGHT: SCREEN_WIDTH * 0.75,
  },

  // Speed settings
  INITIAL_SPEED: 8, // units per second
  MAX_SPEED: 30,
  SPEED_INCREMENT: 0.3, // every 10 seconds
  SPEED_INCREMENT_INTERVAL: 10, // seconds

  // Auto (player) settings
  AUTO: {
    WIDTH: 140,
    HEIGHT: 180,
    LANE_TRANSITION_DURATION: 250, // milliseconds
    TILT_FORWARD: 15, // degrees
    TILT_LATERAL: 8, // degrees
    WOBBLE_AMPLITUDE: 3, // pixels
    WOBBLE_FREQUENCY: 2, // Hz

    // Jump mechanics
    JUMP_DURATION: 600, // milliseconds
    JUMP_HEIGHT: 120, // pixels

    // Slide mechanics
    SLIDE_DURATION: 500, // milliseconds
    SLIDE_HEIGHT_REDUCTION: 0.5, // 50% height reduction
  },

  // Input thresholds
  INPUT: {
    SWIPE_THRESHOLD_HORIZONTAL: 50, // pixels
    SWIPE_TIME_HORIZONTAL: 300, // milliseconds
    SWIPE_THRESHOLD_VERTICAL: 70, // pixels
    SWIPE_TIME_VERTICAL: 250, // milliseconds
  },

  // Physics
  PHYSICS: {
    GRAVITY: 1.5,
    FPS: 60,
    DELTA_TIME: 1000 / 60,
  },

  // Spawn zones
  SPAWN: {
    ZONE_START: -200, // above screen
    ZONE_END: -100,
    MIN_GAP_INITIAL: 3, // seconds between obstacles
    MIN_GAP_FINAL: 1, // seconds at max difficulty
  },

  // Near miss detection
  NEAR_MISS_DISTANCE: 80, // pixels
  NEAR_MISS_POINTS: 10,

  // Scoring
  SCORE: {
    DISTANCE_MULTIPLIER: 1, // 1 point per meter
    PASSENGER_BASE: 50,
    NEAR_MISS: 10,
    PERFECT_DODGE: 25,
    JUMP_BONUS: 15,
    SLIDE_BONUS: 50,
  },

  // Combo system
  COMBO: {
    PASSENGER_THRESHOLD_2X: 3, // passengers within window
    PASSENGER_THRESHOLD_3X: 5,
    PASSENGER_THRESHOLD_5X: 7,
    TIME_WINDOW: 10, // seconds
  },

  // Power-up durations (milliseconds)
  POWER_UPS: {
    SHIELD_DURATION: 10000,
    MAGNET_DURATION: 15000,
    MAGNET_RADIUS: 300, // pixels
    SPEED_BOOST_DURATION: 8000,
    SPEED_BOOST_MULTIPLIER: 2,
    MULTIPLIER_DURATION: 12000,
    MULTIPLIER_VALUE: 2,
  },
};

// Obstacle configurations
export const OBSTACLES = {
  CAR: {
    WIDTH: 180,
    HEIGHT: 240,
    SPAWN_RATE: 0.6, // 60% at start
    POINTS_NEAR_MISS: 10,
    UNLOCK_TIME: 0, // available from start
  },
  BUS: {
    WIDTH: 280,
    HEIGHT: 400,
    SPAWN_RATE: 0.15,
    POINTS_NEAR_MISS: 25,
    UNLOCK_TIME: 30, // seconds
  },
  TRUCK: {
    WIDTH: 260,
    HEIGHT: 450,
    SPAWN_RATE: 0.10,
    POINTS_SLIDE_UNDER: 50,
    UNLOCK_TIME: 60,
  },
  COW: {
    WIDTH: 200,
    HEIGHT: 160,
    SPAWN_RATE: 0.08,
    LANE: 'CENTER', // always center lane
    UNLOCK_TIME: 45,
  },
  POTHOLE: {
    WIDTH: 150,
    HEIGHT: 150,
    SPAWN_RATE: 0.12,
    POINTS_JUMP: 15,
    UNLOCK_TIME: 20,
  },
  DOG: {
    WIDTH: 80,
    HEIGHT: 60,
    SPAWN_RATE: 0.05,
    MOVE_DURATION: 2000, // crosses in 2 seconds
    POINTS_DODGE: 30,
    UNLOCK_TIME: 90,
  },
  CONSTRUCTION: {
    WIDTH: SCREEN_WIDTH * 0.66, // blocks 2 lanes
    HEIGHT: 200,
    SPAWN_RATE: 0.03,
    UNLOCK_TIME: 120,
  },
};

// Collectible spawn rates
export const COLLECTIBLES = {
  COIN: {
    WIDTH: 64,
    HEIGHT: 64,
    SPAWN_RATE: 0.3, // 30% of road sections
    VALUE: 1,
  },
  PASSENGER: {
    WIDTH: 80,
    HEIGHT: 120,
    SPAWN_RATE: 0.15,
    POINTS: 50,
  },
  POWER_UP: {
    WIDTH: 100,
    HEIGHT: 100,
    SPAWN_INTERVAL: 45, // seconds
    SPAWN_VARIANCE: 15, // ±15 seconds
  },
};

// Difficulty progression milestones
export const DIFFICULTY_MILESTONES = {
  MINUTE_1: {
    TIME: 60,
    CAR_RATE: 0.7,
    BUS_RATE: 0.1,
    TRUCK_RATE: 0.05,
    MIN_GAP: 2.5,
  },
  MINUTE_2: {
    TIME: 120,
    CAR_RATE: 0.6,
    BUS_RATE: 0.15,
    TRUCK_RATE: 0.08,
    COW_RATE: 0.05,
    POTHOLE_RATE: 0.08,
    MIN_GAP: 2,
  },
  MINUTE_3: {
    TIME: 180,
    MIN_GAP: 1.5,
  },
  MINUTE_5: {
    TIME: 300,
    DOG_RATE: 0.03,
    CONSTRUCTION_RATE: 0.02,
    MIN_GAP: 1,
  },
};

// Mission rewards
export const MISSION_REWARDS = {
  EASY: {
    COINS: 500,
    XP: 50,
  },
  MEDIUM: {
    COINS: 1000,
    XP: 100,
  },
  HARD: {
    COINS: 2000,
    XP: 200,
  },
};

// Unlock progression thresholds (total distance in km)
export const UNLOCK_TIERS = {
  TIER_1: 0, // Beginner
  TIER_2: 10, // Experienced
  TIER_3: 25, // Skilled
  TIER_4: 50, // Expert
  TIER_5: 100, // Master
  TIER_6: 200, // Legend
  TIER_7: 500, // Auto King
};

export default GAME;
