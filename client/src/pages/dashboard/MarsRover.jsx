import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Camera, Filter, X, Heart, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFavorites } from '../../context/FavoritesContext';

const rovers = ['curiosity', 'perseverance'];
const cameras = {
  curiosity: ['FHAZ', 'RHAZ', 'MAST', 'CHEMCAM', 'MAHLI', 'MARDI', 'NAVCAM'],
  perseverance: ['EDL_RUC', 'EDL_DDC', 'EDL_SHC', 'EDL_LCAM', 'NAVCAM_LEFT', 'NAVCAM_RIGHT', 'MCZ_LEFT', 'MCZ_RIGHT', 'SHERLOC_WATSON', 'PIXL_MCC'],
};

export default function MarsRover() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rover, setRover] = useState('curiosity');
  const [camera, setCamera] = useState('');
  const defaultDate = () => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0]; };
  const [earthDate, setEarthDate] = useState(defaultDate());
  const [page, setPage] = useState(1);
  const [viewer, setViewer] = useState(null);
  const { addFavorite, isFavorite, removeFavorite, favorites } = useFavorites();

  const fetchWithFallback = useCallback(async (date, roverOpt, cameraOpt, pageNum) => {
    setLoading(true);
    const maxTries = 60;
    let attempts = 0;
    let currentDate = new Date(date);
    let photos = [];
    let foundDate = null;
    while (attempts < maxTries) {
      try {
        const ds = currentDate.toISOString().split('T')[0];
        const { data } = await nasaAPI.getMarsPhotos({ rover: roverOpt, earth_date: ds, camera: cameraOpt, page: pageNum });
        if (data && data.length > 0) {
          photos = data;
          foundDate = ds;
          if (ds !== earthDate) setEarthDate(ds);
          break;
        }
      } catch {}
      currentDate.setDate(currentDate.getDate() - 1);
      attempts++;
    }
    setPhotos(photos);
    if (foundDate && foundDate !== date) {
      toast(`Showing photos from ${foundDate} (latest available)`, { icon: '📸' });
    } else if (!foundDate) {
      toast.error('No photos found for this rover');
    }
    setLoading(false);
  }, [earthDate]);

  const fetchPhotos = useCallback(() => {
    fetchWithFallback(earthDate, rover, camera, page);
  }, [earthDate, rover, camera, page, fetchWithFallback]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleFavorite = async (photo) => {
    try {
      if (isFavorite(photo.id.toString())) {
        const fav = favorites.find((f) => f.nasaId === photo.id.toString());
        if (fav) await removeFavorite(fav._id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite({
          nasaId: photo.id.toString(),
          title: `Mars ${photo.rover?.name || ''} - ${photo.camera?.full_name || 'Unknown'}`,
          url: photo.img_src,
          mediaType: 'image',
          date: photo.earth_date,
          source: 'mars',
          metadata: { rover: photo.rover?.name, camera: photo.camera?.name, sol: photo.sol },
        });
        toast.success('Added to favorites!');
      }
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Mars Rover Explorer" subtitle="Browse photos from Mars rovers" icon={Camera} />

      <GlassCard className="mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Rover:</span>
          </div>
          {rovers.map((r) => (
            <button key={r} onClick={() => { setRover(r); setCamera(''); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${rover === r ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'glass text-gray-400 hover:text-white'}`}>
              {r}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 mx-2" />
          <select value={camera} onChange={(e) => { setCamera(e.target.value); setEarthDate(defaultDate()); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50">
            <option value="">All Cameras</option>
            {(cameras[rover] || []).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Date:</span>
            <input type="date" value={earthDate} onChange={(e) => { setEarthDate(e.target.value); setPage(1); }}
              className="w-36 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
          </div>
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No photos found. Try different filters.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, i) => (
              <motion.div key={photo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-3 group relative overflow-hidden">
                  <div className="relative">
                    <img src={photo.img_src} alt={`Mars ${photo.id}`}
                      className="w-full h-52 object-cover rounded-xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
                      <button onClick={() => setViewer(photo)} className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </button>
                      <button onClick={() => handleFavorite(photo)} className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                        <Heart className={`w-4 h-4 ${isFavorite(photo.id.toString()) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="pt-3 px-1">
                    <p className="text-xs text-gray-500">
                      {photo.camera?.full_name || 'Unknown'} &middot; Sol {photo.sol ?? 'N/A'} &middot; {photo.earth_date || 'Unknown date'}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/5 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="flex items-center text-sm text-gray-500">Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-white hover:bg-white/5 transition-all">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {viewer && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewer(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setViewer(null)} className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
              <img src={viewer.img_src} alt="Mars" className="w-full h-full object-contain rounded-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
