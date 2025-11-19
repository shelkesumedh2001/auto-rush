/**
 * Asset Manager
 * Centralized loading and management of all game assets (images, sounds, fonts)
 */

import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

// Asset paths
// NOTE: SVG images are placeholders. Sound and font files need to be downloaded.
// See SOUND_REQUIREMENTS.md and FONT_REQUIREMENTS.md for specifications.
const ASSETS = {
  images: {
    vehicles: {
      autoYellow: require('../assets/images/vehicles/auto-yellow.svg'),
    },
    obstacles: {
      car: require('../assets/images/obstacles/car.svg'),
      bus: require('../assets/images/obstacles/bus.svg'),
      truck: require('../assets/images/obstacles/truck.svg'),
      cow: require('../assets/images/obstacles/cow.svg'),
      dog: require('../assets/images/obstacles/dog.svg'),
      pothole: require('../assets/images/obstacles/pothole.svg'),
      construction: require('../assets/images/obstacles/construction.svg'),
    },
    powerups: {
      shield: require('../assets/images/powerups/shield.svg'),
      magnet: require('../assets/images/powerups/magnet.svg'),
      speedboost: require('../assets/images/powerups/speedboost.svg'),
      multiplier: require('../assets/images/powerups/multiplier.svg'),
    },
    ui: {
      coin: require('../assets/images/ui/coin.svg'),
      passenger: require('../assets/images/ui/passenger.svg'),
    },
  },
  sounds: {
    // Commented out until real MP3 files are created
    // See /src/assets/sounds/SOUND_REQUIREMENTS.md
    /*
    music: {
      menuTheme: require('../assets/sounds/music/menu-theme.mp3'),
      gameTheme: require('../assets/sounds/music/game-theme.mp3'),
    },
    sfx: {
      coin: require('../assets/sounds/sfx/coin.mp3'),
      crash: require('../assets/sounds/sfx/crash.mp3'),
      powerup: require('../assets/sounds/sfx/powerup.mp3'),
      passenger: require('../assets/sounds/sfx/passenger.mp3'),
      jump: require('../assets/sounds/sfx/jump.mp3'),
      slide: require('../assets/sounds/sfx/slide.mp3'),
      honk: require('../assets/sounds/sfx/honk.mp3'),
      nearMiss: require('../assets/sounds/sfx/near-miss.mp3'),
      cowCollision: require('../assets/sounds/sfx/cow-collision.mp3'),
      shieldHit: require('../assets/sounds/sfx/shield-hit.mp3'),
    },
    */
  },
  fonts: {
    // Commented out until real TTF files are downloaded from Google Fonts
    // See /src/assets/fonts/FONT_REQUIREMENTS.md
    /*
    'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
    'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
    'NotoSansDevanagari-Regular': require('../assets/fonts/NotoSansDevanagari-Regular.ttf'),
    'NotoSansDevanagari-Bold': require('../assets/fonts/NotoSansDevanagari-Bold.ttf'),
    */
  },
};

class AssetManager {
  constructor() {
    this.loaded = false;
    this.loadingProgress = 0;
  }

  /**
   * Preload all assets
   * @returns {Promise<void>}
   */
  async loadAssets(onProgress) {
    if (this.loaded) {
      console.log('Assets already loaded');
      return;
    }

    try {
      console.log('Loading assets...');

      // Calculate total assets to load
      const imageAssets = this.getAllImagePaths();
      const soundAssets = this.getAllSoundPaths();
      const fontAssets = ASSETS.fonts;

      const totalAssets = imageAssets.length + soundAssets.length + Object.keys(fontAssets).length;
      let loadedCount = 0;

      const updateProgress = () => {
        loadedCount++;
        this.loadingProgress = (loadedCount / totalAssets) * 100;
        if (onProgress) {
          onProgress(this.loadingProgress);
        }
      };

      // Load images
      const imagePromises = imageAssets.map(async (asset) => {
        try {
          await Asset.fromModule(asset).downloadAsync();
          updateProgress();
        } catch (error) {
          console.warn('Failed to load image asset:', error);
          updateProgress();
        }
      });

      // Load sounds
      const soundPromises = soundAssets.map(async (asset) => {
        try {
          await Asset.fromModule(asset).downloadAsync();
          updateProgress();
        } catch (error) {
          console.warn('Failed to load sound asset:', error);
          updateProgress();
        }
      });

      // Load fonts
      const fontPromise = Font.loadAsync(fontAssets).then(() => {
        Object.keys(fontAssets).forEach(() => updateProgress());
      }).catch((error) => {
        console.warn('Failed to load fonts:', error);
        Object.keys(fontAssets).forEach(() => updateProgress());
      });

      // Wait for all assets to load
      await Promise.all([...imagePromises, ...soundPromises, fontPromise]);

      this.loaded = true;
      console.log('All assets loaded successfully!');
    } catch (error) {
      console.error('Error loading assets:', error);
      this.loaded = true; // Continue anyway
    }
  }

  /**
   * Get all image asset paths
   * @returns {Array}
   */
  getAllImagePaths() {
    const paths = [];

    const extractPaths = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          extractPaths(value);
        } else if (typeof value === 'number') {
          paths.push(value);
        }
      });
    };

    extractPaths(ASSETS.images);
    return paths;
  }

  /**
   * Get all sound asset paths
   * @returns {Array}
   */
  getAllSoundPaths() {
    const paths = [];

    const extractPaths = (obj) => {
      Object.values(obj).forEach(value => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          extractPaths(value);
        } else if (typeof value === 'number') {
          paths.push(value);
        }
      });
    };

    extractPaths(ASSETS.sounds);
    return paths;
  }

  /**
   * Get specific asset
   */
  getImage(category, name) {
    return ASSETS.images[category]?.[name];
  }

  getSound(category, name) {
    return ASSETS.sounds[category]?.[name];
  }

  /**
   * Check if assets are loaded
   */
  isLoaded() {
    return this.loaded;
  }

  /**
   * Get loading progress (0-100)
   */
  getProgress() {
    return this.loadingProgress;
  }
}

// Export singleton instance
const assetManager = new AssetManager();
export default assetManager;

// Export asset references for direct use
export { ASSETS };
