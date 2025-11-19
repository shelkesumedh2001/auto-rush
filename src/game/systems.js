/**
 * Game Systems for react-native-game-engine
 * Handle game logic, spawning, collisions, scoring
 */

import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import { GAME_CONFIG } from '../config/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Movement speed (pixels per second)
const BASE_SPEED = 200;
let currentSpeed = BASE_SPEED;
let gameTime = 0;
let spawnTimer = 0;
let coinSpawnTimer = 0;
let powerupSpawnTimer = 0;
let passengerSpawnTimer = 0;

// Physics update system
export const Physics = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  if (entities.physics) {
    entities.physics.update(delta);
  }

  return entities;
};

// Movement system - moves all objects down the screen
export const Movement = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  gameTime += deltaSeconds;

  // Progressive difficulty - speed increases over time
  currentSpeed = BASE_SPEED + (gameTime * 2);
  const moveDistance = currentSpeed * deltaSeconds;

  // Move obstacles
  Object.keys(entities).forEach(key => {
    if (key.startsWith('obstacle_') || key.startsWith('coin_') ||
        key.startsWith('powerup_') || key.startsWith('passenger_')) {
      const entity = entities[key];
      if (entity.body) {
        Matter.Body.setPosition(entity.body, {
          x: entity.body.position.x,
          y: entity.body.position.y + moveDistance,
        });

        // Remove entities that are off screen
        if (entity.body.position.y > SCREEN_HEIGHT + 100) {
          if (entities.physics) {
            entities.physics.removeBody(entity.body);
          }
          delete entities[key];
        }
      }
    }
  });

  // Move dog obstacles horizontally
  Object.keys(entities).forEach(key => {
    if (key.startsWith('obstacle_dog_')) {
      const entity = entities[key];
      if (entity.moveDirection && entity.body) {
        const horizontalMove = entity.moveDirection * 100 * deltaSeconds;
        Matter.Body.setPosition(entity.body, {
          x: entity.body.position.x + horizontalMove,
          y: entity.body.position.y,
        });

        // Reverse direction at screen edges
        if (entity.body.position.x < 50 || entity.body.position.x > SCREEN_WIDTH - 50) {
          entity.moveDirection *= -1;
        }
      }
    }
  });

  return entities;
};

// Obstacle spawning system
export const ObstacleSpawner = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  spawnTimer += deltaSeconds;

  // Calculate spawn rate based on game time
  let spawnInterval = 2.0; // Base spawn every 2 seconds
  if (gameTime > 30) spawnInterval = 1.5;
  if (gameTime > 60) spawnInterval = 1.2;
  if (gameTime > 120) spawnInterval = 1.0;

  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;

    // Determine which obstacle types are unlocked
    const availableTypes = ['car'];
    if (gameTime > 10) availableTypes.push('bus');
    if (gameTime > 20) availableTypes.push('truck');
    if (gameTime > 30) availableTypes.push('dog');
    if (gameTime > 40) availableTypes.push('pothole');
    if (gameTime > 50) availableTypes.push('cow');
    if (gameTime > 60) availableTypes.push('construction');

    // Random obstacle type
    const obstacleType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    // Random lane (left, center, right)
    const lanes = [
      SCREEN_WIDTH * 0.25,
      SCREEN_WIDTH * 0.5,
      SCREEN_WIDTH * 0.75,
    ];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    // Obstacle dimensions based on type
    let width = 70, height = 70;
    if (obstacleType === 'bus' || obstacleType === 'truck') {
      width = 90;
      height = 120;
    } else if (obstacleType === 'pothole') {
      width = 60;
      height = 40;
    } else if (obstacleType === 'construction') {
      width = 100;
      height = 80;
    }

    // Create obstacle
    if (entities.physics) {
      const obstacleBody = entities.physics.createObstacle(
        lane,
        -100,
        width,
        height,
        obstacleType
      );

      const obstacleId = `obstacle_${obstacleType}_${Date.now()}`;
      entities[obstacleId] = {
        body: obstacleBody,
        obstacleType,
        renderer: require('./entities').Obstacle,
        moveDirection: obstacleType === 'dog' ? (Math.random() > 0.5 ? 1 : -1) : 0,
      };
    }
  }

  return entities;
};

// Coin spawning system
export const CoinSpawner = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  coinSpawnTimer += deltaSeconds;

  if (coinSpawnTimer >= 1.5) { // Spawn coins every 1.5 seconds
    coinSpawnTimer = 0;

    // Random position
    const x = 50 + Math.random() * (SCREEN_WIDTH - 100);
    const y = -50;

    if (entities.physics) {
      const coinBody = entities.physics.createCoin(x, y);

      const coinId = `coin_${Date.now()}`;
      entities[coinId] = {
        body: coinBody,
        renderer: require('./entities').Coin,
      };
    }
  }

  return entities;
};

