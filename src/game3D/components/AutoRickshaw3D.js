/**
 * 3D Auto-Rickshaw Component
 * Player vehicle with 3D model
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AutoRickshaw3D = ({
  position = [0, 0.5, -3],
  color = 0xFFD700,
  isJumping = false,
  isSliding = false,
  targetLane = 0,
  shieldActive = false,
  magnetActive = false,
}) => {
  const meshRef = useRef();
  const shieldRef = useRef();

  // Smooth lane transitions
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Lerp to target lane position
      const targetX = targetLane;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 12 * delta;

      // Slight wobble/bounce animation
      const wobble = Math.sin(state.clock.elapsedTime * 3) * 0.03;
      meshRef.current.rotation.z = wobble;

      // Tilt when changing lanes
      const lateralSpeed = (targetX - meshRef.current.position.x) * 2;
      meshRef.current.rotation.z += lateralSpeed * delta;
    }

    // Rotate shield
    if (shieldRef.current && shieldActive) {
      shieldRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {/* Auto-rickshaw body (simplified geometric model) */}
      <group>
        {/* Main body */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 1.8]} />
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.8, 0.6, 4]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Front wheel */}
        <mesh position={[0, -0.1, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color={0x222222} />
        </mesh>

        {/* Back wheels */}
        <mesh position={[-0.5, -0.1, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color={0x222222} />
        </mesh>
        <mesh position={[0.5, -0.1, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
          <meshStandardMaterial color={0x222222} />
        </mesh>

        {/* Headlights */}
        <mesh position={[-0.3, 0.3, 0.9]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={0xFFFF00} emissive={0xFFFF00} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.3, 0.3, 0.9]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={0xFFFF00} emissive={0xFFFF00} emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Shield effect */}
      {shieldActive && (
        <mesh ref={shieldRef} position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color={0x4169E1}
            transparent
            opacity={0.3}
            emissive={0x4169E1}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Magnet effect */}
      {magnetActive && (
        <group>
          <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.1, 8, 32]} />
            <meshStandardMaterial
              color={0xFF1493}
              emissive={0xFF1493}
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default AutoRickshaw3D;
