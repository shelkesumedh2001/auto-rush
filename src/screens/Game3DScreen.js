/**
 * 3D Game Screen - TRUE 3D SUBWAY SURFERS STYLE
 * Optimized Three.js implementation with behind-the-back camera
 */

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../config/colors';
import { GAME_3D } from '../config/constants3D';
import { useGame } from '../context/GameContext';
import { useUser } from '../context/UserContext';

// Player Auto-Rickshaw (3D)
const AutoRickshaw = ({ position, currentLane, isJumping }) => {
  const meshRef = useRef();
  const targetX = GAME_3D.LANE_POSITIONS[currentLane];

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth lane transitions
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 10 * delta;

      // Jump animation
      if (isJumping) {
        const jumpTime = (Date.now() % 600) / 600;
        meshRef.current.position.y = Math.sin(jumpTime * Math.PI) * 2 + 0.5;
      } else {
        meshRef.current.position.y = 0.5;
      }

      // Slight tilt when moving
      const tilt = (targetX - meshRef.current.position.x) * 0.2;
      meshRef.current.rotation.z = tilt;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.5, position[2]]}>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1, 0.6, 1.5]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.4, 0, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.4, 0, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-0.4, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.4, 0, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.3, 0.3, 0.75]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.3, 0.3, 0.75]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

// Obstacle Component
const Obstacle = ({ type, position, speed }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.z += speed * delta;

      // Rotate coins
      if (type === 'coin') {
        meshRef.current.rotation.y += delta * 3;
      }
    }
  });

  const renderObstacle = () => {
    switch (type) {
      case 'car':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[1, 0.8, 2]} />
              <meshStandardMaterial color="#FF4444" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.5, -0.3]} castShadow>
              <boxGeometry args={[0.9, 0.4, 0.8]} />
              <meshStandardMaterial color="#FF6666" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        );

      case 'bus':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[1.5, 2, 4]} />
              <meshStandardMaterial color="#4444FF" metalness={0.5} roughness={0.5} />
            </mesh>
          </group>
        );

      case 'barrier':
        return (
          <group>
            <mesh castShadow>
              <boxGeometry args={[1.5, 0.8, 0.3]} />
              <meshStandardMaterial color="#FF8800" metalness={0.3} roughness={0.7} />
            </mesh>
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#FFFF00" emissive="#FFAA00" emissiveIntensity={1} />
            </mesh>
          </group>
        );

      case 'coin':
        return (
          <group>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.9}
                roughness={0.1}
                emissive="#FFA500"
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight color="#FFD700" intensity={1} distance={3} />
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderObstacle()}
    </group>
  );
};

