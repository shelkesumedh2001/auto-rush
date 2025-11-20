/**
 * 3D Game Screen - OPTIMIZED
 * Subway Surfers style with working mechanics
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../config/colors';
import { GAME_3D } from '../config/constants3D';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

const Game3DScreen = ({ onGameOver, onPause }) => {
  const { startGame, updateScore, updateDistance, addCoins } = useGame();
  const { user, addCoins: addUserCoins, updateHighScore } = useUser();

  // Game state
  const [currentLane, setCurrentLane] = useState(1); // 0=left, 1=center, 2=right
  const [isJumping, setIsJumping] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [speed, setSpeed] = useState(GAME_3D.INITIAL_SPEED);

  // Power-ups
  const [shieldActive, setShieldActive] = useState(false);

  // Game objects (simplified for performance)
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);

  // Stats
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);

  // Refs
  const gameTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const nextIdRef = useRef(0);
  const animationFrameRef = useRef();
  const playerYRef = useRef(0); // For jump animation

  // Initialize
  useEffect(() => {
    startGame();
    startGameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Game loop - OPTIMIZED
  const startGameLoop = () => {
    let lastTime = Date.now();

    const loop = () => {
      if (!gameRunning) return;

      const currentTime = Date.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap delta
      lastTime = currentTime;

      gameTimeRef.current += delta;

      // Update speed
      const newSpeed = Math.min(
        GAME_3D.INITIAL_SPEED + gameTimeRef.current * 0.5,
        GAME_3D.MAX_SPEED
      );
      setSpeed(newSpeed);

      // Update distance and score
      const distanceGain = newSpeed * delta * 10;
      setDistance(prev => {
        const newDist = prev + distanceGain;
        setScore(Math.floor(newDist));
        updateDistance(newDist);
        updateScore(Math.floor(newDist));
        return newDist;
      });

      // Spawn obstacles
      if (gameTimeRef.current - lastSpawnTimeRef.current >= 1.5) {
        spawnObstacle();
        spawnCoins();
        lastSpawnTimeRef.current = gameTimeRef.current;
      }

      // Update positions
      setObstacles(prev =>
        prev
          .map(obs => ({ ...obs, y: obs.y + newSpeed * delta * 60 }))
          .filter(obs => obs.y < 600)
      );

      setCoins(prev =>
        prev
          .map(coin => ({ ...coin, y: coin.y + newSpeed * delta * 60 }))
          .filter(coin => coin.y < 600)
      );

      // Update jump animation
      if (isJumping) {
        playerYRef.current = Math.sin((Date.now() % 600) / 600 * Math.PI) * -80;
      } else {
        playerYRef.current = 0;
      }

      // Check collisions
      checkCollisions();

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  const spawnObstacle = () => {
    const types = ['car', 'bus', 'barrier', 'cow'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const lanes = [0, 1, 2];

    // Don't spawn in player's current lane always
    const availableLanes = Math.random() < 0.3
      ? lanes
      : lanes.filter(l => l !== currentLane);

    const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

    setObstacles(prev => [
      ...prev,
      {
        id: `obs_${nextIdRef.current++}`,
        type: randomType,
        lane: randomLane,
        y: -100,
        height: randomType === 'barrier' ? 40 : 60,
      },
    ]);
  };

  const spawnCoins = () => {
    if (Math.random() < 0.7) {
      const randomLane = Math.floor(Math.random() * 3);
      setCoins(prev => [
        ...prev,
        {
          id: `coin_${nextIdRef.current++}`,
          lane: randomLane,
          y: -100,
        },
      ]);
    }
  };

  const checkCollisions = () => {
    const playerY = 250; // Player position

    // Check obstacle collisions
    obstacles.forEach(obs => {
      if (obs.lane === currentLane) {
        const distY = Math.abs(obs.y - playerY);

        if (distY < 50) {
          // Can jump over barriers
          if (obs.type === 'barrier' && isJumping) {
            return; // Jumped over!
          }

          if (!shieldActive) {
            handleCrash();
          } else {
            // Shield absorbed hit
            setShieldActive(false);
            setObstacles(prev => prev.filter(o => o.id !== obs.id));
          }
        }
      }
    });

    // Check coin collections
    coins.forEach(coin => {
      if (coin.lane === currentLane) {
        const distY = Math.abs(coin.y - playerY);

        if (distY < 40) {
          setCoinsCollected(prev => prev + 1);
          addCoins(10);
          setCoins(prev => prev.filter(c => c.id !== coin.id));
        }
      }
    });
  };

  const handleCrash = () => {
    setGameRunning(false);

    if (score > (user.highScore || 0)) {
      updateHighScore(score);
    }

    addUserCoins(coinsCollected);

    setTimeout(() => {
      onGameOver({
        score,
        distance: Math.floor(distance),
        coins: coinsCollected,
      });
    }, 500);
  };

  // Controls
  const handleMoveLeft = () => {
    if (currentLane > 0) setCurrentLane(prev => prev - 1);
  };

  const handleMoveRight = () => {
    if (currentLane < 2) setCurrentLane(prev => prev + 1);
  };

  const handleJump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
  };

  // Lane X positions
  const laneX = [60, 165, 270];

  return (
    <View style={styles.container}>
      {/* Canvas - 2.5D rendering */}
      <View style={styles.gameArea}>
        {/* Road */}
        <View style={styles.road}>
          {/* Lane dividers */}
          <View style={[styles.laneDivider, { left: 123 }]} />
          <View style={[styles.laneDivider, { left: 217 }]} />
        </View>

        {/* Obstacles */}
        {obstacles.map(obs => (
          <View
            key={obs.id}
            style={[
              styles.obstacle,
              styles[obs.type],
              {
                left: laneX[obs.lane],
                top: obs.y,
              },
            ]}
          >
            <Text style={styles.obstacleIcon}>
              {obs.type === 'car' && '🚗'}
              {obs.type === 'bus' && '🚌'}
              {obs.type === 'barrier' && '🚧'}
              {obs.type === 'cow' && '🐄'}
            </Text>
          </View>
        ))}

        {/* Coins */}
        {coins.map(coin => (
          <View
            key={coin.id}
            style={[styles.coin, { left: laneX[coin.lane] + 25, top: coin.y }]}
          >
            <Text style={styles.coinIcon}>🪙</Text>
          </View>
        ))}

        {/* Player Auto-rickshaw */}
        <View
          style={[
            styles.player,
            {
              left: laneX[currentLane],
              bottom: 100 - playerYRef.current,
              transform: [{ scale: isJumping ? 0.9 : 1 }],
            },
          ]}
        >
          {shieldActive && <View style={styles.shield} />}
          <Text style={styles.playerIcon}>🛺</Text>
        </View>

        {/* Mumbai scenery */}
        <View style={styles.scenery}>
          <Text style={styles.buildingLeft}>🏢</Text>
          <Text style={styles.buildingRight}>🏬</Text>
        </View>
      </View>

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudTop}>
          <Text style={styles.hudText}>Score: {score}</Text>
          <Text style={styles.hudText}>Coins: 🪙 {coinsCollected}</Text>
        </View>

        {shieldActive && (
          <View style={styles.powerupIndicator}>
            <Text style={styles.powerupIcon}>🛡️</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.leftControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleMoveLeft}
            disabled={currentLane === 0}
          >
            <Text style={styles.controlIcon}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleMoveRight}
            disabled={currentLane === 2}
          >
            <Text style={styles.controlIcon}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.jumpButton} onPress={handleJump}>
          <Text style={styles.controlIcon}>⬆️</Text>
        </TouchableOpacity>
      </View>

      {/* Tutorial hint */}
      <View style={styles.tutorial}>
        <Text style={styles.tutorialText}>← → to dodge • ⬆️ to jump</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    left: 30,
    right: 30,
    top: 0,
    bottom: 0,
    backgroundColor: '#2a2a2a',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderColor: '#FFD700',
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFF',
    opacity: 0.5,
  },
  scenery: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  buildingLeft: {
    position: 'absolute',
    left: -20,
    fontSize: 40,
    opacity: 0.6,
  },
  buildingRight: {
    position: 'absolute',
    right: -20,
    fontSize: 40,
    opacity: 0.6,
  },
  player: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerIcon: {
    fontSize: 50,
  },
  shield: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(65, 105, 225, 0.3)',
    borderWidth: 3,
    borderColor: '#4169E1',
  },
  obstacle: {
    position: 'absolute',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacleIcon: {
    fontSize: 50,
  },
  car: {},
  bus: {},
  barrier: {},
  cow: {},
  coin: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 25,
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  powerupIndicator: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  powerupIcon: {
    fontSize: 40,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  leftControls: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  jumpButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  controlIcon: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  tutorial: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  tutorialText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default Game3DScreen;
