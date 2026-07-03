import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solarAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Sun, Zap, Wind, AlertTriangle, Activity, Clock, Flame, Orbit, Globe2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'flares', label: 'Solar Flares', icon: Flame },
  { key: 'cmes', label: 'CMEs', icon: Orbit },
  { key: 'gsts', label: 'Geomagnetic Storms', icon: Globe2 },
];

const FLARE_CLASS_COLORS = {
  X: 'bg-red-500/20 text-red-400 border-red-500/30',
  M: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  C: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  A: 'bg-green-500/20 text-green-400 border-green-500/30',
};

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SolarActivity() {
  const [tab, setTab] = useState('flares');
  const [flares, setFlares] = useState([]);
  const [cmes, setCmes] = useState([]);
  const [gsts, setGsts] = useState([]);
  const [loading, setLoading] = useState({ flares: true, cmes: true, gsts: true });

  const load = useCallback(async (key, fetcher) => {
    try {
      const { data } = await fetcher();
      if (key === 'flares') setFlares(data || []);
      else if (key === 'cmes') setCmes(data || []);
      else setGsts(data || []);
    } catch {
      if (key === 'flares') setFlares([]);
      else if (key === 'cmes') setCmes([]);
      else setGsts([]);
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  }, []);

  useEffect(() => {
    load('flares', () => solarAPI.getFlares());
    load('cmes', () => solarAPI.getCMEs());
    load('gsts', () => solarAPI.getGSTs());
  }, [load]);

  const recentFlares = flares.slice(0, 20);
  const xCount = flares.filter((f) => f.classType && f.classType.startsWith('X')).length;
  const mCount = flares.filter((f) => f.classType && f.classType.startsWith('M')).length;
  const totalEvents = flares.length + cmes.length + gsts.length;
  const activityLevel = xCount > 0 ? 'High' : mCount > 5 ? 'Moderate' : totalEvents > 5 ? 'Low' : 'Quiet';
  const activityColor = xCount > 0 ? 'text-red-400' : mCount > 5 ? 'text-orange-400' : totalEvents > 5 ? 'text-yellow-400' : 'text-green-400';
  const activityBar = xCount > 0 ? 'w-3/4' : mCount > 5 ? 'w-1/2' : totalEvents > 5 ? 'w-1/3' : 'w-1/6';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Solar Activity" subtitle="Live space weather from NASA DONKI" icon={Sun} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <GlassCard className="p-4 text-center">
          <Sun className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          {loading.flares && loading.cmes && loading.gsts ? (
            <>
              <div className="h-5 w-16 skeleton rounded mx-auto mb-1" />
              <div className="h-3 w-20 skeleton rounded mx-auto mb-1" />
              <div className="w-full h-1 skeleton rounded-full" />
            </>
          ) : (
            <>
              <p className={`text-lg font-orbitron font-bold ${activityColor}`}>{activityLevel}</p>
              <p className="text-[10px] text-gray-500">Activity Level</p>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className={`h-full rounded-full ${xCount > 0 ? 'bg-red-500' : mCount > 5 ? 'bg-orange-500' : totalEvents > 5 ? 'bg-yellow-500' : 'bg-green-500'} ${activityBar} transition-all`} />
              </div>
            </>
          )}
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          {loading.flares ? (
            <><div className="h-5 w-8 skeleton rounded mx-auto mb-1" /><div className="h-3 w-16 skeleton rounded mx-auto" /></>
          ) : (
            <><p className="text-lg font-orbitron font-bold text-white">{flares.length}</p><p className="text-[10px] text-gray-500">Flares (7d)</p></>
          )}
          {!loading.flares && xCount > 0 && <p className="text-[10px] text-red-400 font-medium">{xCount} X-class</p>}
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Orbit className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          {loading.cmes ? (
            <><div className="h-5 w-8 skeleton rounded mx-auto mb-1" /><div className="h-3 w-14 skeleton rounded mx-auto" /></>
          ) : (
            <><p className="text-lg font-orbitron font-bold text-white">{cmes.length}</p><p className="text-[10px] text-gray-500">CMEs (7d)</p></>
          )}
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Globe2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          {loading.gsts ? (
            <><div className="h-5 w-8 skeleton rounded mx-auto mb-1" /><div className="h-3 w-18 skeleton rounded mx-auto" /></>
          ) : (
            <><p className="text-lg font-orbitron font-bold text-white">{gsts.length}</p><p className="text-[10px] text-gray-500">Storms (14d)</p></>
          )}
        </GlassCard>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              tab === t.key
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                : 'glass text-gray-400 hover:text-white'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {loading[tab] ? (
            <SkeletonList tab={tab} />
          ) : tab === 'flares' ? (
            <FlaresList flares={recentFlares} />
          ) : tab === 'cmes' ? (
            <CMEsList cmes={cmes} />
          ) : (
            <GSTsList gsts={gsts} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function FlaresList({ flares }) {
  if (!flares.length) return <EmptyState icon={Flame} msg="No solar flares in the last 30 days." />;
  return (
    <div className="space-y-2">
      {flares.map((f, i) => {
        const cls = (f.classType || 'C').charAt(0);
        return (
          <GlassCard key={f.flareID || i} className="p-4 flex items-center gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border ${FLARE_CLASS_COLORS[cls] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {f.classType || 'N/A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{f.sourceLocation || 'Unknown region'}</p>
              <p className="text-xs text-gray-500">{formatDate(f.beginTime)}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">{timeAgo(f.beginTime)}</p>
              {f.activeRegionNum && <p className="text-[10px] text-gray-600">AR {f.activeRegionNum}</p>}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

function CMEsList({ cmes }) {
  if (!cmes.length) return <EmptyState icon={Orbit} msg="No CMEs in the last 30 days." />;
  return (
    <div className="space-y-2">
      {cmes.map((c, i) => {
        const speed = c.speed || c.velocity || 0;
        const speedLabel = speed >= 1000 ? 'Extreme' : speed >= 500 ? 'Fast' : speed >= 300 ? 'Moderate' : 'Slow';
        const speedColor = speed >= 1000 ? 'text-red-400' : speed >= 500 ? 'text-orange-400' : speed >= 300 ? 'text-yellow-400' : 'text-green-400';
        return (
          <GlassCard key={c.cmeID || i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-orbitron font-bold text-white">{c.cmeID || `CME ${i + 1}`}</p>
              <span className={`text-xs font-medium ${speedColor}`}>{speedLabel}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {speed > 0 && <div>Speed: <span className="text-white">{speed.toFixed(1)} km/s</span></div>}
              {c.startTime && <div>Start: <span className="text-white">{formatDate(c.startTime)}</span></div>}
              {c.type && <div className="col-span-2">Type: <span className="text-white">{c.type}</span></div>}
            </div>
            {c.cmeAnalyses?.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs text-neon-blue cursor-pointer hover:underline">Analysis data</summary>
                <div className="mt-1 space-y-1 text-xs text-gray-400">
                  {c.cmeAnalyses.slice(0, 3).map((a, j) => (
                    <div key={j} className="pl-2 border-l border-white/10">
                      {a.speed && <div>Speed: {a.speed.toFixed(1)} km/s</div>}
                      {a.type && <div>Type: {a.type}</div>}
                      {a.time21_5 && <div>Time: {new Date(a.time21_5).toLocaleDateString()}</div>}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}

function GSTsList({ gsts }) {
  if (!gsts.length) return <EmptyState icon={Globe2} msg="No geomagnetic storms in the last 60 days." />;
  return (
    <div className="space-y-2">
      {gsts.map((g, i) => {
        const kp = g.allKpIndex || [];
        const maxKp = kp.length ? Math.max(...kp.map((k) => k.kpIndex || 0)) : 0;
        const intensity = maxKp >= 8 ? 'Severe' : maxKp >= 6 ? 'Strong' : maxKp >= 5 ? 'Moderate' : 'Minor';
        const intensityColor = maxKp >= 8 ? 'text-red-400' : maxKp >= 6 ? 'text-orange-400' : maxKp >= 5 ? 'text-yellow-400' : 'text-green-400';
        return (
          <GlassCard key={g.gstID || i} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-orbitron font-bold text-white">{g.gstID || `Storm ${i + 1}`}</p>
              <span className={`text-xs font-medium ${intensityColor}`}>{intensity}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {g.startTime && <div>Start: <span className="text-white">{formatDate(g.startTime)}</span></div>}
              {maxKp > 0 && <div>Max Kp: <span className="text-white">{maxKp}</span></div>}
              {kp.length > 0 && <div className="col-span-2">Kp readings: <span className="text-white">{kp.length}</span></div>}
            </div>
            {kp.length > 0 && (
              <div className="mt-2 flex items-end gap-0.5 h-10">
                {kp.slice(0, 30).map((k, j) => {
                  const val = (k.kpIndex || 0) / 9;
                  return (
                    <div key={j} className="flex-1 rounded-t-sm transition-all"
                      style={{ height: `${Math.max(8, val * 100)}%`, background: val > 0.8 ? '#ef4444' : val > 0.5 ? '#f97316' : val > 0.3 ? '#eab308' : '#22c55e' }} />
                  );
                })}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}

function SkeletonList({ tab }) {
  const count = tab === 'gsts' ? 3 : 6;
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 skeleton rounded" />
            <div className="h-2.5 w-1/2 skeleton rounded" />
          </div>
          <div className="shrink-0 space-y-2">
            <div className="h-3 w-12 skeleton rounded" />
            <div className="h-2.5 w-8 skeleton rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, msg }) {
  return (
    <GlassCard className="p-12 text-center">
      <Icon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
      <p className="text-gray-400">{msg}</p>
    </GlassCard>
  );
}
