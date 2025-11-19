/**
 * Color Palette
 * Indian-inspired colors for Mumbai Traffic Run theme
 */

export const COLORS = {
  // Primary colors (Mumbai sunset theme)
  PRIMARY: '#FF6B35', // Vibrant orange (sunset, auto color)
  PRIMARY_DARK: '#D84315', // Deep orange
  PRIMARY_LIGHT: '#FFAB91', // Light peachy orange

  // Secondary colors (Festival vibes)
  SECONDARY: '#F7B731', // Golden yellow (turmeric, Diwali)
  SECONDARY_DARK: '#F39C12', // Deep gold
  SECONDARY_LIGHT: '#FFF176', // Light yellow

  // Accent colors
  ACCENT_PINK: '#E91E63', // Hot pink (Holi powder)
  ACCENT_GREEN: '#4CAF50', // Vibrant green (Indian flag)
  ACCENT_BLUE: '#2196F3', // Sky blue
  ACCENT_PURPLE: '#9C27B0', // Rich purple (royal)

  // UI colors
  BACKGROUND: '#FFF8E1', // Warm off-white
  SURFACE: '#FFFFFF', // Pure white cards
  ERROR: '#F44336', // Red for crashes
  SUCCESS: '#4CAF50', // Green for success
  WARNING: '#FF9800', // Orange warning
  INFO: '#2196F3', // Blue info

  // Text colors
  TEXT_PRIMARY: '#212121', // Almost black
  TEXT_SECONDARY: '#757575', // Gray
  TEXT_DISABLED: '#BDBDBD', // Light gray
  TEXT_ON_PRIMARY: '#FFFFFF', // White text on orange buttons
  TEXT_ON_DARK: '#FFFFFF', // White text on dark backgrounds

  // Game-specific colors
  COIN_GOLD: '#FFD700', // Coin color
  RUPEE_GOLD: '#FFB300', // Rupee symbol color

  // Power-up colors
  POWER_UP_SHIELD: '#2196F3', // Blue shield
  POWER_UP_MAGNET: '#9C27B0', // Purple magnet
  POWER_UP_SPEED: '#F44336', // Red flames
  POWER_UP_MULTIPLIER: '#FFD700', // Gold multiplier

  // Overlay colors
  MODAL_BACKDROP: 'rgba(0, 0, 0, 0.7)', // Dark overlay
  CRASH_FLASH: 'rgba(244, 67, 54, 0.4)', // Red crash flash
  SUCCESS_GLOW: 'rgba(76, 175, 80, 0.3)', // Green glow
  PAUSE_OVERLAY: 'rgba(0, 0, 0, 0.5)', // Pause screen overlay

  // Gradient colors
  GRADIENT_SUNSET: ['#FF6B35', '#F7B731'], // Orange to yellow
  GRADIENT_SKY: ['#2196F3', '#FF6B35'], // Blue to orange
  GRADIENT_GOLD: ['#FFD700', '#FFA000'], // Gold gradient

  // Road and environment
  ROAD_DARK: '#424242', // Dark asphalt
  ROAD_LINE: '#FFFFFF', // White lane markings
  SKY_TOP: '#87CEEB', // Light blue sky
  SKY_HORIZON: '#FF6B35', // Orange horizon
  GRASS_GREEN: '#4CAF50', // Grass/trees
  BUILDING_GRAY: '#757575', // Buildings

  // UI element colors
  BUTTON_PRIMARY: '#4CAF50', // Green button
  BUTTON_SECONDARY: '#FF9800', // Orange button
  BUTTON_DANGER: '#F44336', // Red button
  BUTTON_DISABLED: '#BDBDBD', // Disabled button

  // Shop and monetization
  PREMIUM_GOLD: '#FFD700', // Premium items
  LOCKED_GRAY: '#9E9E9E', // Locked items
  OWNED_GREEN: '#4CAF50', // Owned items
  SALE_RED: '#F44336', // Sale badges

  // Leaderboard
  RANK_GOLD: '#FFD700', // 1st place
  RANK_SILVER: '#C0C0C0', // 2nd place
  RANK_BRONZE: '#CD7F32', // 3rd place

  // Transparent
  TRANSPARENT: 'transparent',
};

// Shadow colors for depth
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default COLORS;
