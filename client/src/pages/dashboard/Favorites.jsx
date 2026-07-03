import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import SectionTitle from '../../components/ui/SectionTitle';
import { useFavorites } from '../../context/FavoritesContext';
import { ListSkeleton, CardSkeleton } from '../../components/ui/Skeleton';
import { Heart, ExternalLink, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { favorites, loading, removeFavorite } = useFavorites();

  const handleRemove = async (id, title) => {
    try {
      await removeFavorite(id);
      toast.success(`Removed "${title}" from favorites`);
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="My Favorites" subtitle={`${favorites.length} saved items`} icon={Heart} />

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No favorites yet. Explore NASA content and save your favorites!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav, i) => (
            <motion.div
              key={fav._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassCard className="p-3 group relative overflow-hidden">
                <div className="relative">
                  {fav.url ? (
                    <img src={fav.url} alt={fav.title}
                      className="w-full h-44 object-cover rounded-xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-44 rounded-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                    {fav.url && (
                      <a href={fav.hdurl || fav.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                    )}
                    <button onClick={() => handleRemove(fav._id, fav.title)} className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="pt-3 px-1">
                  <h3 className="text-sm text-white font-semibold truncate">{fav.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase text-neon-blue font-medium">{fav.source}</span>
                    {fav.date && <span className="text-[10px] text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" />{fav.date}</span>}
                  </div>
                  {fav.explanation && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{fav.explanation.substring(0, 100)}...</p>}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
