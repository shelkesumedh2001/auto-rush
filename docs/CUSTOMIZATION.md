# Auto Rush: Mumbai Traffic Run - Customization Guide

Guide for customizing and extending the game.

## Table of Contents
1. [Visual Customization](#visual-customization)
2. [Gameplay Customization](#gameplay-customization)
3. [Adding New Features](#adding-new-features)
4. [Modifying Existing Features](#modifying-existing-features)
5. [Theming](#theming)

## Visual Customization

### Colors

Edit `/src/config/colors.js`:

```javascript
export const COLORS = {
  // Primary colors
  PRIMARY: '#FF6B00',          // Change main orange
  PRIMARY_LIGHT: '#FF8534',
  PRIMARY_DARK: '#CC5500',

  // Background
  BACKGROUND: '#1A1A2E',       // Dark blue-gray
  SURFACE: '#16213E',

  // Change any color to match your brand
  // ...
};
```

### Auto-Rickshaw Customization

#### Add New Body Paint

1. Create new color in `/src/data/shopItems.js`:

```javascript
export const SHOP_ITEMS = {
  bodyPaints: [
    // Existing paints...
    {
      id: 'custom_purple',
      name: { en: 'Royal Purple', hi: 'शाही बैंगनी' },
      price: 1500,
      color: '#9B59B6',
      preview: require('../assets/images/paints/purple.svg'),
    },
  ],
};
```

2. It will automatically appear in the shop!

#### Add Custom Lights

```javascript
lights: [
  {
    id: 'rainbow_lights',
    name: { en: 'Rainbow Lights', hi: 'इंद्रधनुषी रोशनी' },
    price: 2000,
    color: 'linear-gradient(rainbow)', // Or specific color
    effect: 'rainbow', // Custom effect type
  },
],
```

#### Add New Accessories

```javascript
accessories: [
  {
    id: 'flag',
    name: { en: 'India Flag', hi: 'भारत का झंडा' },
    price: 500,
    image: require('../assets/images/accessories/flag.svg'),
    position: { x: 0, y: -20 }, // Offset from auto center
  },
],
```

### Obstacle Customization

#### Modify Obstacle Appearance

Edit `/src/game/entities.js`, find `Obstacle` component:

```javascript
export const Obstacle = (props) => {
  const { body, obstacleType } = props;

  // Change emoji or load custom image
  const getObstacleEmoji = () => {
    switch (obstacleType) {
      case 'car': return '🚗'; // Change to custom SVG
      case 'custom_vehicle': return '🏎️'; // Add new type
      // ...
    }
  };

  // Modify styling
  return (
    <View style={{
      // Change colors, sizes, borders, etc.
    }}>
      {/* Render custom component instead of emoji */}
    </View>
  );
};
```

#### Add New Obstacle Type

1. Define in `/src/config/constants.js`:

```javascript
export const OBSTACLES = {
  // Existing...
  RICKSHAW: {
    type: 'rickshaw',
    width: 60,
    height: 80,
    unlockTime: 70, // Appears after 70 seconds
  },
};
```

2. Add spawn logic in `/src/game/systems.js`:

```javascript
if (gameTime > 70) availableTypes.push('rickshaw');
```

3. Add rendering in `/src/game/entities.js`:

```javascript
case 'rickshaw': return '🛺';
```

## Gameplay Customization

### Difficulty Settings

Edit `/src/config/constants.js`:

```javascript
export const GAME = {
  // Speed settings
  INITIAL_SPEED: 200,      // Lower = easier
  MAX_SPEED: 600,          // Lower = easier
  SPEED_INCREMENT: 10,     // Slower increase = easier

  // Spawn rates (in systems.js)
  OBSTACLE_SPAWN_RATE: 2.0, // Higher = easier (more time between obstacles)
  COIN_SPAWN_RATE: 1.5,

  // Power-up durations
  SHIELD_DURATION: 10000,   // 10 seconds
  MAGNET_DURATION: 8000,
  SPEED_BOOST_DURATION: 5000,
  MULTIPLIER_DURATION: 15000,
};
```

### Scoring System

Modify point values in `/src/game/systems.js`:

```javascript
// Coin collection
dispatch({ type: 'collect-coin', payload: { points: 10 } }); // Change 10

// Passenger pickup
dispatch({ type: 'collect-passenger', payload: { points: 50 } }); // Change 50

// Near-miss bonus
dispatch({ type: 'near-miss', payload: { points: 10 } }); // Change 10

// Combo multiplier
const comboBonus = combo * 25; // Change 25
```

### Power-Up Customization

#### Modify Existing Power-Ups

Edit handlers in `/src/screens/GameScreenPhysics.js`:

```javascript
case 'shield':
  setShieldActive(true);
  setTimeout(() => setShieldActive(false), 10000); // Change duration
  break;

case 'magnet':
  // Change magnet radius in collision detection
  const magnetRadius = 150; // Default 150, increase to collect from farther
  break;
```

#### Add New Power-Up Type

1. Add to power-up spawner in `/src/game/systems.js`:

```javascript
const powerupTypes = [
  'shield', 'magnet', 'speedBoost', 'multiplier',
  'timeSlowdown', // New!
];
```

2. Create handler in `GameScreenPhysics.js`:

```javascript
case 'timeSlowdown':
  setTimeSlowdownActive(true);
  visualEffects.enableSlowMotion(5000); // 5 seconds
  setTimeout(() => setTimeSlowdownActive(false), 5000);
  break;
```

3. Add visual in `/src/game/entities.js`:

```javascript
case 'timeSlowdown':
  return { emoji: '⏰', color: COLORS.INFO };
```

## Adding New Features

### Add New Screen

1. Create file `/src/screens/NewScreen.js`:

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../config/colors';

const NewScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
      {/* Content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  title: { fontSize: 24, color: COLORS.TEXT_PRIMARY },
});

export default NewScreen;
```

2. Import and add to `App.js`:

```javascript
import NewScreen from './src/screens/NewScreen';

const SCREENS = {
  // Existing screens...
  NEW_SCREEN: 'new_screen',
};

// In renderScreen():
case SCREENS.NEW_SCREEN:
  return <NewScreen onClose={handleMainMenu} />;
```

3. Add button to navigate:

```javascript
<Button onPress={() => setCurrentScreen(SCREENS.NEW_SCREEN)}>
  Open New Screen
</Button>
```

### Add New Shop Category

1. Add category to `/src/data/shopItems.js`:

```javascript
export const SHOP_ITEMS = {
  // Existing categories...
  trails: [
    {
      id: 'fire_trail',
      name: { en: 'Fire Trail', hi: 'अग्नि पथ' },
      price: 3000,
      effect: 'fire',
      color: '#FF4500',
    },
  ],
};
```

2. Update `ShopScreen.js` to display new category.

3. Apply effect in `GameScreenPhysics.js`:

```javascript
// In game loop, spawn trail particles
if (user.activeCustomization.trail) {
  visualEffects.createTrailParticle(
    playerX,
    playerY,
    user.activeCustomization.trail.color
  );
}
```

### Add Achievements System

1. Define achievements in `/src/data/achievements.js` (already exists)

2. Create `AchievementsScreen.js`:

```javascript
const AchievementsScreen = () => {
  const achievements = useAchievements(); // Custom hook

  return (
    <ScrollView>
      {achievements.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          unlocked={achievement.unlocked}
        />
      ))}
    </ScrollView>
  );
};
```

3. Track progress in `GameContext`:

```javascript
const checkAchievements = (gameStats) => {
  if (gameStats.score > 10000 && !achievements.score_10k.unlocked) {
    unlockAchievement('score_10k');
    showToast('Achievement Unlocked: Score Master!');
  }
};
```

## Modifying Existing Features

### Change Daily Missions

Edit `/src/data/missions.js`:

```javascript
export const MISSIONS = {
  easy: [
    {
      id: 'custom_mission',
      name: { en: 'Jump 20 Times', hi: '20 बार कूदें' },
      description: { en: 'Make 20 jumps in a single run', hi: 'एक खेल में 20 बार कूदें' },
      target: 20,
      progress: 0,
      reward: { coins: 200, powerup: 'shield', powerupCount: 1 },
      difficulty: 'easy',
      type: 'jumps', // New type: track jumps
    },
  ],
};
```

Track progress in `GameScreenPhysics.js`:

```javascript
const handleJump = () => {
  // Existing jump logic...

  // Track for missions
  updateMissionProgress('jumps', 1);
};
```

### Modify Leaderboard

Replace mock data in `/src/screens/LeaderboardScreen.js`:

```javascript
// Option 1: Use Firebase Firestore
const fetchLeaderboard = async () => {
  const snapshot = await firestore()
    .collection('leaderboard')
    .orderBy('score', 'desc')
    .limit(100)
    .get();

  return snapshot.docs.map(doc => doc.data());
};

// Option 2: Use Google Play Games Services
import PlayGamesServices from 'react-native-play-games-services';

const showLeaderboard = () => {
  PlayGamesServices.showLeaderboard('LEADERBOARD_ID');
};
```

### Customize Sound Effects

1. Replace audio files in `/src/assets/sounds/sfx/`

2. Update `AudioService.js` if file names change:

```javascript
const SOUNDS = {
  coin: require('../assets/sounds/sfx/custom-coin.mp3'),
  // ...
};
```

3. Adjust volume:

```javascript
await sound.setVolumeAsync(0.5); // 50% volume
```

## Theming

### Create Dark/Light Theme Toggle

1. Add theme to `SettingsContext.js`:

```javascript
const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
```

2. Create theme colors in `/src/config/colors.js`:

```javascript
export const THEMES = {
  dark: {
    BACKGROUND: '#1A1A2E',
    TEXT_PRIMARY: '#FFFFFF',
    // ...
  },
  light: {
    BACKGROUND: '#FFFFFF',
    TEXT_PRIMARY: '#000000',
    // ...
  },
};

export const getColors = (theme) => THEMES[theme];
```

3. Use in components:

```javascript
const { theme } = useSettings();
const colors = getColors(theme);

<View style={{ backgroundColor: colors.BACKGROUND }}>
```

### Regional Customization

#### India-Specific

Already implemented:
- Hindi language support
- Indian number formatting (lakhs/crores)
- Rupee symbol (₹)
- Cultural elements (cow, auto-rickshaw)

#### Add Regional Variant (e.g., Brazil)

1. Add Portuguese translations in `/src/data/translations.js`:

```javascript
export const TRANSLATIONS = {
  en: { /* ... */ },
  hi: { /* ... */ },
  pt: {
    PLAY: 'Jogar',
    SHOP: 'Loja',
    // ...
  },
};
```

2. Add Brazil-specific obstacles:
- Soccer ball
- Carnival theme
- Local vehicles

3. Add currency: R$ (Brazilian Real)

## Advanced Customizations

### Custom Physics Behavior

Modify `/src/game/PhysicsEngine.js`:

```javascript
// Change gravity
this.engine.world.gravity.y = 1.2; // Higher = faster falling

// Change player friction
const player = Matter.Bodies.rectangle(x, y, width, height, {
  friction: 0.5,        // Surface friction
  frictionAir: 0.05,    // Air resistance
  restitution: 0.8,     // Bounciness
});
```

### Particle System Customization

Edit `/src/game/VisualEffects.js`:

```javascript
createParticleBurst(x, y, {
  count: 20,            // More particles
  colors: ['#FF0000', '#00FF00', '#0000FF'],
  sizes: [8, 10, 12],   // Larger particles
  lifetime: 2000,       // Longer lifetime
});
```

### Camera Effects

Add camera zoom effect:

```javascript
const cameraZoom = useRef(new Animated.Value(1)).current;

const zoomIn = () => {
  Animated.timing(cameraZoom, {
    toValue: 1.2,
    duration: 200,
    useNativeDriver: true,
  }).start();
};

// Apply to game view
<Animated.View style={{ transform: [{ scale: cameraZoom }] }}>
  {/* Game content */}
</Animated.View>
```

## Configuration Files

### Quick Reference

| File | Purpose | Common Changes |
|------|---------|----------------|
| `app.json` | Expo config | App name, version, bundle ID |
| `colors.js` | Color palette | Brand colors, theme |
| `constants.js` | Game constants | Speed, spawn rates, durations |
| `translations.js` | i18n strings | Add languages, modify text |
| `shopItems.js` | Shop inventory | Add items, change prices |
| `missions.js` | Daily missions | Add missions, modify rewards |
| `admob.js` | Ad configuration | Ad unit IDs, frequency |
| `iap.js` | IAP products | Product IDs, prices |

## Best Practices

### Performance
- Test all changes on physical device
- Profile with React DevTools Profiler
- Keep particle count reasonable (<100)
- Optimize images before adding

### Maintainability
- Comment complex logic
- Use meaningful variable names
- Keep functions small and focused
- Follow existing code style

### Testing
- Test on multiple devices
- Test both languages (English/Hindi)
- Test IAPs in sandbox mode
- Verify ads work with test IDs

### User Experience
- Ensure changes don't make game too hard/easy
- Keep UI clear and intuitive
- Test with non-technical users
- Maintain cultural sensitivity

## Common Customization Recipes

### Make Game Easier
```javascript
// Lower speeds
INITIAL_SPEED: 150
MAX_SPEED: 400

// Spawn obstacles less frequently
spawnInterval = 3.0 // Instead of 2.0

// Make power-ups last longer
SHIELD_DURATION: 15000 // Instead of 10000
```

### Make Game Harder
```javascript
// Higher speeds
INITIAL_SPEED: 250
MAX_SPEED: 800

// Spawn more obstacles
spawnInterval = 1.0 // Instead of 2.0

// Smaller player hitbox
PLAYER_WIDTH: 50 // Instead of 60
```

### Change Monetization Balance
```javascript
// More coins from gameplay (less IAP pressure)
coinValue = 20; // Instead of 10

// Cheaper shop items
price: 500 // Instead of 1000

// Lower IAP prices
{ productId: 'coins_small', price: 0.49 } // Instead of 0.99
```

---

**Happy customizing!** 🎨

Remember: Always test changes thoroughly before deployment!
