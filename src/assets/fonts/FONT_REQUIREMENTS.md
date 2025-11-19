# Font Requirements for Auto Rush

## Required Fonts

### Baloo 2 (Primary UI Font)
- **Font Family**: Baloo 2
- **Weights Needed**: Regular (400), Bold (700)
- **Usage**: Main UI text, buttons, scores, menus
- **License**: Open Font License (OFL)
- **Download**: https://fonts.google.com/specimen/Baloo+2
- **Files**:
  - `Baloo2-Regular.ttf`
  - `Baloo2-Bold.ttf`

**Why Baloo 2?**
- Rounded, friendly appearance perfect for casual mobile games
- Excellent readability at small sizes
- Supports Latin and Devanagari scripts
- High legibility on mobile screens
- Gives playful, approachable feel

### Noto Sans Devanagari (Hindi Text)
- **Font Family**: Noto Sans Devanagari
- **Weights Needed**: Regular (400), Bold (700)
- **Usage**: Hindi translations, Devanagari script text
- **License**: Open Font License (OFL)
- **Download**: https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari
- **Files**:
  - `NotoSansDevanagari-Regular.ttf`
  - `NotoSansDevanagari-Bold.ttf`

**Why Noto Sans Devanagari?**
- Specifically designed for Devanagari script
- Excellent Unicode coverage
- Consistent weight and height with Baloo 2
- High quality rendering on all screen sizes
- Part of Google's comprehensive Noto font family

## Installation Instructions

### Option 1: Manual Download
1. Visit Google Fonts:
   - Baloo 2: https://fonts.google.com/specimen/Baloo+2
   - Noto Sans Devanagari: https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari

2. Download Regular (400) and Bold (700) weights

3. Place `.ttf` files in `/src/assets/fonts/` directory

### Option 2: Using expo-font
The app uses `expo-font` to load fonts. Configuration is in `AssetManager.js`.

## Font Usage in Code

```javascript
import { useFonts } from 'expo-font';

// In component:
const [fontsLoaded] = useFonts({
  'Baloo2-Bold': require('./src/assets/fonts/Baloo2-Bold.ttf'),
  'Baloo2-Regular': require('./src/assets/fonts/Baloo2-Regular.ttf'),
  'NotoSansDevanagari-Regular': require('./src/assets/fonts/NotoSansDevanagari-Regular.ttf'),
  'NotoSansDevanagari-Bold': require('./src/assets/fonts/NotoSansDevanagari-Bold.ttf'),
});

// In styles:
const styles = StyleSheet.create({
  text: {
    fontFamily: 'Baloo2-Regular',
  },
  boldText: {
    fontFamily: 'Baloo2-Bold',
  },
  hindiText: {
    fontFamily: 'NotoSansDevanagari-Regular',
  },
});
```

## Font Pairing Strategy

- **English UI**: Baloo 2
- **Hindi UI**: Noto Sans Devanagari
- **Numbers/Scores**: Baloo 2 Bold
- **Headings**: Baloo 2 Bold
- **Body Text**: Baloo 2 Regular or Noto Sans Devanagari Regular

## File Size Considerations

- Baloo2-Regular.ttf: ~65KB
- Baloo2-Bold.ttf: ~68KB
- NotoSansDevanagari-Regular.ttf: ~140KB
- NotoSansDevanagari-Bold.ttf: ~145KB

**Total**: ~418KB

These fonts are reasonably sized for mobile apps.

## Fallback Strategy

If custom fonts fail to load:
1. App will use system default fonts
2. English: System default sans-serif
3. Hindi: System default Devanagari support

## Testing Checklist

- [ ] Fonts load correctly on iOS
- [ ] Fonts load correctly on Android
- [ ] Hindi text renders properly
- [ ] No font rendering glitches at various sizes
- [ ] Font weights display correctly (regular vs bold)
- [ ] Performance: No lag during initial load
- [ ] Fonts display correctly in all screens
- [ ] Numbers and special characters render correctly

## License Compliance

Both Baloo 2 and Noto Sans Devanagari are licensed under the SIL Open Font License (OFL), which allows:
- Commercial use
- Modification
- Distribution
- Private use

**Requirement**: Include OFL license text in app distribution.

## Placeholder Note

Until actual font files are downloaded, the app will use system defaults. Download the fonts from Google Fonts and place them in this directory to enable custom typography.
