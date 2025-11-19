/**
 * Achievements System
 * Google Play Games achievements and rewards
 */

export const ACHIEVEMENTS = [
  // Distance achievements
  {
    id: 'achievement_first_kilometer',
    name: { en: 'First Kilometer', hi: 'पहला किलोमीटर' },
    description: { en: 'Travel 1km total', hi: 'कुल 1 किमी यात्रा करें' },
    type: 'distance_total',
    target: 1000,
    reward: { coins: 100, xp: 10 },
    difficulty: 'easy',
  },
  {
    id: 'achievement_marathon',
    name: { en: 'Marathon Runner', hi: 'मैराथन धावक' },
    description: { en: 'Travel 42km total', hi: 'कुल 42 किमी यात्रा करें' },
    type: 'distance_total',
    target: 42000,
    reward: { coins: 500, xp: 25 },
    difficulty: 'medium',
  },
  {
    id: 'achievement_around_mumbai',
    name: { en: 'Around Mumbai', hi: 'मुंबई के चारों ओर' },
    description: { en: 'Travel 100km total', hi: 'कुल 100 किमी यात्रा करें' },
    type: 'distance_total',
    target: 100000,
    reward: { coins: 2000, xp: 50, item: 'exclusive_sticker' },
    difficulty: 'hard',
  },
  {
    id: 'achievement_cross_country',
    name: { en: 'Cross-Country', hi: 'क्रॉस-कंट्री' },
    description: { en: 'Travel 500km total', hi: 'कुल 500 किमी यात्रा करें' },
    type: 'distance_total',
    target: 500000,
    reward: { coins: 5000, xp: 100, item: 'golden_auto' },
    difficulty: 'very_hard',
  },

  // Collection achievements
  {
    id: 'achievement_first_fare',
    name: { en: 'First Fare', hi: 'पहला किराया' },
    description: { en: 'Pick up 1 passenger', hi: '1 यात्री उठाएं' },
    type: 'passengers_total',
    target: 1,
    reward: { coins: 50, xp: 5 },
    difficulty: 'easy',
  },
  {
    id: 'achievement_taxi_service',
    name: { en: 'Taxi Service', hi: 'टैक्सी सेवा' },
    description: { en: 'Pick up 1,000 passengers total', hi: 'कुल 1,000 यात्री उठाएं' },
    type: 'passengers_total',
    target: 1000,
    reward: { coins: 1000, xp: 30 },
    difficulty: 'medium',
  },
  {
    id: 'achievement_coin_collector',
    name: { en: 'Coin Collector', hi: 'सिक्का कलेक्टर' },
    description: { en: 'Collect 10,000 coins total', hi: 'कुल 10,000 सिक्के इकट्ठा करें' },
    type: 'coins_total',
    target: 10000,
    reward: { coins: 2000, xp: 40 },
    difficulty: 'medium',
  },

  // Skill achievements
  {
    id: 'achievement_daredevil',
    name: { en: 'Daredevil', hi: 'बहादुर' },
    description: { en: 'Get 100 near misses total', hi: 'कुल 100 निकट चूक प्राप्त करें' },
    type: 'near_misses_total',
    target: 100,
    reward: { coins: 500, xp: 25, badge: 'daredevil' },
    difficulty: 'medium',
  },
  {
    id: 'achievement_speed_demon',
    name: { en: 'Speed Demon', hi: 'गति राक्षस' },
    description: { en: 'Reach max speed', hi: 'अधिकतम गति तक पहुंचें' },
    type: 'max_speed_reached',
    target: 1,
    reward: { coins: 300, xp: 20 },
    difficulty: 'medium',
  },
  {
    id: 'achievement_combo_master',
    name: { en: 'Combo Master', hi: 'कॉम्बो मास्टर' },
    description: { en: 'Achieve 10x passenger combo', hi: '10x यात्री कॉम्बो प्राप्त करें' },
    type: 'max_combo',
    target: 10,
    reward: { coins: 1000, xp: 35, powerup: 'multiplier' },
    difficulty: 'hard',
  },
  {
    id: 'achievement_untouchable',
    name: { en: 'Untouchable', hi: 'अछूत' },
    description: { en: 'Travel 5,000m without crashing', hi: 'बिना टक्कर के 5,000 मीटर यात्रा करें' },
    type: 'distance_single_perfect',
    target: 5000,
    reward: { coins: 2000, xp: 50, powerups: { shield: 5 } },
    difficulty: 'hard',
  },

  // Special achievements
  {
    id: 'achievement_cow_whisperer',
    name: { en: 'Cow Whisperer', hi: 'गाय फुसफुसाहटकर्ता' },
    description: { en: 'Avoid 100 cows total', hi: 'कुल 100 गायों से बचें' },
    type: 'cows_avoided',
    target: 100,
    reward: { coins: 500, xp: 15, horn: 'cow_moo' },
    difficulty: 'medium',
  },
  {
    id: 'achievement_sacred_respect',
    name: { en: 'Respectful Driver', hi: 'सम्मानजनक चालक' },
    description: { en: 'Never hit a cow in 50 runs', hi: '50 दौड़ में कभी गाय से टक्कर न करें' },
    type: 'runs_without_cow_hit',
    target: 50,
    reward: { coins: 1000, xp: 30, title: 'respectful_driver' },
    difficulty: 'hard',
  },
  {
    id: 'achievement_shopping_spree',
    name: { en: 'Shopping Spree', hi: 'शॉपिंग स्प्री' },
    description: { en: 'Purchase 10 customization items', hi: '10 अनुकूलन आइटम खरीदें' },
    type: 'items_purchased',
    target: 10,
    reward: { coins: 1500, xp: 25 },
    difficulty: 'medium',
  },

  // Daily/Streak achievements
  {
    id: 'achievement_daily_rider',
    name: { en: 'Daily Rider', hi: 'दैनिक सवार' },
    description: { en: 'Play 7 days in a row', hi: '7 दिन लगातार खेलें' },
    type: 'daily_streak',
    target: 7,
    reward: { coins: 1000, xp: 20 },
    difficulty: 'medium',
  },
  {
    id: 'achievement_dedicated_driver',
    name: { en: 'Dedicated Driver', hi: 'समर्पित चालक' },
    description: { en: 'Play 30 days in a row', hi: '30 दिन लगातार खेलें' },
    type: 'daily_streak',
    target: 30,
    reward: { coins: 5000, xp: 75, badge: 'veteran' },
    difficulty: 'very_hard',
  },
  {
    id: 'achievement_mission_focused',
    name: { en: 'Mission Focused', hi: 'मिशन केंद्रित' },
    description: { en: 'Complete 50 daily missions', hi: '50 दैनिक मिशन पूरे करें' },
    type: 'missions_completed',
    target: 50,
    reward: { coins: 3000, xp: 40 },
    difficulty: 'hard',
  },

  // Social achievements
  {
    id: 'achievement_share_the_ride',
    name: { en: 'Share the Ride', hi: 'सवारी साझा करें' },
    description: { en: 'Share game 5 times', hi: 'गेम 5 बार साझा करें' },
    type: 'shares',
    target: 5,
    reward: { coins: 500, xp: 15 },
    difficulty: 'easy',
  },

  // Secret achievements
  {
    id: 'achievement_night_owl',
    name: { en: 'Night Owl', hi: 'रात का उल्लू' },
    description: { en: 'Play 50 games between 11 PM - 4 AM', hi: 'रात 11 बजे से सुबह 4 बजे के बीच 50 खेल खेलें' },
    type: 'night_games',
    target: 50,
    reward: { coins: 1000, xp: 30, skin: 'midnight_auto' },
    difficulty: 'medium',
    secret: true,
  },
];

export default ACHIEVEMENTS;
