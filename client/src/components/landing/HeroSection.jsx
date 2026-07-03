import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';
import FloatingEarth from './FloatingEarth';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-blue/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-neon-blue" />
            <span className="text-xs font-orbitron text-neon-blue">AI-Powered Space Exploration</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-black leading-tight mb-6">
            <span className="text-white">Explore the</span>{' '}
            <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
              Cosmos
            </span>
            <br />
            <span className="text-white">Like Never Before</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Harness the power of NASA APIs and Gemini AI to explore Mars, track asteroids, 
            discover galaxies, and unlock the secrets of the universe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg neon-glow hover:shadow-[0_0_40px_rgba(0,212,255,0.3)] transition-all duration-300"
              >
                Launch Mission <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-white font-semibold text-lg hover:border-neon-blue/40 transition-all duration-300"
              >
                Mission Control <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>


        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:flex items-center justify-center"
        >
          <FloatingEarth />
        </motion.div>
      </div>
    </section>
  );
}
