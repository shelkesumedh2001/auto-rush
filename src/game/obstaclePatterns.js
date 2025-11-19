/**
 * Preset Obstacle Patterns
 * Pre-defined obstacle patterns for varied gameplay
 */

export const OBSTACLE_PATTERNS = {
  // Simple patterns - early game
  SINGLE_LANE: [
    { lane: 0, type: 'car', delay: 0 },
  ],

  TWO_LANES: [
    { lane: 0, type: 'car', delay: 0 },
    { lane: 2, type: 'car', delay: 0 },
  ],

  ALTERNATING: [
    { lane: 0, type: 'car', delay: 0 },
    { lane: 2, type: 'bus', delay: 1000 },
    { lane: 1, type: 'car', delay: 2000 },
  ],

  // Medium patterns - mid game
  ZIGZAG: [
    { lane: 0, type: 'car', delay: 0 },
    { lane: 1, type: 'truck', delay: 800 },
    { lane: 2, type: 'car', delay: 1600 },
    { lane: 1, type: 'car', delay: 2400 },
  ],

  WALL_WITH_GAP: [
    { lane: 0, type: 'bus', delay: 0 },
    // Gap in lane 1
    { lane: 2, type: 'bus', delay: 0 },
  ],

  MOVING_DOG_PATTERN: [
    { lane: 1, type: 'dog', delay: 0 },
    { lane: 0, type: 'car', delay: 500 },
    { lane: 2, type: 'car', delay: 500 },
  ],

  POTHOLE_JUMP: [
    { lane: 1, type: 'pothole', delay: 0 },
    { lane: 0, type: 'car', delay: 500 },
    { lane: 2, type: 'car', delay: 500 },
  ],

  // Hard patterns - late game
  TRIPLE_THREAT: [
    { lane: 0, type: 'truck', delay: 0 },
    { lane: 1, type: 'cow', delay: 200 },
    { lane: 2, type: 'truck', delay: 0 },
    // Must dodge between them
  ],

  CONSTRUCTION_ZONE: [
    { lane: 1, type: 'construction', delay: 0 },
    { lane: 0, type: 'car', delay: 800 },
    { lane: 2, type: 'dog', delay: 800 },
  ],

  CHAOS: [
    { lane: 0, type: 'bus', delay: 0 },
    { lane: 1, type: 'pothole', delay: 300 },
    { lane: 2, type: 'truck', delay: 600 },
    { lane: 1, type: 'dog', delay: 1200 },
  ],

  COW_GAUNTLET: [
    { lane: 1, type: 'cow', delay: 0 },
    { lane: 0, type: 'car', delay: 600 },
    { lane: 2, type: 'car', delay: 600 },
    { lane: 1, type: 'cow', delay: 1200 },
  ],
};

/**
 * Get random pattern based on difficulty
 * @param {number} gameTime - Current game time
 * @returns {Array} Pattern array
 */
export const getRandomPattern = (gameTime) => {
  let availablePatterns = [];

  if (gameTime < 30) {
    // Early game - simple patterns
    availablePatterns = [
      OBSTACLE_PATTERNS.SINGLE_LANE,
      OBSTACLE_PATTERNS.TWO_LANES,
      OBSTACLE_PATTERNS.ALTERNATING,
    ];
  } else if (gameTime < 60) {
    // Mid game - medium patterns
    availablePatterns = [
      OBSTACLE_PATTERNS.ALTERNATING,
      OBSTACLE_PATTERNS.ZIGZAG,
      OBSTACLE_PATTERNS.WALL_WITH_GAP,
      OBSTACLE_PATTERNS.MOVING_DOG_PATTERN,
      OBSTACLE_PATTERNS.POTHOLE_JUMP,
    ];
  } else {
    // Late game - hard patterns
    availablePatterns = [
      OBSTACLE_PATTERNS.ZIGZAG,
      OBSTACLE_PATTERNS.TRIPLE_THREAT,
      OBSTACLE_PATTERNS.CONSTRUCTION_ZONE,
      OBSTACLE_PATTERNS.CHAOS,
      OBSTACLE_PATTERNS.COW_GAUNTLET,
    ];
  }

  return availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
};

/**
 * Spawn a pattern
 * @param {Array} pattern - Pattern to spawn
 * @param {Object} physics - Physics engine
 * @param {Object} entities - Game entities
 */
export const spawnPattern = (pattern, physics, entities) => {
  const lanes = [
    window.SCREEN_WIDTH * 0.25,
    window.SCREEN_WIDTH * 0.5,
    window.SCREEN_WIDTH * 0.75,
  ];

  pattern.forEach(({ lane, type, delay }) => {
    setTimeout(() => {
      const x = lanes[lane];
      const y = -100 - delay / 10; // Offset based on delay

      let width = 70, height = 70;
      if (type === 'bus' || type === 'truck') {
        width = 90;
        height = 120;
      } else if (type === 'pothole') {
        width = 60;
        height = 40;
      } else if (type === 'construction') {
        width = 100;
        height = 80;
      }

      const obstacleBody = physics.createObstacle(x, y, width, height, type);

      const obstacleId = `obstacle_${type}_${Date.now()}_${Math.random()}`;
      entities[obstacleId] = {
        body: obstacleBody,
        obstacleType: type,
        renderer: require('./entities').Obstacle,
        moveDirection: type === 'dog' ? (Math.random() > 0.5 ? 1 : -1) : 0,
      };
    }, delay);
  });
};
