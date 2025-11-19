# Auto Rush: Mumbai Traffic Run - Architecture Documentation

Technical architecture and code organization guide.

## Technology Stack

### Core Framework
- **React Native**: v0.73+ (via Expo SDK 50+)
- **Expo SDK**: v50+
- **TypeScript**: Optional (currently JavaScript)

### Game Engine
- **react-native-game-engine**: v2.1+
- **Matter.js**: v0.19+ (physics engine)
- **React Native Animated**: For UI animations

### State Management
- **React Context API**: User, Game, Settings contexts
- **AsyncStorage**: Local persistence

### Monetization
- **expo-ads-admob**: AdMob integration
- **expo-in-app-purchases**: IAP handling

### Services
- **Firebase Analytics**: User tracking
- **Firebase Crashlytics**: Crash reporting (optional)

## Project Structure

```
auto-rush/
├── App.js                          # Root component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── .env                            # Environment variables
│
├── src/
│   ├── assets/                     # Static assets
│   │   ├── images/                 # SVG/PNG images
│   │   ├── sounds/                 # Audio files
│   │   └── fonts/                  # Custom fonts
│   │
│   ├── components/                 # Reusable components
│   │   └── ui/                     # UI components
│   │       ├── Button.js
│   │       └── ... (other UI components)
│   │
│   ├── config/                     # Configuration
│   │   ├── colors.js               # Color palette
│   │   ├── constants.js            # Game constants
│   │   ├── admob.js                # AdMob config
│   │   └── iap.js                  # IAP products
│   │
│   ├── context/                    # React Context providers
│   │   ├── UserContext.js          # User data & coins
│   │   ├── GameContext.js          # Active game state
│   │   └── SettingsContext.js      # App settings
│   │
│   ├── data/                       # Static game data
│   │   ├── translations.js         # i18n strings
│   │   ├── missions.js             # Daily missions
│   │   ├── achievements.js         # Achievement definitions
│   │   └── shopItems.js            # Shop inventory
│   │
│   ├── game/                       # Game engine
│   │   ├── PhysicsEngine.js        # Matter.js wrapper
│   │   ├── entities.js             # Game entity renderers
│   │   ├── systems.js              # Game loop systems
│   │   └── VisualEffects.js        # Effects manager
│   │
│   ├── monetization/               # Revenue systems
│   │   ├── AdManager.js            # AdMob integration
│   │   └── IAPManager.js           # IAP integration
│   │
│   ├── screens/                    # App screens
│   │   ├── SplashScreen.js
│   │   ├── MainMenuScreen.js
│   │   ├── GameScreen.js           # Legacy (Animated-based)
│   │   ├── GameScreenPhysics.js    # New (Physics-based)
│   │   ├── GameOverScreen.js
│   │   ├── ShopScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── MissionsScreen.js
│   │   └── LeaderboardScreen.js
│   │
│   └── services/                   # Business logic services
│       ├── StorageService.js       # AsyncStorage wrapper
│       ├── LocalizationService.js  # i18n management
│       ├── AudioService.js         # Sound/music player
│       ├── AnalyticsService.js     # Firebase Analytics
│       └── AssetManager.js         # Asset loading
│
├── docs/                           # Documentation
│   ├── SETUP.md
│   ├── TESTING.md
│   ├── DEPLOYMENT.md
│   ├── MONETIZATION.md
│   ├── ARCHITECTURE.md
│   └── CUSTOMIZATION.md
│
└── __tests__/                      # Test files (if implemented)
    └── ...
```

## Core Systems

### 1. Game Engine Architecture

#### Physics Engine (`PhysicsEngine.js`)
```javascript
class PhysicsEngine {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
  }

  createPlayer(x, y) // Creates player physics body
  createObstacle(x, y, width, height, type) // Creates obstacle
  jump(force) // Applies jump force
  checkPlayerCollisions() // Detects collisions
  update(delta) // Steps physics simulation
}
```

**Responsibilities:**
- Physics simulation
- Collision detection
- Body creation/destruction

#### Game Systems (`systems.js`)
```javascript
// Each system is a function called every frame
export const Physics = (entities, { time }) => { ... }
export const Movement = (entities, { time }) => { ... }
export const ObstacleSpawner = (entities, { time }) => { ... }
export const CollisionSystem = (entities, { events, dispatch }) => { ... }
```

