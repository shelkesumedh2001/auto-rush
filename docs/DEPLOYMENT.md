# Auto Rush: Mumbai Traffic Run - Deployment Guide

Complete guide for deploying to App Store and Google Play Store.

## Table of Contents
1. [Pre-Deployment](#pre-deployment)
2. [iOS Deployment](#ios-deployment)
3. [Android Deployment](#android-deployment)
4. [Post-Deployment](#post-deployment)

## Pre-Deployment

### Final Checks
- [ ] All features tested and working
- [ ] No debug code or console.logs in production
- [ ] Assets optimized (images compressed, sounds normalized)
- [ ] Real AdMob IDs configured (not test IDs)
- [ ] IAP products created in both stores
- [ ] Privacy policy and terms of service URLs live
- [ ] App icons and splash screens finalized
- [ ] Version number set correctly in app.json
- [ ] Build number incremented

### Required Assets

#### App Icons
- iOS: 1024x1024px (App Store), various sizes for device
- Android: 512x512px (Play Store), various densities

#### Screenshots
- iOS: 6.5" display (iPhone 14 Pro Max) - at least 3
- Android: Phone and 7" tablet - at least 3 each

#### Feature Graphic (Android)
- 1024x500px banner for Play Store

#### Marketing Materials
- App description (English + Hindi)
- Keywords for ASO (App Store Optimization)
- What's New/Changelog

## iOS Deployment

### Step 1: Apple Developer Account

1. Sign up at https://developer.apple.com/ ($99/year)
2. Verify identity (may take 24-48 hours)
3. Accept agreements

### Step 2: App Store Connect Setup

1. Create new app at https://appstoreconnect.apple.com/
2. Fill in app information:
   - **Name**: Auto Rush: Mumbai Traffic Run
   - **Bundle ID**: com.yourcompany.autorush (must match app.json)
   - **SKU**: Unique identifier
   - **Primary Language**: English
   - **Category**: Games > Racing

3. Add localizations (Hindi)

4. Set age rating:
   - Questionnaire: Answer honestly
   - Likely rating: 4+ or 9+ (check for any concerns)

5. Add screenshots and app preview (optional video)

6. Write app description:
```
Navigate through chaotic Mumbai traffic in this exciting endless runner!
Dodge cars, buses, and sacred cows while collecting passengers and coins.

Features:
• Authentic Mumbai traffic experience
• 7 unique obstacles including moving dogs and potholes
• 4 powerful power-ups
• Hindi and English support
• Daily missions and achievements
• Compete on global leaderboards
• Customize your auto-rickshaw

Can you survive the rush?
```

7. Add keywords (100 characters max):
```
mumbai,traffic,auto,rickshaw,endless,runner,india,racing,casual,arcade
```

8. Set support URL and marketing URL

9. Add privacy policy URL (required)

### Step 3: Create Certificates and Provisioning Profiles

```bash
# Using EAS (easiest method)
eas build:configure

# Follow prompts to generate iOS credentials
```

Or manually in Apple Developer Portal:
1. Certificates → Create App Store Distribution Certificate
2. Identifiers → Create App ID (Bundle ID: com.yourcompany.autorush)
3. Provisioning Profiles → Create App Store profile

### Step 4: Configure In-App Purchases

1. In App Store Connect → Features → In-App Purchases
2. Create products:
   - Small Coin Pack: Consumable, $0.99
   - Medium Coin Pack: Consumable, $2.99
   - Large Coin Pack: Consumable, $4.99
   - Mega Coin Pack: Consumable, $9.99
   - Remove Ads: Non-Consumable, $2.99
   - Premium Auto: Non-Consumable, $4.99
   - Double Coins: Non-Renewing Subscription, $1.99/month
   - VIP Pass: Auto-Renewable Subscription, $4.99/month

3. For each product:
   - Set product ID (must match app code)
   - Add display name and description
   - Set price
   - Upload screenshot (optional)
   - Set availability

### Step 5: Build and Upload

#### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### Manual Build

```bash
# Build locally
npx expo run:ios --configuration Release

# Archive in Xcode
# Xcode → Product → Archive
# Upload to App Store Connect
```

### Step 6: App Store Review

1. In App Store Connect, go to your app version
2. Fill in "What's New in This Version"
3. Add App Review Information:
   - Contact info
   - Demo account (if login required - not needed for this game)
   - Notes for reviewer (explain any unusual features)

4. Select manual or automatic release

5. Submit for review

6. Wait for review (typically 24-48 hours)

### Step 7: Respond to Review

If rejected:
- Read rejection reason carefully
- Fix issues
- Respond to reviewer or submit new build
- Common rejections:
  - Crash on launch
  - Missing privacy policy
  - Misleading screenshots
  - IAP issues
  - Performance problems

## Android Deployment

### Step 1: Google Play Console

1. Create developer account at https://play.google.com/console/signup
2. Pay one-time $25 fee
3. Complete account details

### Step 2: Create Application

1. Create new app in Play Console
2. Fill in app details:
   - **App name**: Auto Rush: Mumbai Traffic Run
   - **Default language**: English (United States)
   - **App/Game**: Game
   - **Free/Paid**: Free

3. Complete Store Settings:
   - Category: Racing
   - Tags: auto-rickshaw, mumbai, traffic, endless runner

### Step 3: Store Listing

1. Add app details:

```
Short description (80 characters):
Navigate Mumbai traffic! Dodge cars, collect passengers in this endless runner.

Full description (4000 characters):
Welcome to the chaotic streets of Mumbai! 🛺

Auto Rush: Mumbai Traffic Run puts you behind the wheel of an auto-rickshaw
navigating through one of the world's busiest cities. Dodge cars, buses,
trucks, and even sacred cows as you pick up passengers and collect coins!

🎮 AUTHENTIC MUMBAI EXPERIENCE
Experience the thrill of Mumbai's famous traffic with culturally authentic
obstacles and Indian-themed visuals.

⚡ EXCITING GAMEPLAY
• 7 unique obstacles: cars, buses, trucks, dogs, potholes, cows, construction
• Jump and slide mechanics
• 4 powerful power-ups: Shield, Magnet, Speed Boost, Score Multiplier
• Progressive difficulty - test your reflexes!

🪙 COLLECT & CUSTOMIZE
• Gather coins to unlock new auto-rickshaw designs
• 20+ customization options
• Equip lights, paint jobs, and accessories

🎯 MISSIONS & ACHIEVEMENTS
• Complete daily missions for rewards
• Unlock 24 achievements
• Climb the global leaderboard

🌐 BILINGUAL SUPPORT
• Full Hindi (हिंदी) and English support
• Authentic Indian number formatting

Whether you're dodging a jaywalking dog or narrowly avoiding a pothole,
every run is a new adventure!

Download now and see how far you can go! 🏁
```

2. Add graphics:
   - App icon: 512x512px
   - Feature graphic: 1024x500px
   - Screenshots: At least 2 (phone), recommended 4-8
   - 7-inch tablet screenshots (optional but recommended)
   - Promo video (optional)

3. Categorization:
   - App category: Racing
   - Tags: Choose relevant tags

4. Contact details:
   - Email
   - Website (if you have one)
   - Phone (optional)

5. Privacy Policy: URL to your privacy policy (required)

### Step 4: Content Rating

1. Start questionnaire
2. Answer questions honestly:
   - No violence (cute obstacles)
   - No bad language
   - No scary content
   - Has ads (if using AdMob)
   - Has in-app purchases
3. Likely rating: PEGI 3, ESRB Everyone

### Step 5: App Content

1. Privacy Policy: Provide URL
2. Ads: Yes (using AdMob)
3. In-app purchases: Yes
4. Target audience: 13+ recommended
5. News app: No
6. COVID-19 contact tracing/status: No
7. Data safety:
   - Collect data: Yes (analytics)
   - Share data: No
   - Encryption: Data encrypted in transit
   - Request data deletion: Not applicable

### Step 6: Configure In-App Products

1. Monetization → In-app products → Create product
2. Create all IAP products:
   - Product ID must match code
   - Title and description in English + Hindi
   - Set price in all countries
   - Activate product

### Step 7: Build APK/AAB

#### Using EAS Build

```bash
# Build Android App Bundle (recommended)
eas build --platform android --profile production

# Or build APK
eas build --platform android --profile production:apk
```

#### Manual Build

```bash
# Build AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Step 8: Upload Build

1. Play Console → Release → Production
2. Create new release
3. Upload AAB file (or APK if testing)
4. Add release notes:

```
What's new in version 1.0:
• Initial release
• 7 unique Mumbai traffic obstacles
• 4 power-ups to help you survive
• Daily missions and achievements
• Customize your auto-rickshaw
• Hindi and English support
```

5. Review and roll out

### Step 9: Testing (Optional but Recommended)

Before production release:

1. **Internal Testing**:
   - Upload build to Internal testing track
   - Add test users (up to 100)
   - Test for 1-2 weeks

2. **Closed Testing**:
   - Invite specific testers (up to 2000)
   - Gather feedback
   - Fix bugs

3. **Open Testing**:
   - Public beta (unlimited users)
   - Final testing before release

### Step 10: Submit for Review

1. Complete all sections (green checkmarks)
2. Review app content
3. Submit for review
4. Wait for approval (typically faster than iOS, often within hours)

## Post-Deployment

### Monitoring

#### Crash Reporting
- **iOS**: Xcode Crashes & Organizer
- **Android**: Google Play Console → Quality → Android vitals
- **Both**: Firebase Crashlytics (if integrated)

Target: > 99.5% crash-free rate

#### Analytics
- Monitor in Firebase Analytics:
  - Daily Active Users (DAU)
  - Session length
  - Retention rates
  - In-app events

#### Reviews
- Respond to user reviews promptly
- Address common complaints in updates
- Thank positive reviewers

### Updates

#### Version Updates
```bash
# Update version in app.json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

#### Release Process
1. Fix bugs / add features
2. Test thoroughly
3. Update version numbers
4. Build new version
5. Upload to stores
6. Submit for review
7. Release when approved

### Marketing

#### App Store Optimization (ASO)
- Monitor keyword rankings
- A/B test screenshots and descriptions
- Encourage reviews (prompt in-app, but not too frequently)

#### Promotion
- Social media (Instagram, Twitter, Facebook)
- Reddit (r/AndroidGaming, r/iOSGaming)
- Gaming communities
- Press releases to mobile gaming sites
- Influencer outreach (YouTube, TikTok)

### Monetization Optimization

1. Monitor ad revenue (AdMob dashboard)
2. Track IAP conversion rates
3. A/B test IAP prices
4. Optimize ad frequency (balance revenue vs. user experience)
5. Analyze user flow to find best ad placements

### Metrics to Track

- **Downloads**: Track growth rate
- **Revenue**: Daily ad revenue + IAP revenue
- **Retention**:
  - Day 1: Target > 40%
  - Day 7: Target > 20%
  - Day 30: Target > 10%
- **Session length**: Target 5-10 minutes
- **Sessions per day**: Target 3-5
- **Ad impressions per user**
- **IAP conversion rate**: Target 2-5%

## Troubleshooting

### iOS Review Rejection
- **Crash on launch**: Test on multiple devices/iOS versions
- **Performance**: Optimize frame rate and memory
- **Metadata**: Ensure screenshots match actual gameplay
- **IAP**: Test purchases thoroughly

### Android Review Rejection
- **Policy violation**: Review Play Store policies carefully
- **Copycat**: Ensure original assets and gameplay
- **Malware**: Scan build, use official React Native/Expo builds

### Low Downloads
- Improve ASO (keywords, screenshots, description)
- Get featured (contact store editorial teams)
- Run ad campaigns (Google Ads, Apple Search Ads)
- Build community (Discord, social media)

## Checklists

### iOS Pre-Launch
- [ ] All App Store Connect info complete
- [ ] IAPs created and tested
- [ ] Screenshots uploaded (6.5" display)
- [ ] App icon 1024x1024px uploaded
- [ ] Privacy policy URL live
- [ ] Build uploaded and processed
- [ ] Age rating set
- [ ] Pricing and availability configured
- [ ] App review information complete
- [ ] Submitted for review

### Android Pre-Launch
- [ ] All Play Console info complete
- [ ] IAPs created and activated
- [ ] Screenshots uploaded (phone + tablet)
- [ ] Feature graphic uploaded
- [ ] App icon 512x512px uploaded
- [ ] Privacy policy URL in store listing
- [ ] Content rating questionnaire complete
- [ ] Data safety form complete
- [ ] AAB uploaded
- [ ] Release notes written
- [ ] Submitted for review

---

**Good luck with your launch!** 🚀

Remember: Launch is just the beginning. Continue improving based on user feedback and metrics.
