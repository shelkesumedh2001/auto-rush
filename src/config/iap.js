/**
 * In-App Purchase Configuration
 * Google Play Billing products and pricing
 */

// IAP Product definitions
export const IAP_PRODUCTS = {
  // Consumable products (can be purchased multiple times)
  COINS_SMALL: {
    id: 'coins_small_pack',
    type: 'consumable',
    amount: 5000,
    price: 29, // ₹29
    displayPrice: '₹29',
    bonus: 0,
    label: 'Small Coin Pack',
    description: '5,000 coins',
    bestValue: false,
  },

  COINS_MEDIUM: {
    id: 'coins_medium_pack',
    type: 'consumable',
    amount: 15000,
    price: 79, // ₹79
    displayPrice: '₹79',
    bonus: 3000, // 20% bonus (18,000 total)
    label: 'Medium Coin Pack',
    description: '15,000 coins + 3,000 BONUS!',
    bestValue: true, // Highlighted in shop
    popular: false,
  },

  COINS_LARGE: {
    id: 'coins_large_pack',
    type: 'consumable',
    amount: 40000,
    price: 149, // ₹149
    displayPrice: '₹149',
    bonus: 10000, // 25% bonus (50,000 total)
    label: 'Large Coin Pack',
    description: '40,000 coins + 10,000 BONUS!',
    bestValue: false,
    popular: false,
  },

  COINS_MEGA: {
    id: 'coins_mega_pack',
    type: 'consumable',
    amount: 100000,
    price: 299, // ₹299
    displayPrice: '₹299',
    bonus: 35000, // 35% bonus (135,000 total)
    label: 'Mega Coin Pack',
    description: '100,000 coins + 35,000 BONUS!',
    bestValue: false,
    popular: true, // Badge: "MOST POPULAR"
  },

  POWERUP_BUNDLE: {
    id: 'powerup_starter_bundle',
    type: 'consumable',
    contents: {
      shield: 5,
      magnet: 5,
      speedBoost: 5,
      multiplier: 5,
    },
    price: 49, // ₹49
    displayPrice: '₹49',
    label: 'Power-Up Starter Pack',
    description: '5 of each power-up (20 total)',
  },

  DAILY_BOOST: {
    id: 'daily_boost_24h',
    type: 'consumable',
    duration: 86400000, // 24 hours in ms
    effect: 'double_coins',
    price: 99, // ₹99
    displayPrice: '₹99',
    label: '24-Hour Coin Doubler',
    description: 'Earn 2x coins for 24 hours',
  },

  // Non-consumable products (one-time purchases)
  REMOVE_ADS: {
    id: 'remove_ads_permanent',
    type: 'non-consumable',
    price: 149, // ₹149
    displayPrice: '₹149',
    label: 'Remove All Ads',
    description: 'Never see ads again!',
    popular: true,
    saves: 'Save 10+ minutes per day', // Marketing text
  },

  VIP_AUTO_PASS: {
    id: 'vip_all_skins_unlock',
    type: 'non-consumable',
    price: 399, // ₹399
    displayPrice: '₹399',
    label: 'VIP Auto Pass',
    description: 'Unlock ALL auto skins instantly',
    contents: 'All body paints, lights, horns, accessories (₹15,000+ value)',
    bestValue: false,
  },

  PREMIUM_START: {
    id: 'premium_start_boost',
    type: 'non-consumable',
    price: 199, // ₹199
    displayPrice: '₹199',
    label: 'Premium Start',
    description: 'Start every run with all power-ups',
    effect: 'spawn_with_powerups',
  },

  // Subscription (implement after initial launch)
  MUMBAI_VIP: {
    id: 'mumbai_vip_monthly',
    type: 'subscription',
    period: 'monthly',
    price: 299, // ₹299/month
    displayPrice: '₹299/month',
    label: 'Mumbai VIP Membership',
    benefits: [
      'Remove all ads',
      'Earn 2x coins permanently',
      'Daily power-up package',
      'Exclusive monthly auto skin',
      'Gold name on leaderboard',
      'Priority customer support'
    ],
    trial: 3, // 3-day free trial
    trialText: 'Start 3-day free trial',
  },
};

// Get all product IDs for initialization
export const getAllProductIds = () => {
  return Object.values(IAP_PRODUCTS)
    .filter(p => p.type !== 'subscription') // Handle subscriptions separately
    .map(p => p.id);
};

// Get subscription IDs
export const getSubscriptionIds = () => {
  return Object.values(IAP_PRODUCTS)
    .filter(p => p.type === 'subscription')
    .map(p => p.id);
};

// First-time buyer bonus
export const FIRST_TIME_BONUS = {
  ENABLED: true,
  BONUS_PERCENTAGE: 0.5, // 50% extra coins
  APPLIES_TO: ['coins_small_pack', 'coins_medium_pack', 'coins_large_pack', 'coins_mega_pack'],
};

// Special offers configuration
export const SPECIAL_OFFERS = {
  DIWALI: {
    ENABLED: false, // Enable during Diwali
    PRODUCT_IDS: ['coins_mega_pack'],
    DISCOUNT: 0.3, // 30% off
    START_DATE: '2024-10-30',
    END_DATE: '2024-11-05',
  },
  HOLI: {
    ENABLED: false,
    PRODUCT_IDS: ['vip_all_skins_unlock'],
    DISCOUNT: 0.25,
    START_DATE: '2024-03-20',
    END_DATE: '2024-03-27',
  },
};

// Revenue tracking (for analytics)
export const REVENUE_GOALS = {
  DAILY_TARGET: 20000, // ₹20,000/day (10K DAU assumed)
  MONTHLY_TARGET: 600000, // ₹6 lakh/month
  CONVERSION_RATE_TARGET: 0.02, // 2% of DAU
};

export default IAP_PRODUCTS;
