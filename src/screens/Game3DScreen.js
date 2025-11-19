/**
 * 3D Game Screen - Subway Surfers Style
 * Main 3D endless runner game
 */

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { View, StyleSheet, Text, Dimensions, PanResponder } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { COLORS } from '../config/colors';
import { GAME_3D, PATTERNS_3D } from '../config/constants3D';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

// 3D Components
import AutoRickshaw3D from '../game3D/components/AutoRickshaw3D';
import Road3D from '../game3D/components/Road3D';
import Obstacle3D from '../game3D/components/Obstacle3D';
import Collectible3D from '../game3D/components/Collectible3D';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Game Scene Component (runs inside Canvas)
const GameScene = ({
  currentLane,
  isJumping,
  isSliding,
  shieldActive,
  magnetActive,
  speed,
  obstacles,
  collectibles,
  onObstaclePass,
  onCollectibleCollect,
  onCollision,
}) => {
  const playerRef = useRef();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={[0x87CEEB, 0x8B4513, 0.4]} />

      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, GAME_3D.CAMERA.POSITION_Y, GAME_3D.CAMERA.POSITION_Z]}
        fov={GAME_3D.CAMERA.FOV}
        rotation={[GAME_3D.CAMERA.TILT_ANGLE * Math.PI / 180, 0, 0]}
      />

      {/* Player Auto-Rickshaw */}
      <AutoRickshaw3D
        ref={playerRef}
        targetLane={GAME_3D.LANE_POSITIONS[currentLane]}
        isJumping={isJumping}
        isSliding={isSliding}
        shieldActive={shieldActive}
        magnetActive={magnetActive}
      />

      {/* Road */}
      <Road3D speed={speed} />

      {/* Obstacles */}
      {obstacles.map((obstacle) => (
        <Obstacle3D
          key={obstacle.id}
          type={obstacle.type}
          position={[
            GAME_3D.LANE_POSITIONS[obstacle.lane],
            0,
            obstacle.z
          ]}
          onCollision={() => onCollision(obstacle.id)}
        />
      ))}

      {/* Collectibles */}
      {collectibles.map((item) => (
        <Collectible3D
          key={item.id}
          type={item.type}
          position={[
            GAME_3D.LANE_POSITIONS[item.lane],
            1,
            item.z
          ]}
          onCollect={() => onCollectibleCollect(item.id)}
        />
      ))}

      {/* Fog */}
      <fog attach="fog" args={[GAME_3D.ENVIRONMENT.FOG_COLOR, GAME_3D.ENVIRONMENT.FOG_NEAR, GAME_3D.ENVIRONMENT.FOG_FAR]} />
    </>
  );
};

