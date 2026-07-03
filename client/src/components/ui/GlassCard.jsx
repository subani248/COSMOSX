import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', glow = false, delay = 0, onClick, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      onClick={onClick}
      className={`glass rounded-2xl p-6 transition-all duration-300
        ${hover ? 'glass-hover cursor-pointer' : ''}
        ${glow ? 'neon-glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </motion.div>
  );
}
