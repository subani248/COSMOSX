import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Search, Heart, ExternalLink, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../../context/FavoritesContext';

const suggestions = ['Galaxy', 'Nebula', 'Black Hole', 'Mars', 'Saturn', 'Andromeda', 'Supernova', 'Exoplanet', 'Space Station', 'Solar Flare'];

export default function NasaSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { addFavorite, isFavorite, removeFavorite, favorites } = useFavorites();

  useEffect(() => { handleSearch('Galaxy'); }, []);

  const handleSearch = useCallback(async (q, p = 1) => {
    if (!q) return;
    setLoading(true);
    setQuery(q);
    setPage(p);
    try {
      const { data } = await nasaAPI.search({ q, page: p });
      const items = data?.collection?.items || [];
      setResults(items.filter((item) => item?.data?.[0]?.media_type === 'image'));
    } catch { toast.error('Search failed'); } finally { setLoading(false); }
  }, []);

  const handleFavorite = async (item) => {
    const data = item.data[0];
    const link = item.links?.[0]?.href || '';
    const nasaId = data.nasa_id || link;
    try {
      if (isFavorite(nasaId)) {
        const fav = favorites.find((f) => f.nasaId === nasaId);
        if (fav) await removeFavorite(fav._id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          nasaId,
          title: data.title,
          url: link,
          mediaType: 'image',
          date: data.date_created,
          explanation: data.description,
          source: 'search',
        });
        toast.success('Added to favorites!');
      }
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="NASA Content Search" subtitle="Explore NASA's media library" icon={Search} />

      <GlassCard className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Search planets, galaxies, nebulae, missions..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50"
            />
          </div>
          <button onClick={() => handleSearch(query)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
            Search
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSearch(s)}
              className="px-3 py-1.5 rounded-lg glass text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : results.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item, i) => {
              const data = item.data?.[0];
              const link = item.links?.[0]?.href;
              const nasaId = data?.nasa_id || link;
              if (!link || !data) return null;
              return (
                <motion.div key={nasaId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <GlassCard className="p-3 group relative overflow-hidden">
                    <div className="relative">
                      <img src={link} alt={data.title} className="w-full h-44 object-cover rounded-xl" loading="lazy" />
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
                      <h3 className="text-sm text-white font-semibold truncate">{data.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.description?.substring(0, 100)}...</p>
                      {data.date_created && <p className="text-xs text-gray-600 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(data.date_created).toLocaleDateString()}</p>}
                      {data.center && <span className="text-[10px] text-neon-blue mt-1 inline-block">{data.center}</span>}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => handleSearch(query, page - 1)} disabled={page === 1}
              className="px-6 py-3 rounded-xl glass text-white hover:bg-white/5 disabled:opacity-30 transition-all">Previous</button>
            <span className="flex items-center text-sm text-gray-500">Page {page}</span>
            <button onClick={() => handleSearch(query, page + 1)}
              className="px-6 py-3 rounded-xl glass text-white hover:bg-white/5 transition-all">Next</button>
          </div>
        </>
      ) : query ? (
        <div className="text-center py-20"><Search className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-500">No results found</p></div>
      ) : (
        <div className="text-center py-20"><Search className="w-16 h-16 text-gray-600 mx-auto mb-4" /><p className="text-gray-500">Search for NASA's vast media library</p></div>
      )}
    </motion.div>
  );
}
