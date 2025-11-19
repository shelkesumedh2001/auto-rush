# Auto Rush: Mumbai Traffic Run - Setup Guide

Complete setup instructions for development and production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Asset Setup](#asset-setup)
4. [Configuration](#configuration)
5. [Running the App](#running-the-app)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or **yarn**: v1.22.0+)
- **Expo CLI**: Latest version
- **Git**: For version control

### Platform-Specific Requirements

#### iOS Development
- **macOS**: Required for iOS development
- **Xcode**: 14.0 or higher
- **CocoaPods**: Latest version
- **iOS Simulator**: iOS 13.0+ recommended

#### Android Development
- **Android Studio**: Latest version
- **Android SDK**: API Level 30 (Android 11) or higher
- **Java Development Kit (JDK)**: JDK 11 or higher
- **Android Emulator** or physical device with USB debugging enabled

### Accounts Needed (for production)
- **Expo Account**: For EAS Build and deployment
- **Google Play Console**: For Android distribution
- **Apple Developer Account**: For iOS distribution ($99/year)
- **AdMob Account**: For monetization
- **Firebase Account**: For analytics and services

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auto-rush
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all required packages including:
- React Native and Expo SDK 50+
- react-native-game-engine
- matter-js
- expo-ads-admob
- expo-in-app-purchases
- And all other dependencies

### 3. Verify Installation

```bash
npm run verify
# or check manually:
expo doctor
```

## Asset Setup

The game requires additional assets that are not included in the repository.

### 1. Image Assets

SVG placeholders are included. For production, replace with PNG assets:

```bash
# See: /src/assets/images/
# Each obstacle, vehicle, and powerup needs proper artwork
```

**Recommended dimensions:**
- Auto-rickshaw: 60x80px
- Cars: 70x70px
- Buses/Trucks: 90x120px
- Powerups: 40x40px
- Coins: 30x30px

### 2. Sound Assets

Download or create sound effects:

```bash
# See: /src/assets/sounds/SOUND_REQUIREMENTS.md
```

Required files:
- `menu-theme.mp3` (background music)
- `game-theme.mp3` (background music)
- All SFX files (coin, crash, powerup, etc.)

Place files in `/src/assets/sounds/{music,sfx}/`

### 3. Font Assets

Download fonts from Google Fonts:

1. **Baloo 2**: https://fonts.google.com/specimen/Baloo+2
   - Download Regular (400) and Bold (700)

2. **Noto Sans Devanagari**: https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari
   - Download Regular (400) and Bold (700)

3. Place `.ttf` files in `/src/assets/fonts/`

4. Uncomment font imports in `/src/services/AssetManager.js`

## Configuration

### 1. Environment Variables

Create `.env` file in project root:

```env
# AdMob IDs (use test IDs for development)
ADMOB_APP_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
ADMOB_APP_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY

ADMOB_BANNER_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_BANNER_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY

ADMOB_INTERSTITIAL_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY

ADMOB_REWARDED_ID_IOS=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
ADMOB_REWARDED_ID_ANDROID=ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY

# Firebase
FIREBASE_API_KEY=your-api-key
FIREBASE_PROJECT_ID=your-project-id

# In-App Purchase Product IDs
IAP_COIN_PACK_SMALL=com.autorush.coins.small
IAP_COIN_PACK_MEDIUM=com.autorush.coins.medium
IAP_COIN_PACK_LARGE=com.autorush.coins.large
```

### 2. Firebase Setup

1. Create Firebase project at https://console.firebase.google.com/
2. Add iOS and Android apps to project
3. Download config files:
   - `google-services.json` (Android) → `/android/app/`
   - `GoogleService-Info.plist` (iOS) → `/ios/`
4. Enable Analytics, Crashlytics, Cloud Firestore

### 3. AdMob Setup

1. Create AdMob account at https://admob.google.com/
2. Create ad units for:
   - Banner ads (main menu)
   - Interstitial ads (after game over)
   - Rewarded ads (for extra lives/coins)
3. Update IDs in `.env` file
4. **Important**: Use test ad IDs during development!

### 4. In-App Purchase Setup

#### iOS
1. Create IAP products in App Store Connect
2. Configure product IDs matching `/src/config/iap.js`
3. Set up pricing tiers

#### Android
1. Create IAP products in Google Play Console
2. Configure product IDs matching `/src/config/iap.js`
3. Set up pricing

### 5. Google Play Games Services (Optional)

For leaderboards and achievements:

1. Create game in Google Play Console
2. Set up achievements and leaderboards
3. Download `play-games-services.json`
4. Configure in app

## Running the App

### Development Mode

#### Using Expo Go (Easiest)

```bash
# Start development server
npx expo start

# Scan QR code with Expo Go app on your device
```

#### Using iOS Simulator

```bash
npx expo start --ios
```

#### Using Android Emulator

```bash
npx expo start --android
```

#### Using Web (Limited functionality)

```bash
npx expo start --web
```

### Production Build

#### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. Build for Android:
```bash
eas build --platform android
```

#### Local Builds

##### iOS
```bash
npx expo run:ios --configuration Release
```

##### Android
```bash
npx expo run:android --variant release
```

## Troubleshooting

### Common Issues

#### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

#### Metro bundler issues
```bash
# Reset Metro bundler
npx expo start --clear
watchman watch-del-all  # If using watchman
```

#### iOS build fails
```bash
# Update CocoaPods
cd ios
pod install
cd ..
```

#### Android build fails
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

#### Assets not loading
- Check that all asset files exist in correct directories
- Verify file extensions match imports
- Check AssetManager.js for correct paths
- Uncomment font/sound imports once files are added

#### AdMob not showing ads
- Ensure you're using correct ad unit IDs
- Test IDs work immediately, production IDs take hours to activate
- Check AdMob account is properly set up
- Verify app ID in app.json matches AdMob

#### Physics not working
- Ensure react-native-game-engine is installed
- Check matter-js is installed
- Verify GameScreenPhysics is being used, not old GameScreen

### Performance Issues

#### Game runs slow
- Test on physical device, not just simulator
- Reduce particle count in VisualEffects.js
- Optimize sprite sizes
- Enable Hermes JS engine (enabled by default in Expo SDK 50+)

#### High memory usage
- Implement proper cleanup in game systems
- Check for memory leaks in particle system
- Optimize image assets (compress PNGs)

### Getting Help

- **Documentation**: Read all docs in `/docs/` folder
- **Expo Docs**: https://docs.expo.dev/
- **React Native Game Engine**: https://github.com/bberak/react-native-game-engine
- **Matter.js**: https://brm.io/matter-js/
- **GitHub Issues**: Check project issues for known problems

## Next Steps

After setup:
1. Read [TESTING.md](./TESTING.md) for testing instructions
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) to understand code structure
3. Check [CUSTOMIZATION.md](./CUSTOMIZATION.md) to customize the game
4. See [DEPLOYMENT.md](./DEPLOYMENT.md) before releasing
5. Review [MONETIZATION.md](./MONETIZATION.md) for revenue optimization

## Checklist

- [ ] Node.js and npm installed
- [ ] Expo CLI installed
- [ ] Dependencies installed (`npm install`)
- [ ] Image assets added or acknowledged as placeholders
- [ ] Sound assets added or acknowledged as placeholders
- [ ] Fonts downloaded and added
- [ ] `.env` file created with all keys
- [ ] Firebase project created and configured
- [ ] AdMob account created (or using test IDs)
- [ ] App runs successfully in development
- [ ] No console errors or warnings
- [ ] Assets load correctly
- [ ] Physics engine working
- [ ] All screens accessible

**Ready to develop!** 🚀
