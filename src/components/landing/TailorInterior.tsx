"use client";
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Link from 'next/link';
import { Scissors } from 'lucide-react';
function BackgroundImage() {
  const texture = useTexture('/atelier_interior_ultra.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 1.5, -8]}>
      {/* Aspect ratio of generated image is usually 1:1, so width=height. Let's make it large enough to cover the camera's FOV. */}
      <planeGeometry args={[25, 25]} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
}

function Scene({ progress }: { progress: number }) {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 3 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    // 1. Camera animations
    let camZ = 5;
    let camRotY = 0;

    if (progress >= 0.4 && progress <= 0.6) {
      const p = (progress - 0.4) / 0.2;
      camZ = 5 - 3 * p;
    } else if (progress > 0.6 && progress <= 0.8) {
      camZ = 2;
      const p = (progress - 0.6) / 0.2;
      camRotY = p * 0.1; // slight pan
    } else if (progress > 0.8) {
      const p = Math.min((progress - 0.8) / 0.1, 1);
      camZ = 2 + 3 * p;
      camRotY = 0.1 - 0.1 * p; // pull back to center
    }

    state.camera.position.set(0, 1.5, camZ);
    state.camera.rotation.y = camRotY;

    // 3. Orbiting light
    if (pointLightRef.current) {
      const t = state.clock.elapsedTime * 0.5;
      pointLightRef.current.position.set(Math.sin(t) * 1.5, 2, Math.cos(t) * 1.5 - 1);
    }

    // 4. Particles update
    if (particlesRef.current) {
      if (progress >= 0.8) {
        particlesRef.current.visible = true;
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < 200; i++) {
          positions[i * 3 + 1] += delta * 0.5;
          if (positions[i * 3 + 1] > 3) {
            positions[i * 3 + 1] = -1;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      } else {
        particlesRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#FFF5E6" />
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" />
      <pointLight ref={pointLightRef} color="#FFD700" intensity={0.8} />

      {/* Realistic Background Image */}
      <Suspense fallback={null}>
        <BackgroundImage />
      </Suspense>


      {/* Particles */}
      <points ref={particlesRef} position={[0, 1, -1]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#FFD700" transparent opacity={0.9} />
      </points>
    </>
  );
}

export function TailorInterior({ progress }: { progress: number }) {
  const showText = progress >= 0.8 && progress < 0.92;
  const opacity = progress >= 0.92 ? Math.max(0, 1 - (progress - 0.92) / 0.03) : 1;
  const containerOpacity = progress < 0.4 ? (progress - 0.35) / 0.05 : opacity; // Fade in at 0.35->0.4

  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      className="absolute inset-0 w-full h-full z-10"
      style={{
        backgroundColor: '#0F0A06',
        opacity: Math.max(0, Math.min(1, containerOpacity)),
        pointerEvents: containerOpacity > 0 ? 'auto' : 'none'
      }}
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        shadows
        camera={{ position: [0, 1.5, 5], fov: isMobile ? 65 : 50 }}
        gl={{ antialias: true }}
        dpr={isMobile ? 1 : (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2)}
      >
        <Scene progress={progress} />
      </Canvas>

      {showText && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center w-full pointer-events-none px-4">
          <h2 className="text-white text-[clamp(20px,5vw,30px)] md:text-[clamp(24px,7vw,48px)] font-light mb-4" style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
            Your customer. Any fabric. Instantly.
          </h2>
          <p className="text-white/80 text-[clamp(14px,3vw,16px)] drop-shadow-lg mb-8" style={{ fontFamily: '"DM Sans", sans-serif' }}>
            FitLook AI generates a photorealistic preview in seconds.
          </p>
          <div className="pointer-events-auto flex justify-center">
            <Link href="/auth/signup" className="w-full sm:w-auto px-4">
              <button className="flex items-center justify-center gap-3 bg-[#C9A84C] hover:bg-[#B3933C] text-black px-4 lg:px-8 py-4 rounded-full font-medium tracking-wide transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] cursor-pointer w-full sm:w-auto min-h-[44px]">
                <Scissors className="w-5 h-5 shrink-0" />
                <span>START FREE TRIAL</span>
              </button>
            </Link>
          </div>
        </div>
      )}

      {progress >= 0.60 && progress < 0.80 && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center w-full pointer-events-none">
          <p className="text-white text-[clamp(18px,4.5vw,24px)] font-light drop-shadow-md" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            {progress < 0.70 ? "Choose any fabric..." : "...and see it on you."}
          </p>
        </div>
      )}
    </section>
  );
}
