/**
 * Daily Missions
 * Mission definitions and rewards
 */

import { MISSION_REWARDS } from '../config/constants';

// Mission types
export const MISSION_TYPES = {
  DISTANCE_TOTAL: 'distance_total',
  DISTANCE_SINGLE: 'distance_single',
  COINS_COLLECT: 'coins_collect',
  PASSENGERS_COLLECT: 'passengers_collect',
  PASSENGERS_SINGLE: 'passengers_single',
  NEAR_MISSES: 'near_misses',
  GAMES_PLAYED: 'games_played',
  COMBO_ACHIEVE: 'combo_achieve',
  SURVIVE_TIME: 'survive_time',
  SCORE_ACHIEVE: 'score_achieve',
  POWERUPS_USE: 'powerups_use',
};

// Easy missions (1 selected daily)
export const EASY_MISSIONS = [
  {
    id: 'easy_distance_total',
    type: MISSION_TYPES.DISTANCE_TOTAL,
    name: {
      en: 'Travel 5,000 meters total',
      hi: 'कुल 5,000 मीटर यात्रा करें',
    },
    description: {
      en: 'Travel 5,000 meters across all runs today',
      hi: 'आज सभी दौड़ में 5,000 मीटर यात्रा करें',
    },
    target: 5000,
    reward: {
      coins: MISSION_REWARDS.EASY.COINS,
      xp: MISSION_REWARDS.EASY.XP,
    },
    icon: 'distance',
  },
  {
    id: 'easy_coins_collect',
    type: MISSION_TYPES.COINS_COLLECT,
    name: {
      en: 'Collect 50 coins',
      hi: '50 सिक्के इकट्ठा करें',
    },
    description: {
      en: 'Collect 50 coins across all runs',
      hi: 'सभी दौड़ में 50 सिक्के इकट्ठा करें',
    },
    target: 50,
    reward: {
      coins: 500,
      xp: 50,
    },
    icon: 'coin',
  },
  {
    id: 'easy_passengers',
    type: MISSION_TYPES.PASSENGERS_COLLECT,
    name: {
      en: 'Pick up 10 passengers',
      hi: '10 यात्रियों को उठाएं',
    },
    description: {
      en: 'Pick up 10 passengers total',
      hi: 'कुल 10 यात्रियों को उठाएं',
    },
    target: 10,
    reward: {
      coins: 500,
      xp: 50,
      powerup: 'shield',
      powerupCount: 1,
    },
    icon: 'passenger',
  },
  {
    id: 'easy_games_played',
    type: MISSION_TYPES.GAMES_PLAYED,
    name: {
      en: 'Play 5 games',
      hi: '5 खेल खेलें',
    },
    description: {
      en: 'Start 5 game sessions',
      hi: '5 गेम सत्र शुरू करें',
    },
    target: 5,
    reward: {
      coins: 500,
      xp: 50,
    },
    icon: 'play',
  },
];

// Medium missions (1 selected daily)
export const MEDIUM_MISSIONS = [
  {
    id: 'medium_distance_single',
    type: MISSION_TYPES.DISTANCE_SINGLE,
    name: {
      en: 'Travel 3,000 meters in one run',
      hi: 'एक दौड़ में 3,000 मीटर यात्रा करें',
    },
    description: {
      en: 'Travel 3,000 meters in a single run',
      hi: 'एक ही दौड़ में 3,000 मीटर यात्रा करें',
    },
    target: 3000,
    reward: {
      coins: 1000,
      xp: 100,
      powerup: 'random',
      powerupCount: 1,
    },
    icon: 'distance',
  },
  {
    id: 'medium_passengers_single',
    type: MISSION_TYPES.PASSENGERS_SINGLE,
    name: {
      en: 'Collect 15 passengers in one run',
      hi: 'एक दौड़ में 15 यात्री इकट्ठा करें',
    },
    description: {
      en: 'Pick up 15 passengers in a single run',
      hi: 'एक ही दौड़ में 15 यात्री उठाएं',
    },
    target: 15,
    reward: {
      coins: 1000,
      xp: 100,
      powerup: 'multiplier',
      powerupCount: 1,
    },
    icon: 'passenger',
  },
  {
    id: 'medium_near_misses',
    type: MISSION_TYPES.NEAR_MISSES,
    name: {
      en: 'Get 20 near misses',
      hi: '20 निकट चूक प्राप्त करें',
    },
    description: {
      en: 'Get 20 near misses total today',
      hi: 'आज कुल 20 निकट चूक प्राप्त करें',
    },
    target: 20,
    reward: {
      coins: 1000,
      xp: 100,
    },
    icon: 'near_miss',
  },
  {
    id: 'medium_combo',
    type: MISSION_TYPES.COMBO_ACHIEVE,
    name: {
      en: 'Achieve 5x passenger combo',
      hi: '5x यात्री कॉम्बो प्राप्त करें',
    },
    description: {
      en: 'Get a 5x passenger combo',
      hi: '5x यात्री कॉम्बो प्राप्त करें',
    },
    target: 5,
    reward: {
      coins: 1000,
      xp: 100,
      powerup: 'multiplier',
      powerupCount: 1,
    },
    icon: 'combo',
  },
  {
    id: 'medium_survive',
    type: MISSION_TYPES.SURVIVE_TIME,
    name: {
      en: 'Survive for 3 minutes',
      hi: '3 मिनट तक जीवित रहें',
    },
    description: {
      en: 'Survive for 3 minutes in one run',
      hi: 'एक दौड़ में 3 मिनट तक जीवित रहें',
    },
    target: 180, // seconds
    reward: {
      coins: 1000,
      xp: 100,
      powerup: 'shield',
      powerupCount: 2,
    },
    icon: 'time',
  },
];

