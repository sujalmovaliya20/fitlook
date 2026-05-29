"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  "Analyzing fabric texture...",
  "Mapping to garment pattern...",
  "Rendering your personalized look...",
  "Adding final details...",
];

export function GenerationLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Rotating Messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fake Progress
  useEffect(() => {
    const startTime = Date.now();
    const duration = 30000; // 30s

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const percentage = Math.min(90, (elapsed / duration) * 90);
      setProgress(percentage);
      if (percentage < 90) {
        requestAnimationFrame(updateProgress);
      }
    };
    requestAnimationFrame(updateProgress);
  }, []);

  // Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: (Math.random() * 0.5 + 0.2) * -1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;

        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 bg-[#0A0A0F] flex flex-col items-center justify-center overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsing Spinner */}
        <div className="relative w-24 h-24 mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[var(--accent-gold)]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 45}deg) translateY(-24px)`,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>

        <h1 className="font-[family-name:var(--font-display)] font-light text-[48px] text-[var(--text-primary)] mb-4 tracking-wide text-center">
          Crafting your look...
        </h1>

        <div className="h-[24px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[16px] text-[var(--text-secondary)] font-[family-name:var(--font-body)] text-center"
            >
              {MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.05)]">
        <motion.div 
          className="h-full bg-[var(--accent-gold)] shadow-[var(--glow-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
