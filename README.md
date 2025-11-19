# 🛺 Auto Rush: Mumbai Traffic Run

A production-ready endless runner mobile game built with React Native + Expo, featuring Indian auto rickshaw gameplay, Mumbai traffic chaos, Hindi/English localization, and complete monetization (AdMob + IAP).

## 🚀 Quick Start (5 Minutes to Play!)

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org))
- Android phone with "Expo Go" app ([Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))
- WiFi connection (same network for phone and computer)

### Installation Steps

```bash
# 1. Navigate to project directory
cd auto-rush

# 2. Install dependencies (takes 2-3 minutes)
npm install

# 3. Start development server
npx expo start

# 4. Scan QR code with Expo Go app on your Android phone
# Game will load in 10-15 seconds - Play immediately!
```

## 🎮 Game Features

### Core Gameplay
- ✅ Swipe controls (LEFT/RIGHT to change lanes)
- ✅ Endless runner with progressive difficulty
- ✅ Obstacle avoidance (cars, buses, trucks, cows)
- ✅ Collectibles (coins, passengers)
- ✅ Power-ups (shield, magnet, speed boost, multiplier)
- ✅ Combo system for bonus points

### Progression Systems
- ✅ Daily missions (easy, medium, hard)
- ✅ Achievements system
- ✅ Level progression
- ✅ Unlock tiers based on distance

### Customization
- ✅ Auto body paints (10+ options)
- ✅ LED lights (6 options)
- ✅ Horn sounds (5+ options)
- ✅ Accessories (garlands, idols, stickers)
- ✅ Shop with coin economy

### Monetization
- ✅ AdMob integration (5 ad placements)
- ✅ In-App Purchases (Google Play Billing)
- ✅ Coin packs (₹29 to ₹299)
- ✅ Remove Ads (₹149)
- ✅ VIP features

### Localization
- ✅ Full Hindi + English support
- ✅ Indian number formatting
- ✅ Cultural authenticity

## 📁 Project Structure

```
auto-rush/
├── App.js                          # Main entry point
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
├── src/
│   ├── config/                     # Game constants and settings
│   ├── context/                    # React Context providers
│   ├── screens/                    # All game screens
│   ├── components/                 # Reusable UI components
│   ├── services/                   # Core services
│   ├── monetization/               # AdMob & IAP
│   ├── data/                       # Game content
│   └── assets/                     # Images, sounds, fonts
```

## 🎯 How to Play

### Controls
- **Swipe LEFT**: Move to left lane
- **Swipe RIGHT**: Move to right lane

### Objective
- Dodge traffic obstacles
- Collect coins and passengers
- Survive as long as possible
- Beat your high score!

## 🛠️ Development

### Testing on Android Phone

```bash
npm install
npx expo start
# Scan QR code with Expo Go app
```

### Testing AdMob Ads

Update `.env` with your AdMob IDs:
```env
ADMOB_APP_ID=ca-app-pub-YOUR_ID~YOUR_APP_ID
ADMOB_REWARDED_CONTINUE=ca-app-pub-XXXXX/XXXXX
```

### Building for Production

```bash
npm install -g eas-cli
eas build --platform android --profile production
```

## 🐛 Troubleshooting

### "Cannot find module 'expo'"
```bash
npm install
```

### "Ads not loading"
- Ads only work on physical devices
- Check AdMob account is active

### "Game runs slowly"
- Close other apps
- Test on better device

## 💰 Monetization

Free-to-play with:
- Rewarded ads (continue, double coins)
- Interstitial ads (game over)
- IAP coin packs
- Remove ads purchase

## 📊 Analytics

Configure Firebase Analytics in production for:
- User retention tracking
- Revenue metrics
- Ad performance

## 🚀 Deployment to Play Store

1. Build AAB: `eas build --platform android`
2. Create Play Console account
3. Upload build
4. Fill store listing
5. Submit for review

## 📝 Customization

Edit files in `src/config/` to customize:
- Game speeds and difficulty
- Spawn rates
- Color schemes
- Monetization settings

## 📄 License

This is a complete game template. Customize and publish!

---

**Ready to launch?** Follow Quick Start above! 🚀

For detailed documentation, see comments in source files.
