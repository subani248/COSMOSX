import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { moonAPI, nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Moon, Calendar, ArrowLeft, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../../context/FavoritesContext';

export default function MoonPhase() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moonImages, setMoonImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const { addFavorite, isFavorite, removeFavorite, favorites } = useFavorites();

  const selected = new Date(date + 'T12:00:00');

  const fetchPhase = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await moonAPI.getPhase({ date });
      setData(res);
    } catch { toast.error('Failed to fetch moon data'); } finally { setLoading(false); }
  }, [date]);

  const fetchImages = useCallback(async () => {
    setImagesLoading(true);
    try {
      const year = selected.getFullYear();
      const { data } = await nasaAPI.search({ q: 'moon', year_start: year, year_end: year });
      const items = data?.collection?.items || [];
      setMoonImages(items.filter((item) => item?.data?.[0]?.media_type === 'image').slice(0, 12));
    } catch { /* silently fail */ } finally { setImagesLoading(false); }
  }, [date]);

  useEffect(() => { fetchPhase(); fetchImages(); }, [fetchPhase, fetchImages]);

  const adjustDay = (n) => {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + n);
    setDate(d.toISOString().split('T')[0]);
  };

  const isToday = date === todayStr;

  const phase = data?.phase;
  const visual = data?.moon_visual;
  const special = data?.special_moon;

  const handleFavorite = async (item) => {
    const d = item.data[0];
    const link = item.links?.[0]?.href || '';
    const nasaId = d.nasa_id || link;
    try {
      if (isFavorite(nasaId)) {
        const fav = favorites.find((f) => f.nasaId === nasaId);
        if (fav) await removeFavorite(fav._id);
      } else {
        await addFavorite({ nasaId, title: d.title, url: link, mediaType: 'image', date: d.date_created, explanation: d.description, source: 'moon' });
      }
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Moon Phase" subtitle="Powered by FreeAstroAPI & NASA" icon={Moon} />

      <div className="flex items-center justify-center gap-2 mb-6">
        <button onClick={() => adjustDay(-1)} className="p-2 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-48 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-blue/50 [color-scheme:dark]" />
        </div>
        <button onClick={() => adjustDay(1)} className="p-2 rounded-xl glass text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      {!isToday && (
        <div className="text-center -mt-4 mb-6">
          <button onClick={() => setDate(todayStr)} className="text-xs text-neon-blue hover:underline">Back to today</button>
        </div>
      )}

      {loading ? (
        <div className="max-w-lg mx-auto"><GlassCard className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </GlassCard></div>
      ) : data ? (
        <div className="max-w-lg mx-auto space-y-6 mb-10">
          <GlassCard className="text-center py-8">
            {phase && (
              <>
                <h2 className="text-2xl font-orbitron font-bold text-white">{phase.name}</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </>
            )}
            {special && (special.is_supermoon || special.is_blood_moon || special.is_blue_moon) && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {special.is_supermoon && <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium">Supermoon</span>}
                {special.is_blood_moon && <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-medium">Blood Moon</span>}
                {special.is_blue_moon && <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">Blue Moon</span>}
              </div>
            )}
          </GlassCard>

          {visual?.svg && (
            <div className="flex justify-center" dangerouslySetInnerHTML={{
              __html: visual.svg.replace('<svg', '<svg class="w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_0_40px_rgba(200,200,255,0.2)]"')
            }} />
          )}

          {phase && (
            <GlassCard>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Illumination</p>
                  <p className="text-lg text-white font-semibold">{(phase.illumination * 100).toFixed(1)}%</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Age</p>
                  <p className="text-lg text-white font-semibold">{phase.age_days?.toFixed(1)} days</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Distance</p>
                  <p className="text-lg text-white font-semibold">{phase.distance_km ? `${(phase.distance_km / 1000).toFixed(0)} km` : '—'}</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-lg text-white font-semibold capitalize">{phase.is_waxing ? 'Waxing' : 'Waning'}</p>
                </div>
              </div>
              {data.zodiac && (
                <div className="mt-4 glass rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Moon Sign</p>
                  <p className="text-sm text-white font-semibold">{data.zodiac.sign} ({data.zodiac.degree}°)</p>
                </div>
              )}
            </GlassCard>
          )}
        </div>
      ) : (
        <div className="max-w-lg mx-auto"><GlassCard className="text-center py-16">
          <Moon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Could not load moon data</p>
        </GlassCard></div>
      )}

      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center gap-2">
        <Moon className="w-5 h-5 text-neon-blue" /> Real Moon Photos — {selected.getFullYear()}
      </h3>

      {imagesLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : moonImages.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {moonImages.map((item, i) => {
            const d = item.data?.[0];
            const link = item.links?.[0]?.href;
            const nasaId = d?.nasa_id || link;
            if (!link || !d) return null;
            return (
              <motion.div key={nasaId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <GlassCard className="p-3 group relative overflow-hidden">
                  <div className="relative">
                    <img src={link} alt={d.title} className="w-full h-44 object-cover rounded-xl" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                      <button onClick={() => handleFavorite(item)} className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                        <Heart className={`w-4 h-4 ${isFavorite(nasaId) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-3 px-1">
                    <h3 className="text-sm text-white font-semibold truncate">{d.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description?.substring(0, 100)}...</p>
                    {d.date_created && <p className="text-xs text-gray-600 mt-1"><Calendar className="w-3 h-3 inline mr-1" />{new Date(d.date_created).toLocaleDateString()}</p>}
                    {d.center && <span className="text-[10px] text-neon-blue mt-1 inline-block">{d.center}</span>}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass rounded-2xl">
          <Moon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No NASA moon photos found for {selected.getFullYear()}</p>
        </div>
      )}
    </motion.div>
  );
}
