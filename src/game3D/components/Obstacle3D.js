/**
 * 3D Obstacle Component
 * Various obstacle types (cars, buses, barriers, etc.)
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GAME_3D } from '../../config/constants3D';

const Obstacle3D = ({
  type = 'CAR',
  position = [0, 0, 0],
  onCollision,
}) => {
  const meshRef = useRef();
  const config = GAME_3D.OBSTACLES[type];

  // Slight animation for some obstacles
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slight wobble for dynamic feel
      if (type === 'COW' || type === 'DOG') {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  // Render different obstacle types
  const renderObstacle = () => {
    switch (type) {
      case 'CAR':
        return (
          <group>
            {/* Car body */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[config.width, config.height, config.depth]} />
              <meshStandardMaterial color={0xFF4444} metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Car roof */}
            <mesh position={[0, 0.9, -0.2]}>
              <boxGeometry args={[config.width * 0.8, 0.4, config.depth * 0.6]} />
              <meshStandardMaterial color={0xCC0000} metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Wheels */}
            {[-0.5, 0.5].map((x, i) => (
              <React.Fragment key={i}>
                <mesh position={[x, 0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                  <meshStandardMaterial color={0x222222} />
                </mesh>
                <mesh position={[x, 0.2, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                  <meshStandardMaterial color={0x222222} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );

      case 'BUS':
        return (
          <group>
            {/* Bus body */}
            <mesh position={[0, 1.25, 0]}>
              <boxGeometry args={[config.width, config.height, config.depth]} />
              <meshStandardMaterial color={0x4169E1} metalness={0.3} roughness={0.6} />
            </mesh>
            {/* Windows */}
            <mesh position={[0, 1.8, 0.1]}>
              <boxGeometry args={[config.width * 0.9, 0.6, config.depth * 0.95]} />
              <meshStandardMaterial color={0x87CEEB} transparent opacity={0.5} />
            </mesh>
            {/* Wheels */}
            {[-0.6, 0.6].map((x, i) => (
              <React.Fragment key={i}>
                <mesh position={[x, 0.3, 1]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                  <meshStandardMaterial color={0x222222} />
                </mesh>
                <mesh position={[x, 0.3, -1]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                  <meshStandardMaterial color={0x222222} />
                </mesh>
              </React.Fragment>
            ))}
          </group>
        );

      case 'TRUCK':
        return (
          <group>
            {/* Truck cargo */}
            <mesh position={[0, 1, 0.5]}>
              <boxGeometry args={[config.width, config.height, config.depth * 0.7]} />
              <meshStandardMaterial color={0xFFA500} metalness={0.2} roughness={0.8} />
            </mesh>
            {/* Truck cabin */}
            <mesh position={[0, 0.8, -0.8]}>
              <boxGeometry args={[config.width * 0.8, 1.2, 0.8]} />
              <meshStandardMaterial color={0xFF8C00} metalness={0.3} roughness={0.7} />
            </mesh>
          </group>
        );

      case 'BARRIER':
        return (
          <group>
            {/* Construction barrier */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[config.width, config.height, config.depth]} />
              <meshStandardMaterial color={0xFFA500} metalness={0.1} roughness={0.9} />
            </mesh>
            {/* Black stripes */}
            <mesh position={[0, 0.6, 0.26]}>
              <boxGeometry args={[config.width * 0.3, config.height, 0.01]} />
              <meshStandardMaterial color={0x000000} />
            </mesh>
            {/* Warning light */}
            <mesh position={[0, 1.3, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color={0xFF0000} emissive={0xFF0000} emissiveIntensity={1} />
            </mesh>
          </group>
        );

      case 'CONE':
        return (
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[config.width, config.height, 8]} />
            <meshStandardMaterial color={0xFFA500} />
          </mesh>
        );

      case 'COW':
        return (
          <group>
            {/* Cow body */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[config.width, 0.8, config.depth]} />
              <meshStandardMaterial color={0xF5DEB3} />
            </mesh>
            {/* Cow head */}
            <mesh position={[0, 0.7, 0.9]}>
              <boxGeometry args={[0.6, 0.6, 0.5]} />
              <meshStandardMaterial color={0xF5DEB3} />
            </mesh>
            {/* Legs */}
            {[-0.3, 0.3].map((x, i) =>
              [0.5, -0.5].map((z, j) => (
                <mesh key={`${i}-${j}`} position={[x, 0.2, z]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
                  <meshStandardMaterial color={0x8B4513} />
                </mesh>
              ))
            )}
          </group>
        );

      case 'DOG':
        return (
          <group>
            {/* Dog body */}
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[config.width, 0.4, config.depth]} />
              <meshStandardMaterial color={0x8B4513} />
            </mesh>
            {/* Dog head */}
            <mesh position={[0, 0.4, 0.5]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color={0x8B4513} />
            </mesh>
            {/* Tail */}
            <mesh position={[0, 0.5, -0.5]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
              <meshStandardMaterial color={0x654321} />
            </mesh>
          </group>
        );

      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={0xFF0000} />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderObstacle()}
    </group>
  );
};

export default Obstacle3D;
