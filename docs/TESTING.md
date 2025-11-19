# Auto Rush: Mumbai Traffic Run - Testing Guide

Comprehensive testing procedures for quality assurance.

## Table of Contents
1. [Testing Overview](#testing-overview)
2. [Manual Testing](#manual-testing)
3. [Automated Testing](#automated-testing)
4. [Performance Testing](#performance-testing)
5. [Platform-Specific Testing](#platform-specific-testing)
6. [Monetization Testing](#monetization-testing)
7. [Localization Testing](#localization-testing)
8. [Pre-Release Checklist](#pre-release-checklist)

## Testing Overview

### Testing Levels
1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Feature interactions
3. **E2E Tests**: Complete user flows
4. **Performance Tests**: FPS, memory, battery
5. **User Acceptance Tests**: Real user feedback

### Testing Tools
- Jest: Unit and integration testing
- React Native Testing Library: Component testing
- Detox: E2E testing (optional)
- Manual testing: Critical for mobile games

## Manual Testing

### Core Gameplay Testing

#### Game Start Flow
- [ ] Splash screen displays for ~2 seconds
- [ ] Main menu loads correctly
- [ ] "Play" button starts game immediately
- [ ] Tutorial overlay shows for first 5 seconds
- [ ] Game starts with player at correct position

#### Movement Controls
- [ ] Swipe UP: Player jumps smoothly
- [ ] Swipe DOWN: Player slides/ducks
- [ ] Swipe LEFT: Player moves to left lane
- [ ] Swipe RIGHT: Player moves to right lane
- [ ] Tap pause: Game pauses correctly
- [ ] Swipes are responsive and accurate
- [ ] No input lag or delayed response

#### Obstacle Interactions
- [ ] **Car** (0s+): Spawns correctly, collision detected
- [ ] **Bus** (10s+): Larger hitbox, spawns in correct lane
- [ ] **Truck** (20s+): Larger hitbox, correct visuals
- [ ] **Dog** (30s+): Moves horizontally, collision works
- [ ] **Pothole** (40s+): Requires jump to avoid
- [ ] **Cow** (50s+): Special collision message displays
- [ ] **Construction** (60s+): Blocks lane, requires avoidance
- [ ] All obstacles scroll at correct speed
- [ ] Obstacles despawn when off-screen
- [ ] Progressive unlocking works (obstacles appear at right times)

#### Collectibles
- [ ] Coins: Collected on contact, +10 points, sound plays
- [ ] Passengers: Collected, +50 points, combo system works
- [ ] Power-ups: All 4 types spawn and work correctly
- [ ] Magnet: Attracts nearby coins automatically
- [ ] Multiplier active: Coins worth 2x for 15 seconds

#### Power-Ups
- [ ] **Shield**: Protects from 1 collision, visual effect shows
- [ ] **Magnet**: Auto-collects coins within radius for 8s
- [ ] **Speed Boost**: Game speeds up for 5s, motion blur effect
- [ ] **Multiplier**: 2x score multiplier for 15s, indicator shows
- [ ] Power-ups don't stack (new replaces old)
- [ ] Power-up timers accurate
- [ ] Visual indicators clear and persistent

#### Scoring System
- [ ] Score increases with distance traveled
- [ ] Coins add correct points (+10 base, +20 with multiplier)
- [ ] Passengers add +50 points
- [ ] Combo system: Multiple passengers = bonus points
- [ ] Near-miss: Close dodge adds +10 points
- [ ] Score displays correctly in HUD
- [ ] Final score matches in-game score

#### Game Over
- [ ] Collision ends game correctly
- [ ] Game over screen shows within 1 second
- [ ] Stats displayed correctly:
  - [ ] Final score
  - [ ] Distance traveled
  - [ ] Coins collected
  - [ ] Passengers picked up
  - [ ] Near-misses
  - [ ] Combo achieved
- [ ] High score updated if exceeded
- [ ] Coins added to user account
- [ ] "Try Again" button restarts game
- [ ] "Main Menu" button returns to menu

### UI/UX Testing

#### Main Menu
- [ ] All buttons visible and clickable
- [ ] User stats display correctly (coins, high score)
- [ ] Shop button opens shop
- [ ] Settings button opens settings
- [ ] Missions button opens missions
- [ ] Leaderboard button opens leaderboard
- [ ] Language can be switched (Hindi/English)

#### Shop Screen
- [ ] All items display with prices
- [ ] Items categorized correctly
- [ ] Purchase button works
- [ ] "Insufficient coins" message if can't afford
- [ ] Successful purchase confirmation
- [ ] Purchased items appear in inventory
- [ ] "Equip" button works
- [ ] Active customization shows on player

#### Missions Screen
- [ ] 3 daily missions display
- [ ] Progress bars accurate
- [ ] Completed missions show "READY" badge
- [ ] Claim button works when completed
- [ ] Rewards added to account
- [ ] "Claimed" state persists
- [ ] Missions reset daily at midnight IST

#### Leaderboard Screen
- [ ] Player rank displays
- [ ] Top players list shows
- [ ] Tabs switch correctly (Friends/Global/Weekly)
- [ ] "Sign in with Google Play Games" button present
- [ ] Medal icons show for top 3

#### Settings Screen
- [ ] Language toggle works (Hindi ↔ English)
- [ ] Sound FX toggle works
- [ ] Music toggle works
- [ ] Vibration toggle works
- [ ] Settings persist after app restart
- [ ] "About" info displays

### Visual Effects Testing
- [ ] Camera shake on collision
- [ ] Screen flash on game over
- [ ] Particle effects on coin collection
- [ ] Explosion effect on crash
- [ ] Glow effect on power-ups
- [ ] Motion blur during speed boost
- [ ] Smooth animations throughout
- [ ] No visual glitches or artifacts

### Audio Testing
- [ ] Background music plays on menu
- [ ] Background music plays during game
- [ ] Music loops seamlessly
- [ ] Sound effects play correctly:
  - [ ] Coin collection
  - [ ] Power-up pickup
  - [ ] Jump
  - [ ] Slide
  - [ ] Crash
  - [ ] Near-miss
  - [ ] Passenger pickup
  - [ ] Shield hit
- [ ] Audio doesn't overlap awkwardly
- [ ] Volume controls work
- [ ] Audio pauses when app backgrounds

## Automated Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode during development
npm test -- --watch
```

#### Key Test Files
- `__tests__/services/StorageService.test.js`
- `__tests__/services/LocalizationService.test.js`
- `__tests__/context/UserContext.test.js`
- `__tests__/context/GameContext.test.js`
- `__tests__/game/PhysicsEngine.test.js`
- `__tests__/game/systems.test.js`

### Integration Tests

Test complete features:

```javascript
// Example: Test shop purchase flow
describe('Shop Purchase Flow', () => {
  it('allows purchase when user has sufficient coins', async () => {
    // Test implementation
  });

  it('prevents purchase when insufficient coins', async () => {
    // Test implementation
  });
});
```

### E2E Tests (Optional - Detox)

```bash
# Setup Detox
npm install --save-dev detox

# Run E2E tests
npm run e2e
```

## Performance Testing

### Frame Rate (FPS)
- [ ] Consistent 60 FPS during gameplay
- [ ] No frame drops on obstacle spawn
- [ ] Smooth particle animations
- [ ] No stuttering on power-up activation

**Tools:**
- React DevTools Profiler
- Xcode Instruments (iOS)
- Android Profiler (Android)

### Memory Usage
- [ ] Memory stays under 150MB
- [ ] No memory leaks during long gameplay
- [ ] Proper cleanup on game over
- [ ] Assets load/unload correctly

**Test:**
```bash
# Monitor memory
# iOS: Xcode → Product → Profile → Allocations
# Android: Android Studio → Profiler → Memory
```

### Battery Impact
- [ ] Normal battery drain during gameplay
- [ ] App doesn't cause excessive heating
- [ ] Background processes minimal

### Load Times
- [ ] Splash to menu: < 3 seconds
- [ ] Menu to game: < 1 second
- [ ] Game over to restart: < 1 second
- [ ] Asset loading: < 2 seconds

## Platform-Specific Testing

### iOS Testing

#### Device Matrix
- [ ] iPhone SE (smallest screen)
- [ ] iPhone 12/13/14 (standard)
- [ ] iPhone 14 Pro Max (largest screen)
- [ ] iPad (tablet support)

#### iOS-Specific
- [ ] Safe area insets respected (notch)
- [ ] Home indicator doesn't interfere
- [ ] App Store rating prompt works
- [ ] Game Center integration (if implemented)
- [ ] App backgrounding/foregrounding
- [ ] Notifications permissions

### Android Testing

#### Device Matrix
- [ ] Low-end device (2GB RAM, Snapdragon 400 series)
- [ ] Mid-range device (4GB RAM, Snapdragon 600 series)
- [ ] High-end device (8GB+ RAM, Snapdragon 800 series)
- [ ] Various screen sizes (4.7" to 6.7")
- [ ] Tablets

#### Android-Specific
- [ ] Back button behavior
- [ ] Hardware back button
- [ ] Google Play Games integration
- [ ] Different Android versions (API 30+)
- [ ] Various screen densities
- [ ] Permissions (storage, etc.)

### Screen Orientations
- [ ] Portrait mode works correctly
- [ ] Landscape locked (if intended)
- [ ] Rotation handled gracefully

## Monetization Testing

### AdMob Integration
- [ ] Banner ads display (main menu)
- [ ] Interstitial ads show (after game over)
- [ ] Rewarded ads work (double coins, extra life)
- [ ] Ad frequency respects limits:
  - [ ] Interstitial: Max 1 per 3 minutes
  - [ ] Rewarded: Available when needed
- [ ] Ads don't block gameplay
- [ ] "No ad available" handled gracefully
- [ ] Test ads work in development
- [ ] Real ads work in production

**Use test ad IDs:**
```
Banner: ca-app-pub-3940256099942544/6300978111
Interstitial: ca-app-pub-3940256099942544/1033173712
Rewarded: ca-app-pub-3940256099942544/5224354917
```

### In-App Purchases
- [ ] IAP products load correctly
- [ ] Purchase flow works:
  1. User taps buy button
  2. System purchase dialog appears
  3. User confirms/cancels
  4. Coins added if successful
- [ ] Receipt validation works
- [ ] Restore purchases works
- [ ] Error handling (network failure, etc.)
- [ ] Sandbox testing (iOS TestFlight, Android internal testing)

**Test accounts needed:**
- iOS: Sandbox tester account in App Store Connect
- Android: License testing account in Google Play Console

## Localization Testing

### Hindi Support
- [ ] All text displays correctly in Devanagari script
- [ ] Fonts render properly
- [ ] No text overflow issues
- [ ] Numbers formatted correctly (lakhs/crores)
- [ ] Currency symbol: ₹ displays
- [ ] Right-to-left text handled (if applicable)

### English Support
- [ ] All text clear and grammatically correct
- [ ] Numbers formatted with commas
- [ ] No truncation issues

### Language Switching
- [ ] Toggle switches language immediately
- [ ] All screens update correctly
- [ ] Preference persists after restart
- [ ] No missing translations

## Pre-Release Checklist

### Functionality
- [ ] All core features work
- [ ] No game-breaking bugs
- [ ] Collision detection accurate
- [ ] Scoring system correct
- [ ] Save/load system works
- [ ] All screens accessible

### Content
- [ ] All assets present and loading
- [ ] No placeholder text in production
- [ ] Images optimized
- [ ] Sounds at appropriate volume
- [ ] No missing translations

### Performance
- [ ] 60 FPS on target devices
- [ ] Memory usage acceptable
- [ ] Battery drain normal
- [ ] Load times fast
- [ ] No crashes or ANRs

### Monetization
- [ ] Ads working with real IDs
- [ ] IAPs functional in production
- [ ] Ad frequency appropriate
- [ ] Purchase receipts validated

### Compliance
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Age rating appropriate
- [ ] Content warnings if needed
- [ ] Data collection disclosed

### Polish
- [ ] Onboarding/tutorial clear
- [ ] UI intuitive and responsive
- [ ] Visual effects impressive
- [ ] Audio quality good
- [ ] Overall feel polished

## Bug Reporting Template

When reporting bugs:

```markdown
**Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Device:**
- Device: iPhone 13 Pro
- OS: iOS 16.4
- App Version: 1.0.0

**Screenshots/Video:**
Attach if available

**Frequency:**
Always / Sometimes / Rarely

**Severity:**
Critical / High / Medium / Low
```

## Testing Schedule

### Pre-Alpha (Internal)
- Daily: Core gameplay testing
- Weekly: Full feature test pass

### Alpha (Closed Testing)
- 10-20 testers
- Focus: Core mechanics, major bugs
- Duration: 2-4 weeks

### Beta (Open Testing)
- 100-1000 testers
- Focus: Polish, edge cases, devices
- Duration: 2-4 weeks
- Platforms: TestFlight (iOS), Google Play Internal Testing (Android)

### Release Candidate
- Full regression testing
- All platforms and devices
- Production ad/IAP testing
- Final checklist review

## Metrics to Track

- Crash-free rate: > 99.5%
- Average session length: Target 5-10 minutes
- Retention (Day 1): > 40%
- Retention (Day 7): > 20%
- Average FPS: > 55
- Load time: < 3s
- Ad fill rate: > 90%
- IAP conversion: Track baseline

---

**Remember:** Testing is ongoing. Continue monitoring crash reports, user feedback, and analytics after launch!
