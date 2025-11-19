/**
 * Game Screen with Physics Engine
 * Uses react-native-game-engine + Matter.js for proper physics-based gameplay
 */

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { COLORS } from '../config/colors';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';
import AudioService from '../services/AudioService';
import PauseMenu from '../components/PauseMenu';

import PhysicsEngine from '../game/PhysicsEngine';
import { Player, Road, Obstacle, Coin, Powerup, Passenger, Particle } from '../game/entities';
import {
  Physics,
  Movement,
  ObstacleSpawner,
  CoinSpawner,
  PowerupSpawner,
  PassengerSpawner,
  CollisionSystem,
  NearMissSystem,
  resetSystems,
  getCurrentSpeed,
  getGameTime,
} from '../game/systems';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameScreenPhysics = ({ onGameOver, onPause }) => {
  const { gameState, startGame, updateScore, updateDistance, addCoins: addGameCoins,
          addPassenger, updateCombo, activatePowerup, isPowerupActive } = useGame();
  const { addCoins: addUserCoins, updateHighScore, user } = useUser();

  const engineRef = useRef(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [passengersCollected, setPassengersCollected] = useState(0);
  const [combo, setCombo] = useState(0);
  const [nearMisses, setNearMisses] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);
  const [speedBoostActive, setSpeedBoostActive] = useState(false);
  const [multiplierActive, setMultiplierActive] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const lastPassengerTime = useRef(0);
  const currentCombo = useRef(0);

  // Initialize physics and entities
  const setupGame = () => {
    const physics = new PhysicsEngine();

    // Create ground
    const ground = physics.createGround(SCREEN_HEIGHT - 100);

    // Create player
    const player = physics.createPlayer(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 200);

    return {
      physics,
      player: {
        body: player,
        isJumping: false,
        isSliding: false,
        activeCustomization: user.activeCustomization || {},
        shieldActive: false,
        magnetActive: false,
        renderer: Player,
      },
      road: {
        renderer: Road,
      },
      gameState: {
        score: 0,
        distance: 0,
        shieldActive: false,
        magnetActive: false,
        speedBoostActive: false,
        multiplierActive: false,
      },
    };
  };

  useEffect(() => {
    startGame();
    resetSystems();

    // Hide tutorial after 5 seconds
    const tutorialTimer = setTimeout(() => setShowTutorial(false), 5000);

    // Update score every 100ms
    const scoreInterval = setInterval(() => {
      const currentTime = getGameTime();
      const currentSpeed = getCurrentSpeed();
      const newDistance = currentTime * currentSpeed / 10;
      const newScore = Math.floor(newDistance);

      setDistance(newDistance);
      setScore(newScore);
      updateDistance(newDistance);
      updateScore(newScore);
    }, 100);

    return () => {
      clearTimeout(tutorialTimer);
      clearInterval(scoreInterval);
    };
  }, []);

  // Gesture handler for swipes
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

  const handleJump = () => {
    if (isJumping || isSliding) return;

    setIsJumping(true);
    AudioService.playSFX('jump');

    if (engineRef.current) {
      const entities = engineRef.current.state.entities;
      if (entities.physics) {
        entities.physics.jump();
      }
      if (entities.player) {
        entities.player.isJumping = true;
      }
    }

    // Reset jump after duration
    setTimeout(() => {
      setIsJumping(false);
      if (engineRef.current?.state.entities.player) {
        engineRef.current.state.entities.player.isJumping = false;
      }
    }, 600);
  };

  const handleSlide = () => {
    if (isJumping || isSliding) return;

    setIsSliding(true);
    AudioService.playSFX('slide');

    if (engineRef.current?.state.entities.player) {
      engineRef.current.state.entities.player.isSliding = true;
    }

    setTimeout(() => {
      setIsSliding(false);
      if (engineRef.current?.state.entities.player) {
        engineRef.current.state.entities.player.isSliding = false;
      }
    }, 500);
  };

  const handleMoveLeft = () => {
    if (engineRef.current?.state.entities.physics) {
      const physics = engineRef.current.state.entities.physics;
      const currentPos = physics.getPlayerPosition();
      const newX = Math.max(SCREEN_WIDTH * 0.25, currentPos.x - 100);
      physics.setPlayerPosition(newX, currentPos.y);
    }
  };

  const handleMoveRight = () => {
    if (engineRef.current?.state.entities.physics) {
      const physics = engineRef.current.state.entities.physics;
      const currentPos = physics.getPlayerPosition();
      const newX = Math.min(SCREEN_WIDTH * 0.75, currentPos.x + 100);
      physics.setPlayerPosition(newX, currentPos.y);
    }
  };

  // Handle game events from collision system
  const handleEvent = (e) => {
    if (!gameRunning) return;

    switch (e.type) {
      case 'game-over':
        handleGameOver(e.payload);
        break;

      case 'cow-collision':
        AudioService.playSFX('cow_collision');
        break;

      case 'collect-coin':
        const coinValue = 10 * (e.payload.multiplier || 1);
        setCoinsCollected(prev => prev + coinValue);
        addGameCoins(coinValue);
        AudioService.playSFX('coin');
        break;

      case 'collect-powerup':
        handlePowerupCollected(e.payload.powerupType);
        break;

      case 'collect-passenger':
        handlePassengerCollected();
        break;

      case 'near-miss':
        setNearMisses(prev => prev + 1);
        setScore(prev => prev + e.payload.points);
        AudioService.playSFX('near_miss');
        break;

      case 'shield-hit':
        AudioService.playSFX('shield_hit');
        // Shield absorbed the hit, but don't deactivate it yet
        break;
    }
  };

  const handlePowerupCollected = (type) => {
    AudioService.playSFX('powerup');
    activatePowerup(type);

    switch (type) {
      case 'shield':
        setShieldActive(true);
        if (engineRef.current?.state.entities.player) {
          engineRef.current.state.entities.player.shieldActive = true;
        }
        if (engineRef.current?.state.entities.gameState) {
          engineRef.current.state.entities.gameState.shieldActive = true;
        }
        setTimeout(() => {
          setShieldActive(false);
          if (engineRef.current?.state.entities.player) {
            engineRef.current.state.entities.player.shieldActive = false;
          }
          if (engineRef.current?.state.entities.gameState) {
            engineRef.current.state.entities.gameState.shieldActive = false;
          }
        }, 10000);
        break;

      case 'magnet':
        setMagnetActive(true);
        if (engineRef.current?.state.entities.player) {
          engineRef.current.state.entities.player.magnetActive = true;
        }
        if (engineRef.current?.state.entities.gameState) {
          engineRef.current.state.entities.gameState.magnetActive = true;
        }
        setTimeout(() => {
          setMagnetActive(false);
          if (engineRef.current?.state.entities.player) {
            engineRef.current.state.entities.player.magnetActive = false;
          }
          if (engineRef.current?.state.entities.gameState) {
            engineRef.current.state.entities.gameState.magnetActive = false;
          }
        }, 8000);
        break;

      case 'speedBoost':
        setSpeedBoostActive(true);
        if (engineRef.current?.state.entities.gameState) {
          engineRef.current.state.entities.gameState.speedBoostActive = true;
        }
        setTimeout(() => {
          setSpeedBoostActive(false);
          if (engineRef.current?.state.entities.gameState) {
            engineRef.current.state.entities.gameState.speedBoostActive = false;
          }
        }, 5000);
        break;

      case 'multiplier':
        setMultiplierActive(true);
        if (engineRef.current?.state.entities.gameState) {
          engineRef.current.state.entities.gameState.multiplierActive = true;
        }
        setTimeout(() => {
          setMultiplierActive(false);
          if (engineRef.current?.state.entities.gameState) {
            engineRef.current.state.entities.gameState.multiplierActive = false;
          }
        }, 15000);
        break;
    }
  };

  const handlePassengerCollected = () => {
    const currentTime = Date.now();
    const timeSinceLastPassenger = currentTime - lastPassengerTime.current;

    if (timeSinceLastPassenger < 3000) {
      currentCombo.current += 1;
    } else {
      currentCombo.current = 1;
    }

    lastPassengerTime.current = currentTime;
    setCombo(currentCombo.current);
    setPassengersCollected(prev => prev + 1);

    const comboBonus = currentCombo.current * 25;
    setScore(prev => prev + 50 + comboBonus);
    addPassenger();
    updateCombo(currentCombo.current);
    AudioService.playSFX('passenger');
  };

  const handleGameOver = (payload) => {
    setGameRunning(false);
    AudioService.playSFX('crash');
    AudioService.stopMusic();

    // Save high score
    if (score > (user.highScore || 0)) {
      updateHighScore(score);
    }

    // Save coins
    addUserCoins(coinsCollected);

    // Call parent callback
    setTimeout(() => {
      onGameOver({
        score,
        distance: Math.floor(distance),
        coins: coinsCollected,
        passengers: passengersCollected,
        nearMisses,
        combo: currentCombo.current,
        obstacleHit: payload?.obstacleType || 'unknown',
      });
    }, 1000);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <GameEngine
        ref={engineRef}
        style={styles.gameEngine}
        systems={[
          Physics,
          Movement,
          ObstacleSpawner,
          CoinSpawner,
          PowerupSpawner,
          PassengerSpawner,
          CollisionSystem,
          NearMissSystem,
        ]}
        entities={setupGame()}
        running={gameRunning}
        onEvent={handleEvent}
      />

      {/* HUD Overlay */}
      <View style={styles.hud} pointerEvents="box-none">
        {/* Top stats */}
        <View style={styles.topStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score.toLocaleString()}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{Math.floor(distance)}m</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statValue}>🪙 {coinsCollected}</Text>
          </View>
        </View>

        {/* Active power-ups */}
        {(shieldActive || magnetActive || speedBoostActive || multiplierActive) && (
          <View style={styles.powerupsContainer}>
            {shieldActive && <Text style={styles.powerupIcon}>🛡️</Text>}
            {magnetActive && <Text style={styles.powerupIcon}>🧲</Text>}
            {speedBoostActive && <Text style={styles.powerupIcon}>⚡</Text>}
            {multiplierActive && <Text style={styles.powerupIcon}>✖️2️⃣</Text>}
          </View>
        )}

        {/* Combo display */}
        {combo > 1 && (
          <View style={styles.comboContainer}>
            <Text style={styles.comboText}>COMBO x{combo}!</Text>
            <Text style={styles.comboBonus}>+{combo * 25} bonus</Text>
          </View>
        )}

        {/* Pause button */}
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={() => {
            setShowPauseMenu(true);
            setGameRunning(false);
            AudioService.pauseAll();
          }}
        >
          <Text style={styles.pauseText}>⏸</Text>
        </TouchableOpacity>

        {/* Tutorial overlay */}
        {showTutorial && (
          <View style={styles.tutorial}>
            <Text style={styles.tutorialText}>👆 Swipe UP to Jump</Text>
            <Text style={styles.tutorialText}>👇 Swipe DOWN to Slide</Text>
            <Text style={styles.tutorialText}>👈👉 Swipe to Change Lanes</Text>
          </View>
        )}
      </View>

      {/* Pause Menu */}
      <PauseMenu
        visible={showPauseMenu}
        onResume={() => {
          setShowPauseMenu(false);
          setGameRunning(true);
          AudioService.resumeAll();
        }}
        onRestart={() => {
          setShowPauseMenu(false);
          setGameRunning(false);
          // Reset and restart game
          setTimeout(() => {
            resetSystems();
            setScore(0);
            setDistance(0);
            setCoinsCollected(0);
            setPassengersCollected(0);
            setCombo(0);
            setNearMisses(0);
            setGameRunning(true);
          }, 100);
        }}
        onMainMenu={() => {
          setShowPauseMenu(false);
          setGameRunning(false);
          onPause(); // Call original onPause to go to main menu
        }}
        gameStats={{ score, distance, coins: coinsCollected }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hud: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  statBox: {
    backgroundColor: `${COLORS.SURFACE}CC`,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginTop: 4,
  },
  powerupsContainer: {
    position: 'absolute',
    top: 140,
    right: 16,
    flexDirection: 'column',
    gap: 8,
  },
  powerupIcon: {
    fontSize: 40,
    backgroundColor: `${COLORS.SURFACE}CC`,
    padding: 8,
    borderRadius: 12,
  },
  comboContainer: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 3,
    alignSelf: 'center',
    backgroundColor: `${COLORS.SUCCESS}DD`,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  comboText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_ON_PRIMARY,
  },
  comboBonus: {
    fontSize: 18,
    color: COLORS.TEXT_ON_PRIMARY,
    marginTop: 4,
  },
  pauseButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: `${COLORS.SURFACE}CC`,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseText: {
    fontSize: 24,
  },
  tutorial: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 100,
    alignSelf: 'center',
    backgroundColor: `${COLORS.SURFACE}EE`,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  tutorialText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginVertical: 4,
  },
});

export default GameScreenPhysics;
