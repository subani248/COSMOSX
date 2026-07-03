import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Search, Sparkles, Calendar, Globe, Star, Ruler, Thermometer, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const METHOD_COLORS = {
  'Transit': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Radial Velocity': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Imaging': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Microlensing': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Astrometry': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function Exoplanets() {
  const [planets, setPlanets] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const perPage = 30;

  const fetchPlanets = useCallback(async (p, q) => {
    setLoading(true);
    try {
      const params = { page: p, perPage };
      if (q) params.search = q;
      const { data } = await api.get('/exoplanets', { params });
      setPlanets(data.planets || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load exoplanets');
      setPlanets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanets(page, query);
  }, [page, query, fetchPlanets]);

  const totalPages = Math.ceil(total / perPage);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const f = (v) => v != null ? parseFloat(v) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Exoplanet Explorer" subtitle="Discover worlds beyond our solar system" icon={Sparkles} />

      <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by planet or star name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-colors" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-neon-blue/20 text-neon-blue rounded-xl text-sm font-medium border border-neon-blue/30 hover:bg-neon-blue/30 transition-all">
          Search
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {loading ? 'Loading...' : `${total.toLocaleString()} exoplanets found`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg glass text-gray-400 hover:text-white disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
        </div>
      ) : planets.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No exoplanets found. Try a different search.</p>
        </GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {planets.map((pl, i) => {
              const orbper = f(pl.pl_orbper);
              const rade = f(pl.pl_rade);
              const bmasse = f(pl.pl_bmasse);
              const eqt = f(pl.pl_eqt);
              const dist = f(pl.sy_dist);
              const dens = f(pl.pl_dens);
              const orbsmax = f(pl.pl_orbsmax);
              const insol = f(pl.pl_insol);
              const ratror = f(pl.pl_ratror);
              return (
              <motion.div key={pl.pl_name + i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                <GlassCard className={`p-5 cursor-pointer transition-all border ${selected?.pl_name === pl.pl_name ? 'border-neon-blue/50' : 'border-transparent'} hover:border-white/10`}
                  onClick={() => setSelected(selected?.pl_name === pl.pl_name ? null : pl)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 mr-2">
                      <h3 className="text-base font-orbitron font-bold text-white truncate">{pl.pl_name}</h3>
                      <p className="text-xs text-gray-500 truncate">{pl.hostname || 'Unknown star'}</p>
                    </div>
                    {pl.discoverymethod && (
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium border ${METHOD_COLORS[pl.discoverymethod] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                        {pl.discoverymethod}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {pl.disc_year && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-3 h-3" /> {pl.disc_year}
                      </div>
                    )}
                    {orbper && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Globe className="w-3 h-3" /> {orbper.toFixed(1)} days
                      </div>
                    )}
                    {rade && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Ruler className="w-3 h-3" /> {rade.toFixed(2)} R<sub>⊕</sub>
                      </div>
                    )}
                    {eqt && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Thermometer className="w-3 h-3" /> {eqt.toFixed(0)} K
                      </div>
                    )}
                    {dist && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3 h-3" /> {dist.toFixed(1)} pc
                      </div>
                    )}
                    {bmasse && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Star className="w-3 h-3" /> {bmasse.toFixed(2)} M<sub>⊕</sub>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {selected?.pl_name === pl.pl_name && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="h-px bg-white/10 my-3" />
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {dens != null && <div className="text-gray-400">Density: <span className="text-white">{dens.toFixed(2)} g/cm³</span></div>}
                          {orbsmax != null && <div className="text-gray-400">Semi-major axis: <span className="text-white">{orbsmax.toFixed(4)} AU</span></div>}
                          {insol != null && <div className="text-gray-400">Insolation: <span className="text-white">{insol.toFixed(2)} F<sub>⊕</sub></span></div>}
                          {ratror != null && <div className="text-gray-400">Radius ratio: <span className="text-white">{ratror.toFixed(4)}</span></div>}
                          {pl.st_spectype && <div className="text-gray-400">Spectral type: <span className="text-white">{pl.st_spectype}</span></div>}
                          {pl.disc_facility && <div className="text-gray-400">Facility: <span className="text-white">{pl.disc_facility}</span></div>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(1)}
            className="px-3 py-1.5 text-xs glass text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition-all">
            First
          </button>
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-xs glass text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition-all">
            <ChevronLeft className="w-3 h-3 inline" /> Prev
          </button>
          <span className="text-xs text-gray-500 px-3">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs glass text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition-all">
            Next <ChevronRight className="w-3 h-3 inline" />
          </button>
          <button disabled={page >= totalPages} onClick={() => setPage(totalPages)}
            className="px-3 py-1.5 text-xs glass text-gray-400 hover:text-white disabled:opacity-30 rounded-lg transition-all">
            Last
          </button>
        </div>
      )}
    </motion.div>
  );
}
