import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cosmos-950 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-neon-blue/30 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-2 rounded-full border-2 border-neon-purple/40 border-t-transparent animate-spin" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-20 blur-sm" />
        </motion.div>
        <motion.p
          className="text-lg font-orbitron text-neon-blue neon-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COSMOSX
        </motion.p>
        <p className="text-sm text-gray-500 mt-2">Initializing space systems...</p>
      </div>
    </div>
  );
}
