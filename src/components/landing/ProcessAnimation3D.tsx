"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

function TailorProcessScene() {
  const fabricRef = useRef<THREE.Mesh>(null);
  const mannequinRef = useRef<THREE.Group>(null);
  const scissorsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (fabricRef.current) {
      fabricRef.current.position.y = Math.sin(t * 0.8) * 0.5 + 0.5;
      fabricRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
      fabricRef.current.rotation.y = t * 0.3;
    }
    if (mannequinRef.current) {
      mannequinRef.current.rotation.y = -t * 0.1;
    }
    if (scissorsRef.current) {
      scissorsRef.current.position.y = Math.cos(t * 0.7) * 0.4 - 0.5;
      scissorsRef.current.rotation.z = Math.sin(t * 2) * 0.2; // snipping motion
      scissorsRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#E8DCC8" />
      <spotLight position={[5, 10, 5]} angle={0.4} penumbra={1} intensity={2.5} color="#C9A84C" castShadow />
      <spotLight position={[-5, 5, -5]} angle={0.6} penumbra={1} intensity={1} color="#ffffff" />
      
      <Center>
        {/* Abstract Mannequin Stand */}
        <group ref={mannequinRef}>
          {/* Base */}
          <mesh castShadow receiveShadow position={[0, -2, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
            <meshStandardMaterial color="#150E09" roughness={0.7} metalness={0.2} />
          </mesh>
          {/* Pole */}
          <mesh castShadow receiveShadow position={[0, -1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, 32]} />
            <meshStandardMaterial color="#2C1A0E" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Torso */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.6, 1.2, 4, 16]} />
            <meshStandardMaterial color="#3A2516" roughness={0.9} metalness={0.1} />
          </mesh>
        </group>

        {/* Floating Fabric */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh ref={fabricRef} castShadow receiveShadow position={[1.5, 1, 1.5]}>
            <planeGeometry args={[2, 3, 32, 32]} />
            <meshStandardMaterial 
              color="#C9A84C" 
              roughness={0.4} 
              metalness={0.6} 
              side={THREE.DoubleSide} 
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>

        {/* Abstract Scissors */}
        <group ref={scissorsRef} position={[-1.5, -0.5, 1.5]}>
          <mesh castShadow position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
            <boxGeometry args={[0.1, 1, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
            <boxGeometry args={[0.1, 1, 0.02]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

      </Center>
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function ProcessAnimation3D() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-auto">
      <Canvas shadows camera={{ position: [0, 1.5, 8], fov: 35 }}>
        <TailorProcessScene />
      </Canvas>
    </div>
  );
}
