import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, icon: Icon, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mb-8 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className="w-6 h-6 text-neon-blue" />}
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-400 ml-9 text-base">{subtitle}</p>}
    </motion.div>
  );
}
