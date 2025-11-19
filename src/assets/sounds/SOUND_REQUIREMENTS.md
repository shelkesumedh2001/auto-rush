# Sound Asset Requirements for Auto Rush

This document details all required sound effects and music for the game.

## Music Tracks (Background/Looping)

### menu-theme.mp3
- **Duration**: 60-90 seconds (looping)
- **Style**: Upbeat, Indian-inspired instrumental
- **Instruments**: Tabla, sitar, modern electronic beats
- **Mood**: Energetic, welcoming, exciting
- **BPM**: 120-140
- **Format**: MP3, 192kbps

### game-theme.mp3
- **Duration**: 120-180 seconds (looping)
- **Style**: Fast-paced, driving rhythm
- **Instruments**: Heavy tabla beats, electronic synth, bass
- **Mood**: Intense, focused, adrenaline-pumping
- **BPM**: 140-160
- **Format**: MP3, 192kbps
- **Notes**: Should build tension and maintain energy

## Sound Effects (SFX)

### coin.mp3
- **Duration**: 0.2-0.3 seconds
- **Description**: Pleasant "ting" or chime sound
- **Style**: Bright, satisfying
- **Pitch**: High (C6-E6)
- **Format**: MP3, 128kbps

### crash.mp3
- **Duration**: 0.5-1.0 seconds
- **Description**: Vehicle collision sound
- **Layers**: Metal crunch, glass breaking, impact thud
- **Style**: Realistic but not too harsh
- **Format**: MP3, 128kbps

### powerup.mp3
- **Duration**: 0.4-0.6 seconds
- **Description**: Magical collection sound
- **Style**: Ascending chime with sparkle effect
- **Pitch**: Starts low, ascends to high
- **Format**: MP3, 128kbps

### passenger.mp3
- **Duration**: 0.3-0.5 seconds
- **Description**: Positive feedback sound for passenger pickup
- **Style**: Cheerful "ding-ding" or bell sound
- **Additional**: Optional brief voice "Thank you!" in Hindi/English
- **Format**: MP3, 128kbps

### jump.mp3
- **Duration**: 0.3-0.5 seconds
- **Description**: Whoosh/swoosh upward sound
- **Style**: Light, airy, energetic
- **Pitch**: Rising
- **Format**: MP3, 128kbps

### slide.mp3
- **Duration**: 0.3-0.5 seconds
- **Description**: Quick slide/swipe sound
- **Style**: Fast whoosh downward
- **Pitch**: Falling
- **Format**: MP3, 128kbps

### honk.mp3
- **Duration**: 0.2-0.4 seconds
- **Description**: Auto-rickshaw horn sound
- **Style**: Authentic Indian auto-rickshaw horn (distinctive "pom-pom")
- **Pitch**: Medium (A4-C5)
- **Format**: MP3, 128kbps
- **Notes**: Should be recognizable as an auto horn, not a car horn

### near-miss.mp3
- **Duration**: 0.3-0.5 seconds
- **Description**: Close call tension sound
- **Style**: Quick tension-building sound with release
- **Layers**: Whoosh + subtle impact/thud
- **Format**: MP3, 128kbps

### cow-collision.mp3
- **Duration**: 0.5-0.8 seconds
- **Description**: Special collision sound for hitting a cow
- **Style**: Softer impact + cow "moo" sound
- **Layers**: Gentle thud, cow vocalization
- **Mood**: Respectful, not comedic
- **Format**: MP3, 128kbps
- **Cultural Note**: Should be respectful given cultural significance of cows in India

### shield-hit.mp3
- **Duration**: 0.3-0.5 seconds
- **Description**: Shield absorbing impact
- **Style**: Electronic/energy barrier deflection sound
- **Layers**: Metallic ping + energy ripple
- **Pitch**: Medium-high
- **Format**: MP3, 128kbps

## Production Notes

### General Requirements
- All sounds should be normalized to -3dB to prevent clipping
- Sounds should be mastered for mobile speakers (boost mid-range slightly)
- Use fade-out (10-20ms) on all SFX to avoid clicking
- Keep file sizes small (preferably under 50KB per SFX)
- Test all sounds at various volume levels

### Cultural Considerations
- Music should incorporate authentic Indian instruments
- Avoid stereotypical or disrespectful representations
- Horn sounds should match real auto-rickshaws in Mumbai
- Cow sound should be respectful and appropriate

### Technical Specifications
- Sample Rate: 44.1kHz
- Bit Depth: 16-bit
- Channels: Stereo for music, Mono for short SFX
- Format: MP3 (for compatibility and size)
- No DRM or copyright restrictions

## Placeholder Files

Until actual audio is created, create silent MP3 placeholders:
```bash
# Generate silent placeholders (requires ffmpeg)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 0.3 -q:a 9 -acodec libmp3lame coin.mp3
```

## Asset Sources

For production, consider:
1. **Custom composition**: Hire audio designer for authentic Indian-themed music
2. **Stock audio**: Epidemic Sound, AudioJungle (with appropriate licenses)
3. **Free resources**: Freesound.org (CC0 licensed, verify usage rights)
4. **Field recording**: Record actual auto-rickshaw sounds in India for authenticity

## Testing Checklist

- [ ] All sounds play correctly on iOS
- [ ] All sounds play correctly on Android
- [ ] Volume levels are balanced across all SFX
- [ ] Music loops seamlessly without gaps or clicks
- [ ] No audio distortion at maximum volume
- [ ] Sounds don't overlap awkwardly
- [ ] Performance: No lag when playing multiple sounds simultaneously
- [ ] Cultural sensitivity review completed
