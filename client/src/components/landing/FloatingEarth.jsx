import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function FloatingEarth() {
  const containerRef = useRef(null);

  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 200 + Math.sin(i * 0.8) * 160,
      y: 200 + Math.cos(i * 0.8) * 160,
      z: Math.sin(i * 0.5) * 40,
      size: Math.random() * 3 + 1.5,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div ref={containerRef} className="relative w-[400px] h-[400px] mx-auto">
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full relative"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue/20 via-neon-purple/10 to-transparent blur-3xl animate-pulse" />
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-neon-blue/30 via-transparent to-neon-purple/20 blur-2xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[280px] h-[280px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_40px_rgba(0,212,255,0.3)]">
                <defs>
                  <radialGradient id="earthGlow" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#0066ff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ocean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0066ff" />
                    <stop offset="50%" stopColor="#0099ff" />
                    <stop offset="100%" stopColor="#0033cc" />
                  </linearGradient>
                  <linearGradient id="land" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00cc66" />
                    <stop offset="100%" stopColor="#00994d" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="140" fill="url(#earthGlow)" />
                <circle cx="150" cy="150" r="130" fill="url(#ocean)" opacity="0.9" />
                <path d="M90 80 Q120 70 150 85 Q180 100 200 90 Q220 80 240 100 L250 140 Q230 170 200 180 Q170 190 140 185 Q110 180 80 160 L70 120 Z" fill="url(#land)" opacity="0.8" />
                <path d="M180 200 Q200 190 220 210 Q240 230 230 260 L200 270 Q170 260 160 230 Z" fill="url(#land)" opacity="0.7" />
                <path d="M100 220 Q120 210 130 230 Q140 250 120 270 L90 260 Q80 240 100 220 Z" fill="url(#land)" opacity="0.6" />
                <path d="M40 130 Q60 120 80 140 Q90 160 70 180 L40 170 Q30 150 40 130 Z" fill="url(#land)" opacity="0.7" />
                <ellipse cx="150" cy="150" rx="145" ry="145" fill="none" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <ellipse key={i} cx="150" cy="150" rx={145 - i * 25} ry={145 - i * 25} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="0.3" />
                ))}
              </svg>
            </motion.div>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `calc(50% + ${p.x - 200}px)`,
                  top: `calc(50% + ${p.y - 200}px)`,
                }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: p.delay }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
