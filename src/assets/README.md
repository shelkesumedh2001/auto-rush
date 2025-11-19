# Assets Directory

This directory contains all game assets (images, sounds, fonts).

## Directory Structure

### images/
- **icons/** - App icon and splash screen
  - `app_icon.png` (1024x1024) - Main app icon
  - `splash.png` (2048x2048) - Splash screen

- **auto/** - Auto rickshaw sprites (256x256 each)
- **obstacles/** - Obstacle sprites (cars, buses, cows, etc.)
- **collectibles/** - Coins, passengers, power-ups
- **environment/** - Road, buildings, backgrounds

### sounds/
- **sfx/** - Sound effects (MP3 format)
  - Coin collection sounds
  - Crash sounds
  - Power-up sounds
  - Horn sounds

- **music/** - Background music (MP3 format)
  - Menu theme
  - Gameplay theme

### fonts/
- Hindi/English fonts (TTF format)
- Baloo2-Bold.ttf (download from Google Fonts)
- NotoSansDevanagari.ttf (for Hindi text)

## Adding Custom Assets

1. Replace placeholder images with actual game art
2. Ensure images are optimized (use TinyPNG or similar)
3. Keep file sizes small for mobile performance
4. Use PNG with transparency for sprites
5. Use MP3 for audio (compressed)

## Asset Requirements

### Images
- Format: PNG (with transparency) or JPEG
- Resolution: High-DPI (2x or 3x for Retina displays)
- Optimization: Compress before adding

### Sounds
- Format: MP3 (compressed)
- Duration: Keep SFX under 2 seconds
- Size: Keep under 100KB per file

### Fonts
- Format: TTF or OTF
- Include: Regular and Bold weights minimum
