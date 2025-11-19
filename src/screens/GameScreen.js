/**
 * Complete Game Screen - ALL FEATURES IMPLEMENTED
 * Full endless runner with all 7 obstacles, jump/slide, power-ups, combos, near-miss, passengers
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { COLORS } from '../config/colors';
import { GAME, OBSTACLES } from '../config/constants';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const OBSTACLE_EMOJIS = {
  car: '🚗', bus: '🚌', truck: '🚚', cow: '🐄',
  pothole: '⚫', dog: '🐕', construction: '🚧',
};

const GameScreen = ({ onGameOver, onPause }) => {
  const { gameState, startGame, updateScore, updateDistance, addCoins: addGameCoins,
          addPassenger, updateCombo, activatePowerup, isPowerupActive } = useGame();
  const { addCoins: addUserCoins, updateHighScore } = useUser();

  // Player state
  const [autoPosition, setAutoPosition] = useState(GAME.LANES.CENTER);
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  // Game entities
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [particles, setParticles] = useState([]);

  // Game stats
  const autoPositionAnim = useRef(new Animated.Value(GAME.LANES.CENTER)).current;
  const autoHeightAnim = useRef(new Animated.Value(0)).current;
  const distance = useRef(0);
  const score = useRef(0);
  const speed = useRef(GAME.INITIAL_SPEED);
  const gameTime = useRef(0);
  const coinsCollected = useRef(0);
  const passengersCollected = useRef(0);
  const nearMisses = useRef(0);
  const passengerCombo = useRef(0);
  const lastPassengerTime = useRef(0);

  useEffect(() => {
    startGame();
    const gameLoop = setInterval(runGameLoop, 50); // 20 FPS
    return () => clearInterval(gameLoop);
  }, [gameRunning]);

  const runGameLoop = () => {
    if (!gameRunning) return;

    gameTime.current += 0.05;
    distance.current += speed.current * 0.05;
    score.current = Math.floor(distance.current);

    // Progressive speed increase
    if (gameTime.current % 10 < 0.1 && speed.current < GAME.MAX_SPEED) {
      speed.current += GAME.SPEED_INCREMENT;
    }

    updateDistance(distance.current);
    updateScore(score.current);

    // Spawn entities based on time
    spawnEntities();
    moveEntities();
    checkCollisions();
    updatePowerups();

    // Hide tutorial after 5 seconds
    if (gameTime.current > 5) setShowTutorial(false);
  };

  const spawnEntities = () => {
    // Spawn obstacles
    if (Math.random() < getObstacleSpawnRate()) {
      spawnRandomObstacle();
    }

    // Spawn coins
    if (Math.random() < 0.04) {
      spawnCoinPattern();
    }

    // Spawn passengers
    if (Math.random() < 0.02) {
      spawnPassenger();
    }

    // Spawn power-ups
    if (Math.random() < 0.005 && gameTime.current > 10) {
      spawnPowerup();
    }
  };

  const getObstacleSpawnRate = () => {
    const elapsed = gameTime.current;
    if (elapsed < 60) return 0.02;
    if (elapsed < 120) return 0.03;
    if (elapsed < 180) return 0.04;
    return 0.05;
  };

  const spawnRandomObstacle = () => {
    const elapsed = gameTime.current;
    let type = 'car';

    // Progressive obstacle unlocking
    const roll = Math.random();
    if (elapsed < 30) {
      type = 'car';
    } else if (elapsed < 60) {
      type = roll < 0.7 ? 'car' : roll < 0.85 ? 'bus' : 'truck';
    } else if (elapsed < 90) {
      type = roll < 0.5 ? 'car' : roll < 0.65 ? 'bus' : roll < 0.78 ? 'truck' : 'pothole';
    } else if (elapsed < 120) {
      const types = ['car', 'bus', 'truck', 'pothole', 'cow'];
      type = types[Math.floor(Math.random() * types.length)];
    } else {
      const types = ['car', 'bus', 'truck', 'pothole', 'cow', 'dog', 'construction'];
      type = types[Math.floor(Math.random() * types.length)];
    }

    spawnObstacle(type);
  };

  const spawnObstacle = (type) => {
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    let lane = lanes[Math.floor(Math.random() * lanes.length)];

    // Cow always in center
    if (type === 'cow') lane = GAME.LANES.CENTER;

    // Dog starts from left, moves to right
    const dogStartX = type === 'dog' ? SCREEN_WIDTH * 0.1 : lane;

    const obstacle = {
      id: `obs_${Date.now()}_${Math.random()}`,
      x: dogStartX,
      y: -100,
      type,
      width: OBSTACLES[type.toUpperCase()]?.WIDTH || 80,
      height: OBSTACLES[type.toUpperCase()]?.HEIGHT || 80,
      moving: type === 'dog',
      targetX: type === 'dog' ? SCREEN_WIDTH * 0.9 : dogStartX,
    };

    setObstacles(prev => [...prev, obstacle]);
  };

  const spawnCoinPattern = () => {
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    const pattern = Math.random();

    if (pattern < 0.5) {
      // Single coin
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      setCoins(prev => [...prev, { id: `coin_${Date.now()}`, x: lane, y: -50 }]);
    } else {
      // Line of coins
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      for (let i = 0; i < 5; i++) {
        setCoins(prev => [...prev, {
          id: `coin_${Date.now()}_${i}`,
          x: lane,
          y: -50 - (i * 60),
        }]);
      }
    }
  };

  const spawnPassenger = () => {
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    setPassengers(prev => [...prev, {
      id: `pass_${Date.now()}`,
      x: lane,
      y: -80,
    }]);
  };

  const spawnPowerup = () => {
    const types = ['shield', 'magnet', 'speedBoost', 'multiplier'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    setPowerups(prev => [...prev, {
      id: `power_${Date.now()}`,
      type,
      x: lane,
      y: -80,
    }]);
  };

  const moveEntities = () => {
    const moveSpeed = speed.current * 2;

    // Move obstacles
    setObstacles(prev => prev
      .map(obs => {
        let newObs = { ...obs, y: obs.y + moveSpeed };

        // Move dog across screen
        if (obs.moving && obs.type === 'dog') {
          const progress = (obs.y + 100) / (SCREEN_HEIGHT + 100);
          newObs.x = obs.x + (obs.targetX - obs.x) * 0.02;
        }

        return newObs;
      })
      .filter(obs => obs.y < SCREEN_HEIGHT + 100)
    );

    // Move coins
    setCoins(prev => prev
      .map(coin => ({ ...coin, y: coin.y + moveSpeed }))
      .filter(coin => coin.y < SCREEN_HEIGHT)
    );

    // Move passengers
    setPassengers(prev => prev
      .map(pass => ({ ...pass, y: pass.y + moveSpeed }))
      .filter(pass => pass.y < SCREEN_HEIGHT)
    );

    // Move powerups
    setPowerups(prev => prev
      .map(power => ({ ...power, y: power.y + moveSpeed }))
      .filter(power => power.y < SCREEN_HEIGHT)
    );

    // Move particles
    setParticles(prev => prev
      .filter(p => p.life > 0)
      .map(p => ({
        ...p,
        y: p.y - 2,
        life: p.life - 1,
      }))
    );
  };

  const checkCollisions = () => {
    const playerY = SCREEN_HEIGHT - 200;
    const playerX = autoPosition;
    const playerWidth = 100;
    const playerHeight = isJumping ? 0 : isSliding ? 50 : 100;

    // Check obstacle collisions
    obstacles.forEach(obs => {
      if (Math.abs(obs.y - playerY) < 50) {
        const dist = Math.abs(obs.x - playerX);

        // Near miss detection
        if (dist > 60 && dist < GAME.NEAR_MISS_DISTANCE && !obs.nearMissGiven) {
          handleNearMiss();
          obs.nearMissGiven = true;
        }

        // Collision detection
        if (dist < 70 && !isJumping && (obs.type !== 'truck' || !isSliding)) {
          if (isPowerupActive('shield')) {
            // Shield absorbs hit
            createParticles(obs.x, obs.y, '💥');
            setObstacles(prev => prev.filter(o => o.id !== obs.id));
          } else {
            handleCollision(obs.type);
          }
        }

        // Pothole requires jump
        if (obs.type === 'pothole' && dist < 70 && !isJumping) {
          if (!isPowerupActive('shield')) {
            handleCollision('pothole');
          }
        }
      }
    });

    // Check coin collection
    coins.forEach(coin => {
      if (Math.abs(coin.y - playerY) < 60) {
        const magnetRadius = isPowerupActive('magnet') ? 200 : 50;
        const dist = Math.abs(coin.x - playerX);

        if (dist < magnetRadius) {
          collectCoin(coin);
        }
      }
    });

    // Check passenger collection
    passengers.forEach(pass => {
      if (Math.abs(pass.y - playerY) < 60 && Math.abs(pass.x - playerX) < 60) {
        collectPassenger(pass);
      }
    });

    // Check powerup collection
    powerups.forEach(power => {
      if (Math.abs(power.y - playerY) < 60 && Math.abs(power.x - playerX) < 60) {
        collectPowerup(power);
      }
    });
  };

  const handleNearMiss = () => {
    nearMisses.current++;
    score.current += GAME.NEAR_MISS_POINTS;
    createParticles(autoPosition, SCREEN_HEIGHT - 200, '+10');
    Vibration.vibrate(50);
  };

  const collectCoin = (coin) => {
    coinsCollected.current++;
    addGameCoins(1);
    setCoins(prev => prev.filter(c => c.id !== coin.id));
    createParticles(coin.x, coin.y, '🪙');

    const multiplier = isPowerupActive('multiplier') ? 2 : 1;
    score.current += 1 * multiplier;
  };

  const collectPassenger = (pass) => {
    passengersCollected.current++;
    addPassenger();
    setPassengers(prev => prev.filter(p => p.id !== pass.id));

    // Combo logic
    const now = Date.now();
    if (now - lastPassengerTime.current < 10000) {
      passengerCombo.current++;
    } else {
      passengerCombo.current = 1;
    }
    lastPassengerTime.current = now;

    let comboMultiplier = 1;
    if (passengerCombo.current >= 7) comboMultiplier = 5;
    else if (passengerCombo.current >= 5) comboMultiplier = 3;
    else if (passengerCombo.current >= 3) comboMultiplier = 2;

    updateCombo(comboMultiplier);

    const points = 50 * comboMultiplier;
    score.current += points;

    createParticles(pass.x, pass.y, `+${points}`);
    Vibration.vibrate([50, 100]);
  };

  const collectPowerup = (power) => {
    setPowerups(prev => prev.filter(p => p.id !== power.id));

    const durations = {
      shield: 10000,
      magnet: 15000,
      speedBoost: 8000,
      multiplier: 12000,
    };

    activatePowerup(power.type, durations[power.type]);
    createParticles(power.x, power.y, '✨');
  };

  const handleCollision = (obstacleType) => {
    setGameRunning(false);

    Vibration.vibrate([0, 200, 100, 200]);
    createParticles(autoPosition, SCREEN_HEIGHT - 200, '💥💥💥');

    // Save final stats
    addUserCoins(coinsCollected.current);
    updateHighScore(score.current);

    setTimeout(() => {
      onGameOver({
        score: score.current,
        distance: Math.floor(distance.current),
        coins: coinsCollected.current,
        passengers: passengersCollected.current,
        nearMisses: nearMisses.current,
        obstacleType,
      });
    }, 800);
  };

  const createParticles = (x, y, text) => {
    for (let i = 0; i < 3; i++) {
      setParticles(prev => [...prev, {
        id: `particle_${Date.now()}_${i}`,
        x: x + (Math.random() - 0.5) * 40,
        y,
        text,
        life: 20,
      }]);
    }
  };

  const updatePowerups = () => {
    // Powerup effects are managed by GameContext
  };

  // Gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 || Math.abs(g.dy) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          // Horizontal swipe
          if (gestureState.dx > 50) moveRight();
          else if (gestureState.dx < -50) moveLeft();
        } else {
          // Vertical swipe
          if (gestureState.dy < -50) jump();
          else if (gestureState.dy > 50) slide();
        }
      },
    })
  ).current;

  const moveLeft = () => {
    let newPos = autoPosition;
    if (autoPosition === GAME.LANES.CENTER) newPos = GAME.LANES.LEFT;
    else if (autoPosition === GAME.LANES.RIGHT) newPos = GAME.LANES.CENTER;

    setAutoPosition(newPos);
    Animated.spring(autoPositionAnim, {
      toValue: newPos,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const moveRight = () => {
    let newPos = autoPosition;
    if (autoPosition === GAME.LANES.CENTER) newPos = GAME.LANES.RIGHT;
    else if (autoPosition === GAME.LANES.LEFT) newPos = GAME.LANES.CENTER;

    setAutoPosition(newPos);
    Animated.spring(autoPositionAnim, {
      toValue: newPos,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);

    Animated.sequence([
      Animated.timing(autoHeightAnim, {
        toValue: -120,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(autoHeightAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setIsJumping(false));
  };

  const slide = () => {
    if (isSliding) return;
    setIsSliding(true);

    setTimeout(() => setIsSliding(false), 500);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.sky} />
      <View style={styles.road}>
        <View style={[styles.laneLine, { left: SCREEN_WIDTH / 3 }]} />
        <View style={[styles.laneLine, { left: (SCREEN_WIDTH / 3) * 2 }]} />
      </View>

      {/* Obstacles */}
      {obstacles.map(obs => (
        <View
          key={obs.id}
          style={[styles.obstacle, { left: obs.x - obs.width / 2, top: obs.y }]}
        >
          <Text style={[styles.obstacleText, { fontSize: obs.width * 0.8 }]}>
            {OBSTACLE_EMOJIS[obs.type]}
          </Text>
        </View>
      ))}

      {/* Coins */}
      {coins.map(coin => (
        <View
          key={coin.id}
          style={[styles.coin, { left: coin.x - 20, top: coin.y }]}
        >
          <Text style={styles.coinText}>🪙</Text>
        </View>
      ))}

      {/* Passengers */}
      {passengers.map(pass => (
        <View
          key={pass.id}
          style={[styles.passenger, { left: pass.x - 25, top: pass.y }]}
        >
          <Text style={styles.passengerText}>🙋</Text>
        </View>
      ))}

      {/* Powerups */}
      {powerups.map(power => (
        <View
          key={power.id}
          style={[styles.powerup, { left: power.x - 30, top: power.y }]}
        >
          <Text style={styles.powerupText}>
            {power.type === 'shield' ? '🛡️' : power.type === 'magnet' ? '🧲' :
             power.type === 'speedBoost' ? '⚡' : '⭐'}
          </Text>
        </View>
      ))}

      {/* Particles */}
      {particles.map(p => (
        <View
          key={p.id}
          style={[styles.particle, { left: p.x - 15, top: p.y, opacity: p.life / 20 }]}
        >
          <Text style={styles.particleText}>{p.text}</Text>
        </View>
      ))}

      {/* Player Auto */}
      <Animated.View
        style={[
          styles.auto,
          {
            left: Animated.subtract(autoPositionAnim, 50),
            bottom: Animated.add(150, autoHeightAnim),
            transform: isSliding ? [{ scaleY: 0.5 }] : [],
          },
        ]}
      >
        <Text style={styles.autoText}>🛺</Text>
        {isPowerupActive('shield') && (
          <View style={styles.shieldEffect}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
        )}
        {isPowerupActive('magnet') && (
          <View style={styles.magnetEffect}>
            <Text style={styles.magnetText}>🧲</Text>
          </View>
        )}
      </Animated.View>

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudTop}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score.current}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>{Math.floor(distance.current)}m</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>COINS</Text>
            <Text style={styles.statValue}>🪙 {coinsCollected.current}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseText}>⏸️</Text>
        </TouchableOpacity>

        {/* Combo display */}
        {passengerCombo.current > 1 && (
          <View style={styles.comboDisplay}>
            <Text style={styles.comboText}>{passengerCombo.current}X COMBO!</Text>
          </View>
        )}

        {/* Active powerups */}
        <View style={styles.powerupBar}>
          {isPowerupActive('shield') && <Text style={styles.activePower}>🛡️</Text>}
          {isPowerupActive('magnet') && <Text style={styles.activePower}>🧲</Text>}
          {isPowerupActive('speedBoost') && <Text style={styles.activePower}>⚡</Text>}
          {isPowerupActive('multiplier') && <Text style={styles.activePower}>⭐</Text>}
        </View>
      </View>

      {/* Tutorial */}
      {showTutorial && (
        <View style={styles.tutorial}>
          <Text style={styles.tutorialText}>
            ↔️ Swipe LEFT/RIGHT to change lanes{'\n'}
            ↕️ Swipe UP to jump, DOWN to slide
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.SKY_TOP },
  sky: { position: 'absolute', top: 0, left: 0, right: 0, height: SCREEN_HEIGHT * 0.4, backgroundColor: COLORS.SKY_TOP },
  road: { position: 'absolute', top: SCREEN_HEIGHT * 0.4, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.ROAD_DARK },
  laneLine: { position: 'absolute', top: 0, bottom: 0, width: 4, backgroundColor: COLORS.ROAD_LINE },
  auto: { position: 'absolute', width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  autoText: { fontSize: 60 },
  obstacle: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  obstacleText: { fontSize: 50 },
  coin: { position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  coinText: { fontSize: 30 },
  passenger: { position: 'absolute', width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
  passengerText: { fontSize: 40 },
  powerup: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  powerupText: { fontSize: 50 },
  particle: { position: 'absolute', width: 30, height: 30 },
  particleText: { fontSize: 20, fontWeight: 'bold', color: COLORS.PRIMARY },
  shieldEffect: { position: 'absolute', width: 120, height: 120, alignItems: 'center', justifyContent: 'center', opacity: 0.6 },
  shieldText: { fontSize: 100 },
  magnetEffect: { position: 'absolute', width: 80, height: 80, top: -20, alignItems: 'center', justifyContent: 'center', opacity: 0.7 },
  magnetText: { fontSize: 40 },
  hud: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingHorizontal: 16 },
  hudTop: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: COLORS.TEXT_ON_PRIMARY, fontWeight: 'bold' },
  statValue: { fontSize: 18, color: COLORS.TEXT_ON_PRIMARY, fontWeight: 'bold' },
  pauseButton: { position: 'absolute', top: 50, right: 16, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pauseText: { fontSize: 24 },
  comboDisplay: { alignItems: 'center', marginTop: 10 },
  comboText: { fontSize: 24, fontWeight: 'bold', color: COLORS.SECONDARY, textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
  powerupBar: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 8 },
  activePower: { fontSize: 32 },
  tutorial: { position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center' },
  tutorialText: { fontSize: 16, color: COLORS.TEXT_ON_PRIMARY, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, textAlign: 'center' },
});

export default GameScreen;