// Power-up spawning system
export const PowerupSpawner = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  powerupSpawnTimer += deltaSeconds;

  if (powerupSpawnTimer >= 15) { // Spawn power-up every 15 seconds
    powerupSpawnTimer = 0;

    const powerupTypes = ['shield', 'magnet', 'speedBoost', 'multiplier'];
    const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];

    const x = 50 + Math.random() * (SCREEN_WIDTH - 100);
    const y = -50;

    if (entities.physics) {
      const powerupBody = entities.physics.createPowerup(x, y, randomType);

      const powerupId = `powerup_${randomType}_${Date.now()}`;
      entities[powerupId] = {
        body: powerupBody,
        powerupType: randomType,
        renderer: require('./entities').Powerup,
      };
    }
  }

  return entities;
};

// Passenger spawning system
export const PassengerSpawner = (entities, { time }) => {
  const { delta } = time;
  const deltaSeconds = delta / 1000;

  passengerSpawnTimer += deltaSeconds;

  if (passengerSpawnTimer >= 5) { // Spawn passenger every 5 seconds
    passengerSpawnTimer = 0;

    const x = 50 + Math.random() * (SCREEN_WIDTH - 100);
    const y = -50;

    if (entities.physics) {
      const passengerBody = entities.physics.createCoin(x, y); // Use coin physics

      const passengerId = `passenger_${Date.now()}`;
      entities[passengerId] = {
        body: passengerBody,
        renderer: require('./entities').Passenger,
      };
    }
  }

  return entities;
};

// Collision detection system
export const CollisionSystem = (entities, { events, dispatch }) => {
  if (!entities.physics || !entities.player) return entities;

  const collisions = entities.physics.checkPlayerCollisions();

  collisions.forEach(collision => {
    const { type, body } = collision;

    // Find entity key for this body
    const entityKey = Object.keys(entities).find(key => entities[key].body === body);
    if (!entityKey) return;

    // Handle different collision types
    if (type.startsWith('obstacle_')) {
      // Check if shield is active
      if (!entities.gameState?.shieldActive) {
        // Game over!
        if (dispatch) {
          const obstacleType = entities[entityKey].obstacleType;

          // Special message for cow
          if (obstacleType === 'cow') {
            dispatch({ type: 'cow-collision' });
          }

          dispatch({ type: 'game-over', payload: { obstacleType } });
        }
      } else {
        // Shield absorbed hit
        if (dispatch) {
          dispatch({ type: 'shield-hit' });
        }
      }

      // Remove obstacle
      entities.physics.removeBody(body);
      delete entities[entityKey];
    }
    else if (type === 'coin') {
      // Collect coin
      if (dispatch) {
        const multiplier = entities.gameState?.multiplierActive ? 2 : 1;
        dispatch({ type: 'collect-coin', payload: { multiplier } });
      }

      // Remove coin
      entities.physics.removeBody(body);
      delete entities[entityKey];
    }
    else if (type.startsWith('powerup_')) {
      // Collect power-up
      const powerupType = entities[entityKey].powerupType;
      if (dispatch) {
        dispatch({ type: 'collect-powerup', payload: { powerupType } });
      }

      // Remove power-up
      entities.physics.removeBody(body);
      delete entities[entityKey];
    }
    else if (entityKey.startsWith('passenger_')) {
      // Collect passenger
      if (dispatch) {
        dispatch({ type: 'collect-passenger' });
      }

      // Remove passenger
      entities.physics.removeBody(body);
      delete entities[entityKey];
    }
  });

  return entities;
};

// Near-miss detection system
export const NearMissSystem = (entities, { dispatch }) => {
  if (!entities.player || !entities.physics) return entities;

  const playerPos = entities.physics.getPlayerPosition();
  const nearMissDistance = 80;

  Object.keys(entities).forEach(key => {
    if (key.startsWith('obstacle_')) {
      const obstacle = entities[key];
      if (obstacle.body && !obstacle.nearMissDetected) {
        const obstaclePos = obstacle.body.position;
        const distance = Math.abs(playerPos.x - obstaclePos.x);

        // Check if obstacle has passed player vertically and was close horizontally
        if (obstaclePos.y > playerPos.y && obstaclePos.y < playerPos.y + 50) {
          if (distance < nearMissDistance && distance > 30) {
            obstacle.nearMissDetected = true;
            if (dispatch) {
              dispatch({ type: 'near-miss', payload: { points: 10 } });
            }
          }
        }
      }
    }
  });

  return entities;
};

// Reset systems (call when starting new game)
export const resetSystems = () => {
  currentSpeed = BASE_SPEED;
  gameTime = 0;
  spawnTimer = 0;
  coinSpawnTimer = 0;
  powerupSpawnTimer = 0;
  passengerSpawnTimer = 0;
};

export const getCurrentSpeed = () => currentSpeed;
export const getGameTime = () => gameTime;
