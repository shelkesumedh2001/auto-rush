/**
 * Advanced Visual Effects System
 * Camera shake, screen flash, slow-motion, particles, glow effects
 */

import { Animated, Vibration } from 'react-native';

class VisualEffectsManager {
  constructor() {
    // Animation values
    this.cameraShake = new Animated.ValueXY({ x: 0, y: 0 });
    this.screenFlash = new Animated.Value(0);
    this.slowMotion = false;
    this.particles = [];
    this.nextParticleId = 0;
  }

  /**
   * Camera Shake Effect
   * Creates screen shake on collision or impact
   * @param {string} intensity - 'light', 'medium', 'heavy'
   */
  cameraShakeEffect(intensity = 'medium') {
    const intensityMap = {
      light: { magnitude: 5, duration: 200, vibration: 50 },
      medium: { magnitude: 10, duration: 300, vibration: 100 },
      heavy: { magnitude: 20, duration: 500, vibration: [0, 100, 50, 100] },
    };

    const config = intensityMap[intensity] || intensityMap.medium;

    // Vibration feedback
    if (Array.isArray(config.vibration)) {
      Vibration.vibrate(config.vibration);
    } else {
      Vibration.vibrate(config.vibration);
    }

    // Create shake animation sequence
    const shakes = [];
    const steps = 6;

    for (let i = 0; i < steps; i++) {
      const magnitude = config.magnitude * (1 - i / steps); // Decay over time
      shakes.push(
        Animated.timing(this.cameraShake, {
          toValue: {
            x: (Math.random() - 0.5) * magnitude * 2,
            y: (Math.random() - 0.5) * magnitude * 2,
          },
          duration: config.duration / steps,
          useNativeDriver: true,
        })
      );
    }

    // Return to center
    shakes.push(
      Animated.spring(this.cameraShake, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      })
    );