// Road Component
const Road = ({ speed }) => {
  const roadRef = useRef();
  const textureOffset = useRef(0);

  // Create road texture
  const roadTexture = useRef();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Road surface
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);

    // Lane markings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.setLineDash([40, 40]);

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(128 + i * 128, 0);
      ctx.lineTo(128 + i * 128, 512);
      ctx.stroke();
    }

    // Edge lines (yellow)
    ctx.setLineDash([]);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(20, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(492, 0);
    ctx.lineTo(492, 512);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 10);
    roadTexture.current = texture;
  }, []);

  useFrame((state, delta) => {
    if (roadTexture.current) {
      textureOffset.current += speed * delta * 0.15;
      roadTexture.current.offset.y = textureOffset.current;
    }
  });

  return (
    <group>
      {/* Main road */}
      <mesh position={[0, 0, -50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial
          map={roadTexture.current}
          roughness={0.9}
        />
      </mesh>

      {/* Side barriers */}
      <mesh position={[-4.5, 0.5, -50]} castShadow>
        <boxGeometry args={[0.5, 1, 200]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[4.5, 0.5, -50]} castShadow>
        <boxGeometry args={[0.5, 1, 200]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, -0.1, -50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 200]} />
        <meshStandardMaterial color="#654321" roughness={1} />
      </mesh>

      {/* Buildings (simplified) */}
      {[-8, -12, -16, 8, 12, 16].map((x, i) => (
        <mesh key={i} position={[x, 5, -50 + (i * -20)]} castShadow>
          <boxGeometry args={[3, 10, 15]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#8B7355" : "#A0826D"} />
        </mesh>
      ))}
    </group>
  );
};

// Main Game Scene
const GameScene = ({ obstacles, speed, currentLane, isJumping, onCollision }) => {
  const { camera } = useThree();
  const playerPosRef = useRef([0, 0, 5]);

  useFrame(() => {
    // Camera follows player
    camera.position.x = GAME_3D.LANE_POSITIONS[currentLane];
    camera.position.y = 3;
    camera.position.z = 8;
    camera.lookAt(GAME_3D.LANE_POSITIONS[currentLane], 1, 0);

    playerPosRef.current = [GAME_3D.LANE_POSITIONS[currentLane], isJumping ? 2 : 0.5, 5];

    // Check collisions
    obstacles.forEach(obs => {
      if (obs.type !== 'coin') {
        const dx = Math.abs(obs.position[0] - playerPosRef.current[0]);
        const dz = Math.abs(obs.position[2] - playerPosRef.current[2]);
        const dy = Math.abs(obs.position[1] - playerPosRef.current[1]);

        if (dx < 1 && dz < 2) {
          if (obs.type === 'barrier' && isJumping) {
            // Jumped over
          } else if (dy < 1) {
            onCollision(obs.id);
          }
        }
      }
    });
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87CEEB', '#654321', 0.6]} />

      {/* Fog */}
      <fog attach="fog" args={['#87CEEB', 30, 100]} />

      {/* Player */}
      <AutoRickshaw
        position={[0, 0.5, 5]}
        currentLane={currentLane}
        isJumping={isJumping}
      />

      {/* Road */}
      <Road speed={speed} />

      {/* Obstacles */}
      {obstacles.map(obs => (
        <Obstacle
          key={obs.id}
          type={obs.type}
          position={obs.position}
          speed={speed}
        />
      ))}
    </>
  );
};

// Main Component
const Game3DScreen = ({ onGameOver, onPause }) => {
  const { startGame, updateScore, updateDistance } = useGame();
  const { user, addCoins: addUserCoins, updateHighScore } = useUser();

  const [currentLane, setCurrentLane] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [gameRunning, setGameRunning] = useState(true);
  const [speed, setSpeed] = useState(10);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);

  const gameTimeRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const nextIdRef = useRef(0);
  const animationRef = useRef();

  useEffect(() => {
    startGame();
    startGameLoop();

    // Keyboard controls
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') setCurrentLane(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight' || e.key === 'd') setCurrentLane(prev => Math.min(2, prev + 1));
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        if (!isJumping) {
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 600);
        }
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const startGameLoop = () => {
    let lastTime = Date.now();

    const loop = () => {
      if (!gameRunning) return;

      const now = Date.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      gameTimeRef.current += delta;

      // Update speed
      const newSpeed = Math.min(10 + gameTimeRef.current * 0.3, 25);
      setSpeed(newSpeed);

      // Update score
      const dist = newSpeed * delta * 10;
      setScore(prev => {
        const newScore = prev + Math.floor(dist);
        updateScore(newScore);
        updateDistance(newScore / 10);
        return newScore;
      });

      // Spawn
      if (gameTimeRef.current - lastSpawnRef.current >= 1.2) {
        spawnObstacles();
        lastSpawnRef.current = gameTimeRef.current;
      }

      // Update positions
      setObstacles(prev => prev.filter(obs => obs.position[2] < 15));

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
  };

  const spawnObstacles = () => {
    const types = ['car', 'bus', 'barrier'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const lanes = [0, 1, 2].filter(l => Math.random() > 0.3 || l !== currentLane);
    const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

    setObstacles(prev => [...prev, {
      id: `obs_${nextIdRef.current++}`,
      type: randomType,
      position: [GAME_3D.LANE_POSITIONS[randomLane], randomType === 'barrier' ? 0.4 : 0.8, -30],
    }]);

    // Coins
    if (Math.random() < 0.6) {
      const coinLane = Math.floor(Math.random() * 3);
      setObstacles(prev => [...prev, {
        id: `coin_${nextIdRef.current++}`,
        type: 'coin',
        position: [GAME_3D.LANE_POSITIONS[coinLane], 1.5, -30],
      }]);
    }
  };

  const handleCollision = (id) => {
    const obs = obstacles.find(o => o.id === id);
    if (!obs) return;

    if (obs.type === 'coin') {
      setCoins(prev => prev + 1);
      setScore(prev => prev + 10);
      setObstacles(prev => prev.filter(o => o.id !== id));
    } else {
      // Crash
      setGameRunning(false);
      if (score > (user.highScore || 0)) updateHighScore(score);
      addUserCoins(coins);
      setTimeout(() => onGameOver({ score, distance: Math.floor(score / 10), coins }), 500);
    }
  };

  return (
    <View style={styles.container}>
      <Canvas shadows camera={{ position: [0, 3, 8], fov: 75 }} style={styles.canvas}>
        <Suspense fallback={null}>
          <GameScene
            obstacles={obstacles}
            speed={speed}
            currentLane={currentLane}
            isJumping={isJumping}
            onCollision={handleCollision}
          />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>Score: {score}</Text>
        <Text style={styles.hudText}>Coins: 🪙 {coins}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => setCurrentLane(prev => Math.max(0, prev - 1))}>
          <Text style={styles.btnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.jumpBtn]} onPress={() => {
          if (!isJumping) {
            setIsJumping(true);
            setTimeout(() => setIsJumping(false), 600);
          }
        }}>
          <Text style={styles.btnText}>JUMP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setCurrentLane(prev => Math.min(2, prev + 1))}>
          <Text style={styles.btnText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#87CEEB' },
  canvas: { flex: 1 },
  hud: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  jumpBtn: {
    backgroundColor: 'rgba(255,215,0,0.4)',
    borderColor: '#FFD700',
  },
  btnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default Game3DScreen;
