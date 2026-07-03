import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { issAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Satellite, MapPin, Gauge, ArrowUp, Clock, RefreshCw } from 'lucide-react';

const WORLD_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';

function latLonToXY(lat, lon, w, h) {
  return [(lon + 180) * (w / 360), (90 - lat) * (h / 180)];
}

function drawLand(ctx, features, w, h) {
  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
  ctx.lineWidth = 0.3;
  features.forEach((feature) => {
    const coords = feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
    coords.forEach((polygon) => {
      polygon.forEach((ring) => {
        ctx.beginPath();
        ring.forEach(([lon, lat], i) => {
          const [x, y] = latLonToXY(lat, lon, w, h);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    });
  });
}

function drawGraticule(ctx, w, h) {
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
  ctx.lineWidth = 0.3;
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = (90 - lat) * (h / 180);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = (lon + 180) * (w / 360);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.lineWidth = 0.5;
  const ey = h / 2;
  ctx.beginPath(); ctx.moveTo(0, ey); ctx.lineTo(w, ey); ctx.stroke();
}

function drawOrbitPath(ctx, path, w, h) {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  path.forEach((p, i) => {
    const [x, y] = latLonToXY(p.latitude, p.longitude, w, h);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawISS(ctx, x, y) {
  const glow1 = ctx.createRadialGradient(x, y, 0, x, y, 30);
  glow1.addColorStop(0, 'rgba(0, 212, 255, 0.4)');
  glow1.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();

  const glow2 = ctx.createRadialGradient(x, y, 0, x, y, 12);
  glow2.addColorStop(0, 'rgba(0, 212, 255, 0.9)');
  glow2.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.fillStyle = glow2;
  ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();

  ctx.shadowColor = '#00d4ff';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}

export default function ISSTracker() {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [orbitPath, setOrbitPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetch(WORLD_URL).then((r) => r.json()).then((geo) => { worldRef.current = geo; }).catch(() => {});
  }, []);

  const fetchPosition = useCallback(async () => {
    try {
      const { data } = await issAPI.getPosition();
      setPosition(data);
      setLastUpdate(new Date());
    } catch { /* retry */ }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchPosition();
      setLoading(false);
    };
    init();
    const interval = setInterval(fetchPosition, 5000);
    return () => clearInterval(interval);
  }, [fetchPosition]);

  useEffect(() => {
    if (!position) return;
    setOrbitPath((prev) => {
      const next = [...prev, { latitude: position.latitude, longitude: position.longitude }];
      return next.length > 200 ? next.slice(-200) : next;
    });
  }, [position]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#050816';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#070b1a';
    ctx.fillRect(0, 0, w, h);

    const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
    oceanGrad.addColorStop(0, '#0a0e27');
    oceanGrad.addColorStop(0.5, '#0c1230');
    oceanGrad.addColorStop(1, '#0a0e27');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    if (worldRef.current) {
      drawLand(ctx, worldRef.current.features, w, h);
    }

    drawGraticule(ctx, w, h);
    drawOrbitPath(ctx, orbitPath, w, h);

    if (position) {
      const [x, y] = latLonToXY(position.latitude, position.longitude, w, h);
      drawISS(ctx, x, y);
    }
  }, [position, orbitPath]);

  const speedKmh = position?.velocity ? Math.round(position.velocity * 3.6) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="ISS Tracker" subtitle="Live International Space Station position" icon={Satellite} />

      {loading ? (
        <GlassCard className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </GlassCard>
      ) : (
        <div className="space-y-6">
          <GlassCard className="p-0 overflow-hidden">
            <canvas ref={canvasRef} width={900} height={450} className="w-full h-auto" style={{ aspectRatio: '2/1' }} />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-neon-blue">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <MapPin className="w-5 h-5 text-neon-blue mx-auto mb-1" />
              <p className="text-xs text-gray-500">Latitude</p>
              <p className="text-sm text-white font-semibold">{position?.latitude?.toFixed(4)}°</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <MapPin className="w-5 h-5 text-neon-purple mx-auto mb-1" />
              <p className="text-xs text-gray-500">Longitude</p>
              <p className="text-sm text-white font-semibold">{position?.longitude?.toFixed(4)}°</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <Gauge className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Speed</p>
              <p className="text-sm text-white font-semibold">{speedKmh ? `${speedKmh.toLocaleString()} km/h` : '—'}</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <ArrowUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Altitude</p>
              <p className="text-sm text-white font-semibold">{position?.altitude ? `${position.altitude.toFixed(1)} km` : '—'}</p>
            </GlassCard>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last update: {lastUpdate?.toLocaleTimeString() || '...'}
              &nbsp;(auto-refreshes every 5s)
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Day {position?.daynum ? Math.floor(position.daynum) : '—'}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