    Animated.sequence(shakes).start();
  }

  /**
   * Screen Flash Effect
   * White flash for major events (game over, achievement, etc.)
   * @param {string} color - Flash color (hex)
   * @param {number} duration - Duration in ms
   */
  screenFlashEffect(color = '#FFFFFF', duration = 300) {
    this.screenFlash.setValue(1);

    Animated.timing(this.screenFlash, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();

    return {
      opacity: this.screenFlash,
      backgroundColor: color,
    };
  }

  /**
   * Slow Motion Effect
   * Slows down game time for dramatic moments
   * @param {number} duration - Duration in ms
   * @param {Function} callback - Called when slow-mo ends
   */
  enableSlowMotion(duration = 1000, callback) {
    this.slowMotion = true;

    setTimeout(() => {
      this.slowMotion = false;
      if (callback) callback();
    }, duration);
  }

  /**
   * Check if slow motion is active
   */
  isSlowMotion() {
    return this.slowMotion;
  }

  /**
   * Create Particle Burst
   * Generates particle effect at position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} config - Particle configuration
   */
  createParticleBurst(x, y, config = {}) {
    const {
      count = 10,
      colors = ['#FFD700', '#FFA500', '#FF6347'],
      sizes = [4, 6, 8],
      velocityRange = { min: -200, max: 200 },
      lifetime = 1000,
      type = 'circle', // 'circle', 'star', 'spark'
    } = config;

    const newParticles = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 50 + Math.random() * 150;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;

      const particle = {
        id: this.nextParticleId++,
        x,
        y,
        velocityX,
        velocityY,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: new Animated.Value(1),
        lifetime,
        createdAt: Date.now(),
        type,
      };

      // Animate opacity fade
      Animated.timing(particle.opacity, {
        toValue: 0,
        duration: lifetime,
        useNativeDriver: true,
      }).start();

      newParticles.push(particle);
    }

    this.particles.push(...newParticles);

    // Clean up old particles
    setTimeout(() => {
      this.particles = this.particles.filter(p => Date.now() - p.createdAt < p.lifetime);
    }, lifetime);

    return newParticles;
  }

  /**
   * Create Coin Sparkle Effect
   */
  createCoinSparkle(x, y) {
    return this.createParticleBurst(x, y, {
      count: 6,
      colors: ['#FFD700', '#FFA500'],
      sizes: [3, 4, 5],
      lifetime: 500,
      type: 'star',
    });
  }

  /**
   * Create Crash Explosion Effect
   */
  createCrashExplosion(x, y) {
    return this.createParticleBurst(x, y, {
      count: 20,
      colors: ['#FF6347', '#FF4500', '#FFD700', '#808080'],
      sizes: [6, 8, 10, 12],
      lifetime: 800,
      type: 'circle',
    });
  }

  /**
   * Create Power-up Collection Effect
   */
  createPowerupEffect(x, y, color) {
    return this.createParticleBurst(x, y, {
      count: 15,
      colors: [color, '#FFFFFF'],
      sizes: [4, 6, 8],
      lifetime: 600,
      type: 'spark',
    });
  }

  /**
   * Create Passenger Pickup Effect
   */
  createPassengerEffect(x, y) {
    return this.createParticleBurst(x, y, {
      count: 8,
      colors: ['#00FF00', '#00CC00', '#FFFF00'],
      sizes: [5, 6, 7],
      lifetime: 500,
      type: 'star',
    });
  }

  /**
   * Create Near-Miss Effect
   */
  createNearMissEffect(x, y) {
    return this.createParticleBurst(x, y, {
      count: 5,
      colors: ['#FFFF00', '#FFA500'],
      sizes: [4, 5],
      lifetime: 400,
      type: 'spark',
    });
  }

  /**
   * Create Trail Effect
   * Continuous particle stream behind moving object
   */
  createTrailParticle(x, y, color = '#FFFFFF', size = 4) {
    const particle = {
      id: this.nextParticleId++,
      x,
      y,
      velocityX: 0,
      velocityY: 50, // Move down (opposite of player movement)
      size,
      color,
      opacity: new Animated.Value(0.6),
      lifetime: 300,
      createdAt: Date.now(),
      type: 'circle',
    };

    Animated.timing(particle.opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    this.particles.push(particle);

    setTimeout(() => {
      this.particles = this.particles.filter(p => p.id !== particle.id);
    }, 300);

    return particle;
  }

  /**
   * Create Glow Effect
   * Returns style for glowing elements
   */
  createGlowEffect(color, intensity = 1) {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8 * intensity,
      shadowRadius: 15 * intensity,
      elevation: 10 * intensity, // Android
    };
  }

  /**
   * Create Motion Blur Effect
   * Returns style for motion blur (using shadow)
   */
  createMotionBlur(direction = 'down', intensity = 1) {
    const offsetMap = {
      up: { width: 0, height: -5 * intensity },
      down: { width: 0, height: 5 * intensity },
      left: { width: -5 * intensity, height: 0 },
      right: { width: 5 * intensity, height: 0 },
    };

    return {
      shadowColor: '#000000',
      shadowOffset: offsetMap[direction],
      shadowOpacity: 0.3 * intensity,
      shadowRadius: 8 * intensity,
    };
  }

  /**
   * Update particle positions
   * Call this in game loop
   */
  updateParticles(deltaTime) {
    const deltaSeconds = deltaTime / 1000;

    this.particles.forEach(particle => {
      // Update position with gravity
      particle.velocityY += 200 * deltaSeconds; // Gravity
      particle.x += particle.velocityX * deltaSeconds;
      particle.y += particle.velocityY * deltaSeconds;
    });

    // Remove dead particles
    const now = Date.now();
    this.particles = this.particles.filter(p => now - p.createdAt < p.lifetime);
  }

  /**
   * Get all active particles
   */
  getParticles() {
    return this.particles;
  }

  /**
   * Clear all particles
   */
  clearParticles() {
    this.particles = [];
  }

  /**
   * Get camera shake transform
   */
  getCameraShakeTransform() {
    return {
      transform: [
        { translateX: this.cameraShake.x },
        { translateY: this.cameraShake.y },
      ],
    };
  }

  /**
   * Reset all effects
   */
  reset() {
    this.cameraShake.setValue({ x: 0, y: 0 });
    this.screenFlash.setValue(0);
    this.slowMotion = false;
    this.particles = [];
    this.nextParticleId = 0;
  }
}

// Export singleton
const visualEffects = new VisualEffectsManager();
export default visualEffects;
