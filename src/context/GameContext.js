/**
 * Game Context
 * Global state for active game session
 */

import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    score: 0,
    distance: 0,
    coins: 0,
    passengers: 0,
    nearMisses: 0,
    combo: 0,
    speed: 8,
    activePowerups: [],
    startTime: null,
    endTime: null,
  });

  const [sessionStats, setSessionStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    totalDistance: 0,
    totalCoins: 0,
  });

  const startGame = () => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      distance: 0,
      coins: 0,
      passengers: 0,
      nearMisses: 0,
      combo: 0,
      speed: 8,
      activePowerups: [],
      startTime: Date.now(),
      endTime: null,
    });
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      endTime: Date.now(),
    }));

    setSessionStats(prev => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + gameState.score,
      totalDistance: prev.totalDistance + gameState.distance,
      totalCoins: prev.totalCoins + gameState.coins,
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  };

  const updateScore = (score) => {
    setGameState(prev => ({ ...prev, score }));
  };

  const updateDistance = (distance) => {
    setGameState(prev => ({ ...prev, distance }));
  };

  const addCoins = (amount) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const addPassenger = () => {
    setGameState(prev => ({ ...prev, passengers: prev.passengers + 1 }));
  };

  const addNearMiss = () => {
    setGameState(prev => ({ ...prev, nearMisses: prev.nearMisses + 1 }));
  };

  const updateCombo = (combo) => {
    setGameState(prev => ({ ...prev, combo }));
  };

  const updateSpeed = (speed) => {
    setGameState(prev => ({ ...prev, speed }));
  };

  const activatePowerup = (powerupType, duration) => {
    const powerup = {
      type: powerupType,
      startTime: Date.now(),
      endTime: Date.now() + duration,
    };

    setGameState(prev => ({
      ...prev,
      activePowerups: [...prev.activePowerups, powerup],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      deactivatePowerup(powerupType);
    }, duration);
  };

  const deactivatePowerup = (powerupType) => {
    setGameState(prev => ({
      ...prev,
      activePowerups: prev.activePowerups.filter(p => p.type !== powerupType),
    }));
  };

  const isPowerupActive = (powerupType) => {
    return gameState.activePowerups.some(p => p.type === powerupType);
  };

  const value = {
    gameState,
    sessionStats,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    updateScore,
    updateDistance,
    addCoins,
    addPassenger,
    addNearMiss,
    updateCombo,
    updateSpeed,
    activatePowerup,
    deactivatePowerup,
    isPowerupActive,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export default GameContext;
