import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { nasaAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Globe, Search, MapPin, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EarthImagery() {
  const [lat, setLat] = useState('28.5729');
  const [lon, setLon] = useState('-80.6490');
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const fetchImagery = useCallback(async () => {
    if (!lat || !lon) { toast.error('Latitude and longitude required'); return; }
    setLoading(true);
    setImageUrl(null);
    setMetadata(null);
    try {
      const { data } = await nasaAPI.getEarthImagery({ lat, lon, date });
      if (typeof data === 'string') {
        setImageUrl(data);
      } else if (data.url) {
        setImageUrl(data.url);
        setMetadata(data);
      }
    } catch { toast.error('Failed to fetch Earth imagery. Try different coordinates.'); } finally { setLoading(false); }
  }, [lat, lon, date]);

  const addToFavorites = () => {
    if (imageUrl) {
      toast.success('Image URL copied to clipboard!');
      navigator.clipboard.writeText(imageUrl);
    }
  };

  const presets = [
    { label: 'Kennedy Space Center', lat: '28.5729', lon: '-80.6490' },
    { label: 'Grand Canyon', lat: '36.1069', lon: '-112.1129' },
    { label: 'Pyramids of Giza', lat: '29.9792', lon: '31.1342' },
    { label: 'Sydney Opera House', lat: '-33.8568', lon: '151.2153' },
    { label: 'Tokyo', lat: '35.6762', lon: '139.6503' },
    { label: 'London', lat: '51.5074', lon: '-0.1278' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Earth Imagery" subtitle="Satellite imagery by coordinates" icon={Globe} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-orbitron font-bold text-white mb-4">Coordinates</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Latitude</label>
                <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Longitude</label>
                <input type="number" step="any" value={lon} onChange={(e) => setLon(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Date (optional)</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
              </div>
              <button onClick={fetchImagery} disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Search className="w-4 h-4" /> Capture Image</>}
              </button>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-orbitron font-bold text-white mb-3 text-sm">Quick Locations</h3>
            <div className="space-y-1.5">
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setLat(p.lat); setLon(p.lon); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <MapPin className="w-3 h-3 inline mr-2 text-neon-blue" />
                  {p.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className={!imageUrl ? 'min-h-[300px] flex items-center justify-center' : ''}>
            {loading ? (
              <div className="skeleton h-[400px] rounded-xl" />
            ) : imageUrl ? (
              <div className="relative group">
                <img src={imageUrl} alt="Earth imagery"
                  className="w-full h-auto rounded-xl"
                  onError={() => { setImageUrl(null); toast.error('Failed to load image'); }}
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={addToFavorites} className="p-2 rounded-lg glass hover:bg-white/20 transition-all">
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
                {metadata && (
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>Latitude: {lat} &middot; Longitude: {lon} &middot; Date: {metadata.date || date}</p>
                    <p className="text-neon-blue/60">{metadata.service}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Enter coordinates and capture to view satellite imagery</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
