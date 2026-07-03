import { motion } from 'framer-motion';
import { Camera, Globe, Asterisk, Bot, Star, BookOpen, Search } from 'lucide-react';

const features = [
  { icon: Camera, title: 'Mars Rover Explorer', desc: 'Browse photos from Curiosity, Opportunity, and Spirit rovers with full-screen viewer.', color: 'from-orange-500 to-red-500' },
  { icon: Asterisk, title: 'Asteroid Tracker', desc: 'Monitor near-Earth objects with real-time speed, size, distance, and hazard data.', color: 'from-yellow-500 to-orange-500' },
  { icon: Globe, title: 'Earth Imagery', desc: 'View stunning satellite imagery of any location on Earth by coordinates.', color: 'from-green-400 to-emerald-500' },
  { icon: Bot, title: 'AI Space Assistant', desc: 'Ask Gemini AI anything about astronomy, planets, stars, galaxies, and black holes.', color: 'from-neon-purple to-pink-500' },
  { icon: Star, title: 'Astronomy Picture of the Day', desc: 'Discover NASA\'s daily cosmic masterpiece with HD images and AI explanations.', color: 'from-neon-blue to-cyan-500' },
  { icon: BookOpen, title: 'Space Journal', desc: 'Document your cosmic discoveries with rich notes and attached NASA imagery.', color: 'from-indigo-500 to-neon-purple' },
  { icon: Search, title: 'NASA Content Search', desc: 'Explore NASA\'s vast media library of planets, galaxies, nebulae, and missions.', color: 'from-teal-400 to-cyan-500' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function FeatureCards() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
            Mission{' '}
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">Capabilities</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to explore the cosmos, powered by NASA and Gemini AI
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={item} whileHover={{ y: -8, scale: 1.02 }} className="group">
              <div className="glass rounded-2xl p-6 h-full glass-hover relative overflow-hidden">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} p-2.5 mb-4 neon-glow`}>
                  <f.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg font-orbitron font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
