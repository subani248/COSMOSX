import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/10 to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 md:p-16 neon-glow relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-purple/5 to-neon-pink/10" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[3px]"
            >
              <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-neon-blue" />
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Ready to Explore the{' '}
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Universe
              </span>
              ?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join CosmosX today and embark on an AI-powered journey through the cosmos. 
              Your mission awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-lg neon-glow hover:shadow-[0_0_50px_rgba(0,212,255,0.4)] transition-all duration-300"
                >
                  Launch Your Mission <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-white font-semibold text-lg hover:border-neon-blue/40 transition-all duration-300"
                >
                  Return to Base <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
