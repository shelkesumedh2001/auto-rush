/**
 * 3D Collectible Component
 * Coins, power-ups, and passengers
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GAME_3D } from '../../config/constants3D';

const Collectible3D = ({
  type = 'COIN', // 'COIN', 'SHIELD', 'MAGNET', 'BOOST', 'MULTIPLIER', 'PASSENGER'
  position = [0, 1, 0],
  onCollect,
}) => {
  const meshRef = useRef();

  // Animate collectibles (rotate and float)
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate
      meshRef.current.rotation.y += delta * GAME_3D.COINS.ROTATION_SPEED;

      // Float up and down
      const floatOffset = Math.sin(state.clock.elapsedTime * GAME_3D.COINS.FLOAT_SPEED) * GAME_3D.COINS.FLOAT_AMPLITUDE;
      meshRef.current.position.y = position[1] + floatOffset;
    }
  });

  // Render different collectible types
  const renderCollectible = () => {
    switch (type) {
      case 'COIN':
        return (
          <group>
            {/* Coin */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[GAME_3D.COINS.SIZE, GAME_3D.COINS.SIZE, 0.1, 16]} />
              <meshStandardMaterial
                color={0xFFD700}
                metalness={0.8}
                roughness={0.2}
                emissive={0xFFA500}
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Glow effect */}
            <pointLight color={0xFFD700} intensity={0.5} distance={2} />
          </group>
        );

      case 'SHIELD':
        return (
          <group>
            {/* Shield icon */}
            <mesh>
              <sphereGeometry args={[GAME_3D.POWERUPS.SIZE, 16, 16]} />
              <meshStandardMaterial
                color={0x4169E1}
                transparent
                opacity={0.7}
                emissive={0x4169E1}
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* Inner shield shape */}
            <mesh scale={[0.6, 0.8, 0.3]}>
              <sphereGeometry args={[GAME_3D.POWERUPS.SIZE, 8, 8]} />
              <meshStandardMaterial
                color={0x87CEEB}
                emissive={0x87CEEB}
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight color={0x4169E1} intensity={1} distance={3} />
          </group>
        );

      case 'MAGNET':
        return (
          <group>
            {/* Magnet */}
            <mesh>
              <torusGeometry args={[GAME_3D.POWERUPS.SIZE, 0.15, 8, 16]} />
              <meshStandardMaterial
                color={0xFF1493}
                emissive={0xFF1493}
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* Center */}
            <mesh>
              <sphereGeometry args={[GAME_3D.POWERUPS.SIZE * 0.4, 8, 8]} />
              <meshStandardMaterial
                color={0xDC143C}
                emissive={0xDC143C}
                emissiveIntensity={0.6}
              />
            </mesh>
            <pointLight color={0xFF1493} intensity={1} distance={3} />
          </group>
        );

      case 'BOOST':
        return (
          <group>
            {/* Lightning bolt shape */}
            <mesh>
              <coneGeometry args={[GAME_3D.POWERUPS.SIZE, GAME_3D.POWERUPS.SIZE * 2, 4]} />
              <meshStandardMaterial
                color={0xFFD700}
                emissive={0xFFFF00}
                emissiveIntensity={1}
              />
            </mesh>
            {/* Energy rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[GAME_3D.POWERUPS.SIZE * 1.2, 0.05, 8, 16]} />
              <meshStandardMaterial
                color={0xFFFF00}
                emissive={0xFFFF00}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
              />
            </mesh>
            <pointLight color={0xFFFF00} intensity={1.5} distance={3} />
          </group>
        );

      case 'MULTIPLIER':
        return (
          <group>
            {/* Multiplier orb */}
            <mesh>
              <sphereGeometry args={[GAME_3D.POWERUPS.SIZE, 16, 16]} />
              <meshStandardMaterial
                color={0x9370DB}
                emissive={0x9370DB}
                emissiveIntensity={0.8}
              />
            </mesh>
            {/* X2 symbol (simplified as stars) */}
            <mesh position={[0.3, 0, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color={0xFFD700}
                emissive={0xFFD700}
                emissiveIntensity={1}
              />
            </mesh>
            <mesh position={[-0.3, 0, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color={0xFFD700}
                emissive={0xFFD700}
                emissiveIntensity={1}
              />
            </mesh>
            <pointLight color={0x9370DB} intensity={1} distance={3} />
          </group>
        );

      case 'PASSENGER':
        return (
          <group>
            {/* Simplified person */}
            {/* Head */}
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.25, 8, 8]} />
              <meshStandardMaterial color={0xFFDBB5} />
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.2, 0.25, 0.6, 8]} />
              <meshStandardMaterial color={0x4169E1} />
            </mesh>
            {/* Arms */}
            <mesh position={[-0.3, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
              <meshStandardMaterial color={0xFFDBB5} />
            </mesh>
            <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
              <meshStandardMaterial color={0xFFDBB5} />
            </mesh>
            {/* Waving hand indicator */}
            <mesh position={[0, 1, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color={0xFFD700}
                emissive={0xFFD700}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color={0xFFFFFF} />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderCollectible()}
    </group>
  );
};

export default Collectible3D;
