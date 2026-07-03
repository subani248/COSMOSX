import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Calendar, Download, Heart, Maximize2, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFavorites } from '../../context/FavoritesContext';

const quickLinks = [
  { to: '/dashboard/mars', label: 'Mars Rover', color: 'from-orange-500 to-red-500', emoji: '🚀' },
  { to: '/dashboard/asteroids', label: 'Asteroid Tracker', color: 'from-yellow-500 to-orange-500', emoji: '☄️' },
  { to: '/dashboard/earth', label: 'Earth Imagery', color: 'from-green-400 to-emerald-500', emoji: '🌍' },
  { to: '/dashboard/search', label: 'NASA Search', color: 'from-neon-blue to-cyan-500', emoji: '🔭' },
  { to: '/dashboard/ai', label: 'AI Assistant', color: 'from-neon-purple to-pink-500', emoji: '🤖' },
  { to: '/dashboard/favorites', label: 'Favorites', color: 'from-pink-500 to-rose-500', emoji: '⭐' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { addFavorite, isFavorite, removeFavorite, favorites } = useFavorites();
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const { data } = await nasaAPI.getAPOD();
        setApod(data);
      } catch {
        setApod(null);
      } finally { setLoading(false); }
    };
    fetchAPOD();
  }, []);

  const handleFavorite = async () => {
    if (!apod) return;
    try {
      if (isFavorite(apod.url)) {
        const fav = favorites.find((f) => f.nasaId === apod.url);
        if (fav) await removeFavorite(fav._id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          nasaId: apod.url,
          title: apod.title,
          url: apod.url,
          hdurl: apod.hdurl,
          mediaType: apod.media_type,
          explanation: apod.explanation,
          date: apod.date,
          source: 'apod',
        });
        toast.success('Added to favorites!');
      }
    } catch { toast.error('Failed to update favorites'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle
        title="Mission Control"
        subtitle={`Welcome back, Commander ${user?.name?.split(' ')[0] || 'User'}`}
        icon={Calendar}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard glow className="overflow-hidden p-0">
            {loading ? (
              <div className="p-6"><CardSkeleton /></div>
            ) : apod ? (
              <div>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-t from-cosmos-950 via-transparent to-transparent z-10 ${imageLoaded ? 'opacity-60' : 'opacity-0'}`} />
                  {!imageLoaded && <div className="skeleton h-[400px] w-full" />}
                  <img
                    src={apod.hdurl || apod.url}
                    alt={apod.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-[400px] object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button onClick={handleFavorite} className="p-2 rounded-xl glass hover:bg-white/10 transition-all">
                      <Heart className={`w-5 h-5 ${isFavorite(apod.url) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl glass hover:bg-white/10 transition-all">
                      <Download className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-orbitron font-bold text-white">{apod.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5" /> {apod.date}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{apod.explanation}</p>
                  <Link to="/dashboard/ai" state={{ imageContext: apod }} className="mt-4 inline-flex items-center gap-1 text-sm text-neon-blue hover:text-neon-blue/80 transition-colors">
                    Explain with AI <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500">Unable to load APOD. Check your NASA API key.</p>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-orbitron text-lg font-bold text-white mb-4">Quick Launch</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to}>
                  <div className="flex items-center gap-3 p-3 rounded-xl glass glass-hover transition-all">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center text-lg`}>
                      {link.emoji}
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-orbitron text-sm font-bold text-white mb-3">Mission Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Favorites</span>
                <span className="text-white font-medium">{favorites.length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-400">Role</span>
                <span className="text-neon-blue font-medium capitalize">{user?.role || 'User'}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
