/**
 * 3D Road Component
 * Infinite scrolling road with lanes
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GAME_3D } from '../../config/constants3D';

const Road3D = ({ speed = 10 }) => {
  const roadSegments = useRef([]);
  const roadGroupRef = useRef();

  // Create road texture
  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Road surface
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, 256, 256);

    // Lane markings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 20]);

    // Left lane line
    ctx.beginPath();
    ctx.moveTo(85, 0);
    ctx.lineTo(85, 256);
    ctx.stroke();

    // Right lane line
    ctx.beginPath();
    ctx.moveTo(171, 0);
    ctx.lineTo(171, 256);
    ctx.stroke();

    // Edge lines (solid)
    ctx.setLineDash([]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ffff00';

    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(20, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(236, 0);
    ctx.lineTo(236, 256);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 10);

    return texture;
  }, []);

  // Animate road scrolling
  useFrame((state, delta) => {
    if (roadGroupRef.current) {
      // Move road backward
      roadGroupRef.current.position.z += speed * delta;

      // Reset position when segment has scrolled past
      if (roadGroupRef.current.position.z > GAME_3D.ROAD.SEGMENT_LENGTH) {
        roadGroupRef.current.position.z -= GAME_3D.ROAD.SEGMENT_LENGTH;
      }
    }

    // Animate texture offset for continuous scrolling
    if (roadTexture) {
      roadTexture.offset.y -= speed * delta * 0.1;
    }
  });

  // Create multiple road segments for seamless looping
  const segmentCount = 10;
  const segments = [];

  for (let i = 0; i < segmentCount; i++) {
    const zPos = -i * GAME_3D.ROAD.SEGMENT_LENGTH;

    segments.push(
      <mesh
        key={`road-${i}`}
        position={[0, 0, zPos]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[GAME_3D.ROAD.WIDTH, GAME_3D.ROAD.SEGMENT_LENGTH * segmentCount]} />
        <meshStandardMaterial map={roadTexture} />
      </mesh>
    );
  }

  return (
    <group ref={roadGroupRef}>
      {segments}

      {/* Side barriers/walls */}
      <mesh position={[-GAME_3D.ROAD.WIDTH / 2 - 0.5, 0.5, -GAME_3D.ROAD.SEGMENT_LENGTH * 5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 1, GAME_3D.ROAD.SEGMENT_LENGTH * 10]} />
        <meshStandardMaterial color={0xcccccc} />
      </mesh>

      <mesh position={[GAME_3D.ROAD.WIDTH / 2 + 0.5, 0.5, -GAME_3D.ROAD.SEGMENT_LENGTH * 5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 1, GAME_3D.ROAD.SEGMENT_LENGTH * 10]} />
        <meshStandardMaterial color={0xcccccc} />
      </mesh>
    </group>
  );
};

export default Road3D;
