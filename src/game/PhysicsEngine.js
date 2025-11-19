/**
 * Physics Engine using Matter.js
 * Handles all physics calculations and collision detection
 */

import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Physics constants
const PHYSICS = {
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  PLAYER_WIDTH: 60,
  PLAYER_HEIGHT: 80,
  OBSTACLE_MIN_WIDTH: 50,
  OBSTACLE_MAX_WIDTH: 100,
  COIN_SIZE: 30,
  POWERUP_SIZE: 40,
};

class PhysicsEngine {
  constructor() {
    this.engine = Matter.Engine.create({ enableSleeping: false });
    this.world = this.engine.world;
    this.engine.world.gravity.y = PHYSICS.GRAVITY;

    this.bodies = {};
  }

  // Create player auto-rickshaw
  createPlayer(x, y) {
    const player = Matter.Bodies.rectangle(
      x,
      y,
      PHYSICS.PLAYER_WIDTH,
      PHYSICS.PLAYER_HEIGHT,
      {
        label: 'player',
        isStatic: false,
        friction: 0,
        frictionAir: 0.01,
        restitution: 0,
      }
    );

    Matter.World.add(this.world, player);
    this.bodies.player = player;
    return player;
  }

  // Create obstacle
  createObstacle(x, y, width, height, type) {
    const obstacle = Matter.Bodies.rectangle(
      x,
      y,
      width,
      height,
      {
        label: `obstacle_${type}`,
        isStatic: true,
        isSensor: true, // For collision detection without physics response
      }
    );

    Matter.World.add(this.world, obstacle);
    return obstacle;
  }

  // Create coin
  createCoin(x, y) {
    const coin = Matter.Bodies.circle(
      x,
      y,
      PHYSICS.COIN_SIZE / 2,
      {
        label: 'coin',
        isStatic: true,
        isSensor: true,
      }
    );

    Matter.World.add(this.world, coin);
    return coin;
  }

  // Create power-up
  createPowerup(x, y, type) {
    const powerup = Matter.Bodies.rectangle(
      x,
      y,
      PHYSICS.POWERUP_SIZE,
      PHYSICS.POWERUP_SIZE,
      {
        label: `powerup_${type}`,
        isStatic: true,
        isSensor: true,
      }
    );

    Matter.World.add(this.world, powerup);
    return powerup;
  }

  // Create ground/floor
  createGround(y) {
    const ground = Matter.Bodies.rectangle(
      SCREEN_WIDTH / 2,
      y,
      SCREEN_WIDTH * 2,
      60,
      {
        label: 'ground',
        isStatic: true,
      }
    );

    Matter.World.add(this.world, ground);
    this.bodies.ground = ground;
    return ground;
  }

  // Apply jump force to player
  jump(force = PHYSICS.JUMP_FORCE) {
    if (this.bodies.player) {
      Matter.Body.setVelocity(this.bodies.player, {
        x: 0,
        y: force,
      });
    }
  }

  // Check if player is on ground
  isPlayerOnGround() {
    if (!this.bodies.player || !this.bodies.ground) return false;

    const collision = Matter.Query.collides(this.bodies.player, [this.bodies.ground]);
    return collision.length > 0;
  }

  // Get all collisions for a body
  getCollisions(body) {
    const allBodies = Matter.Composite.allBodies(this.world);
    return Matter.Query.collides(body, allBodies);
  }

  // Check collision between player and obstacles
  checkPlayerCollisions() {
    if (!this.bodies.player) return [];

    const collisions = this.getCollisions(this.bodies.player);
    return collisions
      .filter(collision => {
        const otherBody = collision.bodyA === this.bodies.player ? collision.bodyB : collision.bodyA;
        return otherBody.label !== 'ground' && otherBody.label !== 'player';
      })
      .map(collision => {
        const otherBody = collision.bodyA === this.bodies.player ? collision.bodyB : collision.bodyA;
        return {
          body: otherBody,
          type: otherBody.label,
        };
      });
  }

  // Remove body from world
  removeBody(body) {
    Matter.World.remove(this.world, body);
  }

  // Update physics simulation
  update(delta) {
    Matter.Engine.update(this.engine, delta);
  }

  // Reset physics engine
  reset() {
    Matter.World.clear(this.world);
    Matter.Engine.clear(this.engine);
    this.bodies = {};
  }

  // Get player position
  getPlayerPosition() {
    if (!this.bodies.player) return { x: 0, y: 0 };
    return {
      x: this.bodies.player.position.x,
      y: this.bodies.player.position.y,
    };
  }

  // Set player position
  setPlayerPosition(x, y) {
    if (this.bodies.player) {
      Matter.Body.setPosition(this.bodies.player, { x, y });
    }
  }

  // Apply force to player (for slide mechanic)
  applyForce(force) {
    if (this.bodies.player) {
      Matter.Body.applyForce(this.bodies.player, this.bodies.player.position, force);
    }
  }

  // Stop player vertical movement
  stopVerticalMovement() {
    if (this.bodies.player) {
      Matter.Body.setVelocity(this.bodies.player, {
        x: this.bodies.player.velocity.x,
        y: 0,
      });
    }
  }
}

export default PhysicsEngine;
export { PHYSICS };
