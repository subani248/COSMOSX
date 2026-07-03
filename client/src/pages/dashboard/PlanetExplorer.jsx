import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Globe, Sun, Ruler, Clock, RotateCw, Thermometer, Moon, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const PLANETS = [
  {
    id: 'mercury', name: 'Mercury', order: 1,
    diameter: '4,879 km', distSun: '57.9 million km', orbit: '88 days',
    day: '58.6 Earth days', moons: '0', temp: '-180 to 430°C',
    type: 'Terrestrial', description: 'The smallest planet and closest to the Sun. Its cratered surface resembles our Moon.',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'venus', name: 'Venus', order: 2,
    diameter: '12,104 km', distSun: '108.2 million km', orbit: '225 days',
    day: '243 Earth days', moons: '0', temp: '462°C (avg)',
    type: 'Terrestrial', description: 'The hottest planet due to its thick CO₂ atmosphere. Rotates backwards compared to most planets.',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    id: 'earth', name: 'Earth', order: 3,
    diameter: '12,742 km', distSun: '149.6 million km', orbit: '365.25 days',
    day: '24 hours', moons: '1', temp: '-89 to 57°C',
    type: 'Terrestrial', description: 'Our home — the only known planet with liquid water on its surface and life.',
    color: 'from-blue-500 to-green-500',
  },
  {
    id: 'mars', name: 'Mars', order: 4,
    diameter: '6,779 km', distSun: '227.9 million km', orbit: '687 days',
    day: '24.6 hours', moons: '2', temp: '-140 to 20°C',
    type: 'Terrestrial', description: 'The Red Planet. Home to the tallest mountain (Olympus Mons) and deepest canyon (Valles Marineris).',
    color: 'from-red-500 to-red-700',
  },
  {
    id: 'jupiter', name: 'Jupiter', order: 5,
    diameter: '139,820 km', distSun: '778.5 million km', orbit: '11.86 years',
    day: '9.93 hours', moons: '95', temp: '-110°C (cloud top)',
    type: 'Gas Giant', description: 'The largest planet. Its Great Red Spot is a storm larger than Earth that has raged for centuries.',
    color: 'from-orange-400 to-yellow-600',
  },
  {
    id: 'saturn', name: 'Saturn', order: 6,
    diameter: '116,460 km', distSun: '1.43 billion km', orbit: '29.46 years',
    day: '10.7 hours', moons: '146', temp: '-140°C (cloud top)',
    type: 'Gas Giant', description: 'Famous for its spectacular ring system made of ice and rock particles. The least dense planet.',
    color: 'from-yellow-300 to-amber-600',
  },
  {
    id: 'uranus', name: 'Uranus', order: 7,
    diameter: '50,724 km', distSun: '2.87 billion km', orbit: '84 years',
    day: '17.2 hours', moons: '27', temp: '-195°C',
    type: 'Ice Giant', description: 'Rotates on its side with an axial tilt of 98°. Its blue color comes from methane in its atmosphere.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'neptune', name: 'Neptune', order: 8,
    diameter: '49,244 km', distSun: '4.50 billion km', orbit: '164.8 years',
    day: '16.1 hours', moons: '16', temp: '-200°C',
    type: 'Ice Giant', description: 'The windiest planet with gusts reaching 2,100 km/h. Its vivid blue color is due to methane absorption.',
    color: 'from-blue-600 to-indigo-700',
  },
];

const LOCAL_IMAGES = {
  mercury: 'Mercury.jpg',
  venus: 'Venus.png',
  earth: 'earth.jpg',
  mars: 'Mars.jpg',
  jupiter: 'jupiter.jpg',
  saturn: 'saturn.jpg',
  uranus: 'uranus.jpg',
  neptune: 'neptune.jpg',
};

const PLANET_QUERIES = {
  mercury: 'Mercury planet NASA',
  venus: 'Venus planet NASA',
  earth: 'Earth planet NASA',
  mars: 'Mars planet NASA',
  jupiter: 'Jupiter planet NASA',
  saturn: 'Saturn planet NASA',
  uranus: 'Uranus planet NASA',
  neptune: 'Neptune planet NASA',
};

export default function PlanetExplorer() {
  const [selected, setSelected] = useState(0);
  const [images, setImages] = useState({});
  const [localFailed, setLocalFailed] = useState({});
  const planet = PLANETS[selected];

  const localSrc = `/images/planets/${LOCAL_IMAGES[planet.id]}`;
  const useLocal = !localFailed[planet.id];
  const imgSrc = useLocal ? localSrc : images[planet.id];
  const hasImg = useLocal || !!images[planet.id];

  useEffect(() => {
    PLANETS.forEach(async (p) => {
      if (images[p.id]) return;
      try {
        const { data } = await nasaAPI.search({ q: PLANET_QUERIES[p.id] });
        const items = data?.collection?.items || [];
        const img = items.find((i) => i.links?.[0]?.href && i.data?.[0]?.media_type === 'image');
        if (img) {
          setImages((prev) => ({ ...prev, [p.id]: img.links[0].href }));
        }
      } catch { /* silent */ }
    });
  }, []);

  const prev = () => setSelected((s) => (s - 1 + PLANETS.length) % PLANETS.length);
  const next = () => setSelected((s) => (s + 1) % PLANETS.length);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Planet Explorer" subtitle="Explore our solar system" icon={Globe} />

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-6 px-1">
        {PLANETS.map((p, i) => (
          <button key={p.id} onClick={() => setSelected(i)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              i === selected
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                : 'glass text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={planet.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col">
                  <div className={`relative flex-1 min-h-[300px] bg-gradient-to-br ${planet.color} flex items-center justify-center`}>
                    {hasImg ? (
                      <img src={imgSrc} alt={planet.name}
                        className="w-full h-full object-cover absolute inset-0" loading="lazy"
                        onError={() => {
                          if (useLocal) {
                            setLocalFailed((p) => ({ ...p, [planet.id]: true }));
                          }
                        }} />
                    ) : (
                      <Globe className="w-24 h-24 text-white/30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h2 className="text-4xl font-orbitron font-bold text-white drop-shadow-lg">{planet.name}</h2>
                        <p className="text-base text-white/70">{planet.type}</p>
                      </div>
                      <span className="text-sm text-white/50">#{planet.order} from Sun</span>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-2 space-y-3">
                <GlassCard className="p-4 flex-1">
                  <p className="text-base text-gray-300 leading-relaxed">{planet.description}</p>
                </GlassCard>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-4 text-center">
                    <Ruler className="w-5 h-5 text-neon-blue mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Diameter</p>
                    <p className="text-sm text-white font-semibold">{planet.diameter}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm text-white font-semibold">{planet.distSun}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Orbit</p>
                    <p className="text-sm text-white font-semibold">{planet.orbit}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <RotateCw className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Day Length</p>
                    <p className="text-sm text-white font-semibold">{planet.day}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Moon className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Moons</p>
                    <p className="text-sm text-white font-semibold">{planet.moons}</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Thermometer className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-sm text-white font-semibold">{planet.temp}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={prev} className="flex items-center gap-1 text-base text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" /> {PLANETS[(selected - 1 + PLANETS.length) % PLANETS.length].name}
              </button>
              <button onClick={() => window.open(`https://solarsystem.nasa.gov/planets/${planet.id}/overview/`, '_blank')}
                className="flex items-center gap-1 text-sm text-neon-blue hover:underline">
                NASA facts <ExternalLink className="w-3 h-3" />
              </button>
              <button onClick={next} className="flex items-center gap-1 text-base text-gray-400 hover:text-white transition-colors">
                {PLANETS[(selected + 1) % PLANETS.length].name} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
