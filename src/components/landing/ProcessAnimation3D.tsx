"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
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

function TailorProcessScene() {
  const fabricRef = useRef<THREE.Mesh>(null);
  const mannequinRef = useRef<THREE.Group>(null);
  const scissorsRef = useRef<THREE.Group>(null);

  const profile = getDeviceProfile();
  const segments = { low: 8, mid: 16, high: 32 }[profile] || 32;

  React.useEffect(() => {
    return () => {
      [fabricRef, mannequinRef, scissorsRef].forEach(ref => {
        if (ref.current) {
          ref.current.traverse((child: any) => {
            if (child.isMesh) {
              child.geometry?.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m: any) => m.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }
      });
    };
  }, []);

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
            <cylinderGeometry args={[0.4, 0.5, 0.2, segments]} />
            <meshStandardMaterial color="#150E09" roughness={0.7} metalness={0.2} />
          </mesh>
          {/* Pole */}
          <mesh castShadow receiveShadow position={[0, -1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, segments]} />
            <meshStandardMaterial color="#2C1A0E" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Torso */}
          <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.6, 1.2, 4, Math.max(8, segments / 2)]} />
            <meshStandardMaterial color="#3A2516" roughness={0.9} metalness={0.1} />
          </mesh>
        </group>

        {/* Floating Fabric */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh ref={fabricRef} castShadow receiveShadow position={[1.5, 1, 1.5]}>
            <planeGeometry args={[2, 3, segments, segments]} />
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
    <div className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-auto">
      <Canvas 
        shadows={canvasConfig.shadows}
        camera={{ position: [0, 1.5, 8], fov: isMobile ? 50 : 35 }} 
        dpr={canvasConfig.dpr as any}
        gl={{
          antialias: canvasConfig.antialias,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }}
        style={{ width: '100%', height: '100%' }}
      >
        <PerformanceMonitor />
        <TailorProcessScene />
      </Canvas>
    </div>
  );
}
