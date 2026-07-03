import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Asterisk, AlertTriangle, Gauge, Ruler, Navigation, Shield, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AsteroidTracker() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await nasaAPI.getAsteroids();
        const todayData = data?.near_earth_objects;
        if (todayData) {
          const all = Object.values(todayData).flat();
          all.sort((a, b) => parseFloat(b.estimated_diameter?.kilometers?.estimated_diameter_max || 0) -
            parseFloat(a.estimated_diameter?.kilometers?.estimated_diameter_max || 0));
          setAsteroids(all.slice(0, 50));
        }
      } catch { toast.error('Failed to fetch asteroid data'); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getHazardColor = (hazardous) => hazardous ? 'text-red-400' : 'text-green-400';
  const formatKm = (val) => val ? `${parseFloat(val).toFixed(2)} km` : 'N/A';
  const formatSpeed = (val) => val ? `${parseFloat(val).toFixed(1)} km/s` : 'N/A';

  if (loading) return <div className="grid md:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Near-Earth Asteroid Tracker" subtitle="Real-time NEO data from NASA" icon={Asterisk} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {asteroids.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelected(a)}
              className={`glass rounded-xl p-4 glass-hover transition-all cursor-pointer ${selected?.id === a.id ? 'border-neon-blue/40 neon-glow' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{a.name}</h3>
                    {a.is_potentially_hazardous_asteroid && (
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> Ø {formatKm(a.estimated_diameter?.kilometers?.estimated_diameter_max)}</span>
                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {formatSpeed(a.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second)}</span>
                    <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {a.close_approach_data?.[0]?.miss_distance?.kilometers ? `${parseFloat(a.close_approach_data[0].miss_distance.kilometers).toFixed(0)} km` : 'N/A'}</span>
                  </div>
                </div>
                <div className={`shrink-0 ${getHazardColor(a.is_potentially_hazardous_asteroid)}`}>
                  {a.is_potentially_hazardous_asteroid ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          {selected ? (
            <GlassCard>
              <h3 className="font-orbitron font-bold text-white text-lg mb-4">{selected.name}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Diameter (max)</span>
                  <span className="text-white">{formatKm(selected.estimated_diameter?.kilometers?.estimated_diameter_max)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Diameter (min)</span>
                  <span className="text-white">{formatKm(selected.estimated_diameter?.kilometers?.estimated_diameter_min)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Velocity</span>
                  <span className="text-white">{formatSpeed(selected.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Miss Distance</span>
                  <span className="text-white">{selected.close_approach_data?.[0]?.miss_distance?.kilometers ? `${parseFloat(selected.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-400">Hazardous</span>
                  <span className={getHazardColor(selected.is_potentially_hazardous_asteroid)}>
                    {selected.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Close Approach</span>
                  <span className="text-white text-xs">{selected.close_approach_data?.[0]?.close_approach_date || 'N/A'}</span>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="text-center py-12">
                <Asterisk className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Select an asteroid to view details</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </motion.div>
  );
}