**Systems:**
- `Physics`: Updates Matter.js simulation
- `Movement`: Moves entities down screen
- `ObstacleSpawner`: Spawns obstacles based on time
- `CoinSpawner`: Spawns coins
- `PowerupSpawner`: Spawns power-ups
- `PassengerSpawner`: Spawns passengers
- `CollisionSystem`: Handles collisions and dispatches events
- `NearMissSystem`: Detects near-miss bonuses

#### Entity Renderers (`entities.js`)
```javascript
export const Player = (props) => {
  const { body, shieldActive, magnetActive } = props;
  // Renders player at body.position
}

export const Obstacle = (props) => {
  const { body, obstacleType } = props;
  // Renders obstacle at body.position
}
```

**Responsibilities:**
- Pure rendering components
- Position determined by physics body
- Visual representation only

### 2. State Management

#### User Context
```javascript
const UserContext = createContext();

// Manages:
- user.coins // Virtual currency
- user.highScore // Best score
- user.inventory // Purchased items
- user.activeCustomization // Equipped items
```

#### Game Context
```javascript
const GameContext = createContext();

// Manages (during active game):
- gameState.score
- gameState.distance
- gameState.activePowerups
- gameState.combo
```

#### Settings Context
```javascript
const SettingsContext = createContext();

// Manages:
- settings.language // 'en' or 'hi'
- settings.soundEnabled
- settings.musicEnabled
- settings.vibrationEnabled
```

### 3. Data Flow

```
User Action (swipe, tap)
    ↓
PanResponder / TouchableOpacity
    ↓
Handler function (handleJump, handleSlide, etc.)
    ↓
Updates physics (PhysicsEngine.jump())
    ↓
Game systems update (Movement, Collision, etc.)
    ↓
Collision detected → dispatch event
    ↓
GameScreenPhysics.handleEvent()
    ↓
Update React state (score, coins, etc.)
    ↓
Context providers update
    ↓
UI re-renders
```

### 4. Asset Management

```javascript
// AssetManager.js
class AssetManager {
  async loadAssets(onProgress) {
    // Loads images, sounds, fonts
    // Updates progress callback
  }

  getImage(category, name) {
    return ASSETS.images[category][name];
  }
}
```

**Asset Categories:**
- `images/vehicles`: Auto-rickshaw designs
- `images/obstacles`: All obstacle types
- `images/powerups`: Power-up icons
- `images/ui`: Coins, passengers, UI elements
- `sounds/music`: Background music
- `sounds/sfx`: Sound effects
- `fonts`: Custom fonts

### 5. Service Layer

#### Storage Service
```javascript
class StorageService {
  async save(key, value) // Saves to AsyncStorage
  async load(key) // Loads from AsyncStorage
  async clear() // Clears all data
}
```

**Stored Data:**
- User profile
- High score
- Coins balance
- Purchased items
- Daily missions progress
- Settings preferences

#### Localization Service
```javascript
class LocalizationService {
  t(key) // Translate key to current language
  setLanguage(lang) // Switch language
  formatNumber(num) // Format with commas/lakhs
}
```

**Features:**
- English/Hindi support
- Indian number formatting (lakhs, crores)
- Dynamic language switching

#### Audio Service
```javascript
class AudioService {
  async initialize() // Loads audio files
  playMusic(track) // Plays background music
  playSFX(sound) // Plays sound effect
  stopAll() // Stops all audio
}
```

#### Analytics Service
```javascript
class AnalyticsService {
  logGameStart()
  logGameOver(stats)
  logPurchase(productId, price)
  logAdImpression(adType)
}
```

### 6. Monetization Layer

#### Ad Manager
```javascript
class AdManager {
  async initialize() // Setup AdMob
  async showInterstitial() // Show full-screen ad
  async showRewardedAd(reward) // Show rewarded video
  showBanner() // Display banner
}
```

**Ad Frequency Control:**
- Interstitial: Min 3 minutes between shows
- Banner: Always visible on menu
- Rewarded: User-initiated, no limit

