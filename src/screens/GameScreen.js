/**
 * Game Screen
 * Simplified endless runner gameplay using React Native Animated
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
} from 'react-native';
import { COLORS } from '../config/colors';
import { GAME } from '../config/constants';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameScreen = ({ onGameOver, onPause }) => {
  const { gameState, startGame, endGame, updateScore, updateDistance, addCoins, addPassenger } = useGame();
  const { addCoins: addUserCoins, updateHighScore } = useUser();

  const [autoPosition, setAutoPosition] = useState(GAME.LANES.CENTER);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoinsOnRoad] = useState([]);
  const [gameRunning, setGameRunning] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const autoPositionAnim = useRef(new Animated.Value(GAME.LANES.CENTER)).current;
  const distance = useRef(0);
  const score = useRef(0);
  const coinsCollected = useRef(0);

  useEffect(() => {
    startGame();

    // Game loop
    const gameLoop = setInterval(() => {
      if (gameRunning) {
        // Update distance and score
        distance.current += 1;
        score.current = distance.current;

        updateDistance(distance.current);
        updateScore(score.current);

        // Spawn obstacles
        if (Math.random() < 0.02) {
          spawnObstacle();
        }

        // Spawn coins
        if (Math.random() < 0.03) {
          spawnCoin();
        }

        // Move obstacles and coins
        moveObstacles();
        moveCoins();
      }
    }, 100);

    return () => {
      clearInterval(gameLoop);
    };
  }, [gameRunning]);

  const spawnObstacle = () => {
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

    const obstacle = {
      id: Date.now(),
      x: randomLane,
      y: -100,
      type: 'car',
    };

    setObstacles(prev => [...prev, obstacle]);
  };

  const spawnCoin = () => {
    const lanes = [GAME.LANES.LEFT, GAME.LANES.CENTER, GAME.LANES.RIGHT];
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

    const coin = {
      id: Date.now() + Math.random(),
      x: randomLane,
      y: -100,
    };

    setCoinsOnRoad(prev => [...prev, coin]);
  };

  const moveObstacles = () => {
    setObstacles(prev => {
      return prev
        .map(obstacle => ({
          ...obstacle,
          y: obstacle.y + 10,
        }))
        .filter(obstacle => {
          // Check collision
          if (
            obstacle.y > SCREEN_HEIGHT - 300 &&
            obstacle.y < SCREEN_HEIGHT - 200 &&
            Math.abs(obstacle.x - autoPosition) < 80
          ) {
            handleCrash();
            return false;
          }

          // Remove off-screen obstacles
          return obstacle.y < SCREEN_HEIGHT;
        });
    });
  };

  const moveCoins = () => {
    setCoinsOnRoad(prev => {
      return prev
        .map(coin => ({
          ...coin,
          y: coin.y + 10,
        }))
        .filter(coin => {
          // Check collection
          if (
            coin.y > SCREEN_HEIGHT - 300 &&
            coin.y < SCREEN_HEIGHT - 200 &&
            Math.abs(coin.x - autoPosition) < 60
          ) {
            coinsCollected.current += 1;
            addCoins(1);
            return false;
          }

          // Remove off-screen coins
          return coin.y < SCREEN_HEIGHT;
        });
    });
  };

  const handleCrash = () => {
    setGameRunning(false);
    endGame();

    // Save stats
    addUserCoins(coinsCollected.current);
    updateHighScore(score.current);

    setTimeout(() => {
      onGameOver({
        score: score.current,
        distance: distance.current,
        coins: coinsCollected.current,
      });
    }, 500);
  };

  // Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          // Horizontal swipe
          if (gestureState.dx > 50) {
            // Swipe right
            moveRight();
          } else if (gestureState.dx < -50) {
            // Swipe left
            moveLeft();
          }
        }
      },
    })
  ).current;

  const moveLeft = () => {
    let newPosition = autoPosition;
    if (autoPosition === GAME.LANES.CENTER) {
      newPosition = GAME.LANES.LEFT;
    } else if (autoPosition === GAME.LANES.RIGHT) {
      newPosition = GAME.LANES.CENTER;
    }

    setAutoPosition(newPosition);
    Animated.spring(autoPositionAnim, {
      toValue: newPosition,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const moveRight = () => {
    let newPosition = autoPosition;
    if (autoPosition === GAME.LANES.CENTER) {
      newPosition = GAME.LANES.RIGHT;
    } else if (autoPosition === GAME.LANES.LEFT) {
      newPosition = GAME.LANES.CENTER;
    }

    setAutoPosition(newPosition);
    Animated.spring(autoPositionAnim, {
      toValue: newPosition,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Sky/Background */}
      <View style={styles.sky} />

      {/* Road */}
      <View style={styles.road}>
        {/* Lane markings */}
        <View style={[styles.laneLine, { left: SCREEN_WIDTH / 3 }]} />
        <View style={[styles.laneLine, { left: (SCREEN_WIDTH / 3) * 2 }]} />
      </View>

      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <View
          key={obstacle.id}
          style={[
            styles.obstacle,
            {
              left: obstacle.x - 40,
              top: obstacle.y,
            },
          ]}
        >
          <Text style={styles.obstacleText}>🚗</Text>
        </View>
      ))}

      {/* Coins */}
      {coins.map(coin => (
        <View
          key={coin.id}
          style={[
            styles.coin,
            {
              left: coin.x - 20,
              top: coin.y,
            },
          ]}
        >
          <Text style={styles.coinText}>🪙</Text>
        </View>
      ))}

      {/* Player Auto */}
      <Animated.View
        style={[
          styles.auto,
          {
            left: Animated.subtract(autoPositionAnim, 50),
            bottom: 150,
          },
        ]}
      >
        <Text style={styles.autoText}>🛺</Text>
      </Animated.View>

      {/* HUD */}
      <View style={styles.hud}>
        <View style={styles.hudTop}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{gameState.score}</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>{Math.floor(gameState.distance)}m</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>COINS</Text>
            <Text style={styles.statValue}>🪙 {gameState.coins}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.pauseText}>⏸️</Text>
        </TouchableOpacity>
      </View>

      {/* Tutorial hint */}
      {distance.current < 50 && (
        <View style={styles.tutorial}>
          <Text style={styles.tutorialText}>Swipe LEFT or RIGHT to change lanes</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SKY_TOP,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: COLORS.SKY_TOP,
  },
  road: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.4,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.ROAD_DARK,
  },
  laneLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.ROAD_LINE,
  },
  auto: {
    position: 'absolute',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoText: {
    fontSize: 60,
  },
  obstacle: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  obstacleText: {
    fontSize: 50,
  },
  coin: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 30,
  },
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 18,
    color: COLORS.TEXT_ON_PRIMARY,
    fontWeight: 'bold',
  },
  pauseButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseText: {
    fontSize: 24,
  },
  tutorial: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tutorialText: {
    fontSize: 16,
    color: COLORS.TEXT_ON_PRIMARY,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default GameScreen;