const Game3DScreen = ({ onGameOver, onPause }) => {
  const { startGame, updateScore, updateDistance, addCoins } = useGame();
  const { user, addCoins: addUserCoins, updateHighScore } = useUser();

  // Game state
  const [currentLane, setCurrentLane] = useState(1); // 0=left, 1=center, 2=right
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [speed, setSpeed] = useState(GAME_3D.INITIAL_SPEED);

  // Power-ups
  const [shieldActive, setShieldActive] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);

  // Game objects
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);

  // Stats
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);

  // Refs for game loop
  const gameTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const nextObstacleIdRef = useRef(0);
  const animationFrameRef = useRef();

  // Gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        // Swipe up = Jump
        if (dy < -50 && Math.abs(dy) > Math.abs(dx)) {
          handleJump();
        }
        // Swipe down = Slide
        else if (dy > 50 && Math.abs(dy) > Math.abs(dx)) {
          handleSlide();
        }
        // Swipe left = Move left
        else if (dx < -50 && Math.abs(dx) > Math.abs(dy)) {
          handleMoveLeft();
        }
        // Swipe right = Move right
        else if (dx > 50 && Math.abs(dx) > Math.abs(dy)) {
          handleMoveRight();
        }
      },
    })
  ).current;

  // Initialize game
  useEffect(() => {
    startGame();
    startGameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Game loop
  const startGameLoop = () => {
    let lastTime = Date.now();

    const loop = () => {
      if (!gameRunning) return;

      const currentTime = Date.now();
      const delta = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update game time
      gameTimeRef.current += delta;

      // Update speed (progressive difficulty)
      if (gameTimeRef.current % GAME_3D.SPEED_INCREMENT_INTERVAL < delta) {
        if (speed < GAME_3D.MAX_SPEED) {
          setSpeed(prev => Math.min(prev + GAME_3D.SPEED_INCREMENT, GAME_3D.MAX_SPEED));
        }
      }

      // Update distance and score
      const newDistance = distance + speed * delta;
      const newScore = Math.floor(newDistance * GAME_3D.DISTANCE_TO_SCORE);
      setDistance(newDistance);
      setScore(newScore);
      updateDistance(newDistance);
      updateScore(newScore);

      // Spawn obstacles
      spawnObstacles(delta);

      // Update obstacle positions
      updateObstacles(delta);

      // Update collectibles
      updateCollectibles(delta);

      // Check collisions
      checkCollisions();

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  // Spawn obstacles
  const spawnObstacles = (delta) => {
    const currentInterval = Math.max(
      GAME_3D.SPAWN.MIN_INTERVAL,
      GAME_3D.SPAWN.INITIAL_INTERVAL - (gameTimeRef.current * 0.01)
    );

    if (gameTimeRef.current - lastSpawnTimeRef.current >= currentInterval) {
      lastSpawnTimeRef.current = gameTimeRef.current;

      // Spawn pattern or single obstacle
      if (Math.random() < 0.6) {
        spawnPattern();
      } else {
        spawnSingleObstacle();
      }

      // Maybe spawn collectibles
      if (Math.random() < GAME_3D.COINS.SPAWN_RATE) {
        spawnCollectible('COIN');
      }

      if (Math.random() < GAME_3D.PASSENGERS.SPAWN_RATE) {
        spawnCollectible('PASSENGER');
      }

      if (Math.random() < GAME_3D.POWERUPS.SPAWN_RATE) {
        const powerupTypes = ['SHIELD', 'MAGNET', 'BOOST', 'MULTIPLIER'];
        const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
        spawnCollectible(randomType);
      }
    }
  };

  const spawnPattern = () => {
    // Select pattern based on difficulty
    const patternKeys = Object.keys(PATTERNS_3D);
    const randomPattern = PATTERNS_3D[patternKeys[Math.floor(Math.random() * patternKeys.length)]];

    randomPattern.forEach(({ lane, type, offset }) => {
      const newObstacle = {
        id: `obstacle_${nextObstacleIdRef.current++}`,
        type,
        lane,
        z: -GAME_3D.SPAWN.SPAWN_DISTANCE - offset,
      };

      setObstacles(prev => [...prev, newObstacle]);
    });
  };

  const spawnSingleObstacle = () => {
    const types = ['CAR', 'BUS', 'TRUCK', 'BARRIER'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomLane = Math.floor(Math.random() * 3);

    const newObstacle = {
      id: `obstacle_${nextObstacleIdRef.current++}`,
      type: randomType,
      lane: randomLane,
      z: -GAME_3D.SPAWN.SPAWN_DISTANCE,
    };

    setObstacles(prev => [...prev, newObstacle]);
  };

  const spawnCollectible = (type) => {
    const randomLane = Math.floor(Math.random() * 3);

    const newCollectible = {
      id: `collectible_${nextObstacleIdRef.current++}`,
      type,
      lane: randomLane,
      z: -GAME_3D.SPAWN.SPAWN_DISTANCE,
    };

    setCollectibles(prev => [...prev, newCollectible]);
  };

  // Update positions
  const updateObstacles = (delta) => {
    setObstacles(prev =>
      prev
        .map(obs => ({
          ...obs,
          z: obs.z + speed * delta,
        }))
        .filter(obs => obs.z < GAME_3D.SPAWN.DESPAWN_DISTANCE * -1) // Remove off-screen
    );
  };

  const updateCollectibles = (delta) => {
    setCollectibles(prev =>
      prev
        .map(item => ({
          ...item,
          z: item.z + speed * delta,
        }))
        .filter(item => item.z < GAME_3D.SPAWN.DESPAWN_DISTANCE * -1)
    );
  };

  // Collision detection
  const checkCollisions = () => {
    const playerZ = GAME_3D.AUTO.POSITION_Z;
    const collisionRange = 1.5;

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      const isInLane = obstacle.lane === currentLane;
      const isInRange = Math.abs(obstacle.z - playerZ) < collisionRange;

      if (isInLane && isInRange && !shieldActive && !isJumping) {
        handleCollision(obstacle.id);
      }
    });

    // Check collectible collection
    collectibles.forEach(item => {
      const isInLane = item.lane === currentLane;
      const isInRange = Math.abs(item.z - playerZ) < collisionRange;

      if (isInLane && isInRange) {
        handleCollectibleCollect(item.id, item.type);
      }
    });
  };

  // Movement handlers
  const handleMoveLeft = () => {
    if (currentLane > 0) {
      setCurrentLane(prev => prev - 1);
    }
  };

  const handleMoveRight = () => {
    if (currentLane < 2) {
      setCurrentLane(prev => prev + 1);
    }
  };

  const handleJump = () => {
    if (!isJumping && !isSliding) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), GAME_3D.AUTO.JUMP_DURATION * 1000);
    }
  };

  const handleSlide = () => {
    if (!isJumping && !isSliding) {
      setIsSliding(true);
      setTimeout(() => setIsSliding(false), GAME_3D.AUTO.SLIDE_DURATION * 1000);
    }
  };

  // Collision handler
  const handleCollision = (obstacleId) => {
    if (shieldActive) {
      // Shield absorbed hit
      setShieldActive(false);
      // Remove obstacle
      setObstacles(prev => prev.filter(obs => obs.id !== obstacleId));
    } else {
      // Game over
      setGameRunning(false);
      handleGameOver();
    }
  };

  // Collectible handler
  const handleCollectibleCollect = (id, type) => {
    // Remove collectible
    setCollectibles(prev => prev.filter(item => item.id !== id));

    // Handle different types
    if (type === 'COIN') {
      const coinValue = magnetActive ? GAME_3D.COINS.MAGNET_VALUE : GAME_3D.COINS.VALUE;
      setCoins(prev => prev + coinValue);
      addCoins(coinValue * GAME_3D.SCORE.COIN);
    } else if (type === 'PASSENGER') {
      setScore(prev => prev + GAME_3D.SCORE.PASSENGER);
    } else if (type === 'SHIELD') {
      setShieldActive(true);
      setTimeout(() => setShieldActive(false), GAME_3D.POWERUPS.SHIELD_DURATION * 1000);
    } else if (type === 'MAGNET') {
      setMagnetActive(true);
      setTimeout(() => setMagnetActive(false), GAME_3D.POWERUPS.MAGNET_DURATION * 1000);
    }
    // Add more power-up handlers...
  };

  // Game over
  const handleGameOver = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (score > (user.highScore || 0)) {
      updateHighScore(score);
    }

    addUserCoins(coins);

    setTimeout(() => {
      onGameOver({
        score,
        distance: Math.floor(distance),
        coins,
      });
    }, 1000);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 3D Canvas */}
      <Canvas style={styles.canvas}>
        <Suspense fallback={null}>
          <GameScene
            currentLane={currentLane}
            isJumping={isJumping}
            isSliding={isSliding}
            shieldActive={shieldActive}
            magnetActive={magnetActive}
            speed={speed}
            obstacles={obstacles}
            collectibles={collectibles}
            onCollision={handleCollision}
            onCollectibleCollect={handleCollectibleCollect}
          />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <View style={styles.hud} pointerEvents="none">
        <View style={styles.stats}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Distance: {Math.floor(distance)}m</Text>
          <Text style={styles.statText}>Coins: 🪙 {coins}</Text>
        </View>

        {/* Power-up indicators */}
        {(shieldActive || magnetActive) && (
          <View style={styles.powerups}>
            {shieldActive && <Text style={styles.powerupIcon}>🛡️</Text>}
            {magnetActive && <Text style={styles.powerupIcon}>🧲</Text>}
          </View>
        )}
      </View>

      {/* Tutorial */}
      <View style={styles.tutorial} pointerEvents="none">
        <Text style={styles.tutorialText}>Swipe to Move • Jump • Slide</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvas: {
    flex: 1,
  },
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  powerups: {
    position: 'absolute',
    right: 20,
    top: 100,
    gap: 10,
  },
  powerupIcon: {
    fontSize: 40,
  },
  tutorial: {
    position: 'absolute',
    bottom: 100,
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