#### IAP Manager
```javascript
class IAPManager {
  async initialize() // Setup IAP
  async purchaseProduct(productId) // Initiate purchase
  async restorePurchases() // Restore previous purchases
}
```

## Performance Optimizations

### 1. Object Pooling
- Reuse obstacle/coin objects instead of creating new ones
- Reduces garbage collection pauses

### 2. Efficient Rendering
- Use `useNativeDriver: true` for animations
- Minimize re-renders with React.memo and useCallback
- Render only visible entities

### 3. Asset Optimization
- Compress PNG images
- Use appropriate image sizes (don't load 1024px when showing 60px)
- Lazy load non-critical assets

### 4. Memory Management
- Remove entities when off-screen
- Clear particle arrays regularly
- Dispose physics bodies

### 5. Physics Optimization
- Use sensor bodies for collectibles (no physics response)
- Limit physics iterations if needed
- Broad-phase collision detection

## Code Patterns

### Component Structure
```javascript
const ComponentName = ({ prop1, prop2 }) => {
  // 1. State hooks
  const [state, setState] = useState(initial);

  // 2. Context hooks
  const { contextValue } = useContext(SomeContext);

  // 3. Refs
  const refName = useRef(null);

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 5. Handler functions
  const handleAction = () => {
    // Handler logic
  };

  // 6. Render
  return (
    <View>
      {/* JSX */}
    </View>
  );
};

// 7. Styles
const styles = StyleSheet.create({ ... });

// 8. Export
export default ComponentName;
```

### Service Pattern (Singleton)
```javascript
class ServiceName {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    // Init logic
    this.initialized = true;
  }

  // Public methods
  methodName() { ... }
}

// Export singleton instance
const serviceName = new ServiceName();
export default serviceName;
```

## Testing Strategy

### Unit Tests
- Services: StorageService, LocalizationService
- Utilities: Number formatting, date handling
- Game logic: Scoring, collision detection

### Integration Tests
- Context providers with components
- Game systems integration
- IAP flow

### E2E Tests
- Complete gameplay session
- Purchase flow
- Language switching

## Deployment Architecture

### Development
```
Expo Dev Server → Metro Bundler → Expo Go App
```

### Production (EAS Build)
```
Source Code → EAS Build Service → APK/AAB (Android) or IPA (iOS)
    ↓
App Store / Google Play
```

### CI/CD (Future)
```
GitHub → GitHub Actions → Run Tests → EAS Build → Auto-submit
```

## Security Considerations

### Data Security
- No sensitive data stored in AsyncStorage
- User IDs are anonymous
- No personal information collected

### IAP Security
- Server-side receipt validation (if backend implemented)
- Verify purchases before granting coins

### Ad Security
- Use official AdMob SDK
- Don't manipulate ad impressions
- Follow AdMob policies

## Scalability

### Current Limitations
- Local-only leaderboards (no backend)
- No cloud save
- No real-time multiplayer

### Future Enhancements
- **Backend (Firebase/AWS)**:
  - Cloud Firestore for leaderboards
  - Authentication for user accounts
  - Cloud Functions for IAP validation

- **Features**:
  - Real global leaderboards
  - Friend challenges
  - Tournaments
  - Cloud save sync

## Troubleshooting

### Common Issues

**"Cannot find module"**
- Check import paths
- Verify file exists
- Run `npm install`

**Physics not working**
- Ensure GameScreenPhysics is used (not old GameScreen)
- Check Matter.js is installed
- Verify systems are passed to GameEngine

**Performance issues**
- Profile with React DevTools
- Check for unnecessary re-renders
- Optimize particle count
- Test on physical device

**State not persisting**
- Check StorageService save calls
- Verify AsyncStorage permissions
- Test on device (not just simulator)

## Contributing Guidelines

### Code Style
- Use camelCase for variables/functions
- Use PascalCase for components
- Consistent indentation (2 spaces)
- Meaningful variable names

### Git Workflow
```
main (production)
  ↓
develop (integration)
  ↓
feature/feature-name (development)
```

### Pull Request Checklist
- [ ] Code tested manually
- [ ] No console.logs in production code
- [ ] Documentation updated
- [ ] Follows code style
- [ ] Descriptive commit messages

---

**This architecture supports:**
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
- ✅ Performance
- ✅ Extensibility
