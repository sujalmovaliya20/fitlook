"use client";

import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function SwatchMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Custom shader logic can be handled by standard materials with distortion,
  // or simply moving vertices. Let's use standard with some manual vertex animation
  // but MeshDistortMaterial from drei is easier and looks great for fabric.

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[4, 5, 64, 64]} />
        <MeshDistortMaterial
          color="#C9A84C"
          envMapIntensity={1.5}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          metalness={0.6}
          roughness={0.4}
          distort={0.3}
          speed={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

export function FabricSwatch3D() {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', height: 'clamp(300px, 50vw, 600px)', position: 'relative' }}>
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        dpr={isMobile ? 1 : [1, 2]}
        camera={{ position: [0, 0, 8], fov: isMobile ? 65 : 45 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#C9A84C" />
        <Environment preset="city" />
        <SwatchMesh />
      </Canvas>
    </div>
  );
}
