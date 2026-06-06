"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getDeviceProfile } from '@/lib/deviceDetect';

function PerformanceMonitor() {
  const { gl, scene, camera } = useThree();
  const profile = getDeviceProfile();

  React.useEffect(() => {
    if (profile === 'low') {
      gl.setAnimationLoop(null);
      let lastTime = 0;
      const fps30 = 1000 / 30;
      gl.setAnimationLoop((time) => {
        if (time - lastTime >= fps30) {
          lastTime = time;
          gl.render(scene, camera);
        }
      });
    }
  }, [gl, profile, scene, camera]);

  return null;
}

function SwatchMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const profile = getDeviceProfile();
  const segments = { low: 16, mid: 32, high: 64 }[profile] || 64;

  React.useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry?.dispose();
        if (meshRef.current.material) {
          (meshRef.current.material as THREE.Material).dispose();
        }
      }
    };
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <planeGeometry args={[4, 5, segments, segments]} />
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
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const profile = getDeviceProfile();
  const canvasConfig = {
    low:  { dpr: 1,      shadows: false, antialias: false },
    mid:  { dpr: [1, 1.5], shadows: false, antialias: true  },
    high: { dpr: [1, 2],   shadows: true,  antialias: true  },
  }[profile] || { dpr: [1, 2], shadows: true, antialias: true };

  return (
    <div style={{ width: '100%', height: 'clamp(300px, 50vw, 600px)', position: 'relative' }}>
      <Canvas 
        style={{ width: '100%', height: '100%' }}
        dpr={canvasConfig.dpr as any}
        camera={{ position: [0, 0, 8], fov: isMobile ? 65 : 45 }}
        shadows={canvasConfig.shadows}
        gl={{
          antialias: canvasConfig.antialias,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
      >
        <PerformanceMonitor />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#C9A84C" />
        <Environment preset="city" />
        <SwatchMesh />
      </Canvas>
    </div>
  );
}