// Hard missions (1 selected daily)
export const HARD_MISSIONS = [
  {
    id: 'hard_distance_single',
    type: MISSION_TYPES.DISTANCE_SINGLE,
    name: {
      en: 'Travel 5,000 meters in one run',
      hi: 'एक दौड़ में 5,000 मीटर यात्रा करें',
    },
    description: {
      en: 'Travel 5,000 meters in a single run',
      hi: 'एक ही दौड़ में 5,000 मीटर यात्रा करें',
    },
    target: 5000,
    reward: {
      coins: 2000,
      xp: 200,
      powerup: 'random',
      powerupCount: 3,
    },
    icon: 'distance',
  },
  {
    id: 'hard_near_misses_total',
    type: MISSION_TYPES.NEAR_MISSES,
    name: {
      en: 'Get 50 near misses in total',
      hi: 'कुल 50 निकट चूक प्राप्त करें',
    },
    description: {
      en: 'Get 50 near misses across all runs',
      hi: 'सभी दौड़ में 50 निकट चूक प्राप्त करें',
    },
    target: 50,
    reward: {
      coins: 2000,
      xp: 200,
      badge: 'daredevil',
    },
    icon: 'near_miss',
  },
  {
    id: 'hard_passengers_perfect',
    type: MISSION_TYPES.PASSENGERS_SINGLE,
    name: {
      en: 'Collect 25 passengers without crashing',
      hi: 'बिना दुर्घटना के 25 यात्री इकट्ठा करें',
    },
    description: {
      en: 'Pick up 25 passengers in one perfect run',
      hi: 'एक परफेक्ट दौड़ में 25 यात्री उठाएं',
    },
    target: 25,
    reward: {
      coins: 2000,
      xp: 200,
      skin: 'exclusive_body',
    },
    icon: 'passenger',
  },
  {
    id: 'hard_score',
    type: MISSION_TYPES.SCORE_ACHIEVE,
    name: {
      en: 'Score 50,000 points in one run',
      hi: 'एक दौड़ में 50,000 अंक बनाएं',
    },
    description: {
      en: 'Achieve 50,000 points in a single run',
      hi: 'एक ही दौड़ में 50,000 अंक प्राप्त करें',
    },
    target: 50000,
    reward: {
      coins: 2000,
      xp: 200,
      bonusCoins: 5000,
    },
    icon: 'score',
  },
  {
    id: 'hard_powerups_all',
    type: MISSION_TYPES.POWERUPS_USE,
    name: {
      en: 'Use all 4 power-ups in one run',
      hi: 'एक दौड़ में सभी 4 पावर-अप का उपयोग करें',
    },
    description: {
      en: 'Collect all power-up types in one run',
      hi: 'एक दौड़ में सभी प्रकार के पावर-अप इकट्ठा करें',
    },
    target: 4,
    reward: {
      coins: 2000,
      xp: 200,
      powerupPack: true,
    },
    icon: 'powerup',
  },
];

// Get daily mission selection (called at midnight IST)
export const generateDailyMissions = () => {
  const easyMission = EASY_MISSIONS[Math.floor(Math.random() * EASY_MISSIONS.length)];
  const mediumMission = MEDIUM_MISSIONS[Math.floor(Math.random() * MEDIUM_MISSIONS.length)];
  const hardMission = HARD_MISSIONS[Math.floor(Math.random() * HARD_MISSIONS.length)];

  return [
    { ...easyMission, difficulty: 'easy', progress: 0, completed: false },
    { ...mediumMission, difficulty: 'medium', progress: 0, completed: false },
    { ...hardMission, difficulty: 'hard', progress: 0, completed: false },
  ];
};

export default {
  EASY_MISSIONS,
  MEDIUM_MISSIONS,
  HARD_MISSIONS,
  generateDailyMissions,
};
