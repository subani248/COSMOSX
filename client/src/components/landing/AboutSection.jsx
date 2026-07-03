import { motion } from 'framer-motion';
import { Rocket, Cpu, Stars, Zap } from 'lucide-react';

const stats = [
  { icon: Rocket, label: 'NASA APIs', value: '5+' },
  { icon: Cpu, label: 'AI Powered', value: 'Gemini' },
  { icon: Stars, label: 'Cosmic Content', value: 'Unlimited' },
  { icon: Zap, label: 'Performance', value: 'Lightning' },
];

export default function AboutSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">Explorers</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              CosmosX combines the power of NASA's open APIs with Google's Gemini AI to create 
              the most immersive space exploration experience on the web. Whether you're an 
              amateur astronomer, a student, or a seasoned space enthusiast, CosmosX brings 
              the universe to your fingertips.
            </p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Track near-Earth asteroids in real-time, browse Mars rover photos, explore 
              Earth from orbit, and let AI explain the cosmos to you. All wrapped in a 
              secure, enterprise-grade application with a stunning futuristic interface.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <s.icon className="w-6 h-6 text-neon-blue mx-auto mb-2" />
                  <div className="text-2xl font-orbitron font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>


        </div>
      </div>
    </section>
  );
}
