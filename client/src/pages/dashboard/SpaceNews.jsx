import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { newsAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { Newspaper, Search, ExternalLink, Calendar, ChevronLeft, ChevronRight, Clock, Globe, User, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function SpaceNews() {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const limit = 12;

  const fetchNews = useCallback(async (p, q) => {
    setLoading(true);
    try {
      const params = { page: p, limit };
      if (q) params.search = q;
      const { data } = await newsAPI.getAll(params);
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to fetch space news');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNews(page, query); }, [page, query, fetchNews]);

  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Space News" subtitle="Latest from the cosmos — powered by Spaceflight News" icon={Newspaper} />

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search space news..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-neon-blue/20 text-neon-blue rounded-xl text-sm font-medium border border-neon-blue/30 hover:bg-neon-blue/30 transition-all">
          Search
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {loading ? 'Loading...' : `${total.toLocaleString()} articles found`}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No articles found. Try a different search.</p>
        </GlassCard>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard
                    className="p-0 overflow-hidden group cursor-pointer"
                    onClick={() => setSelected(selected?.id === article.id ? null : article)}
                  >
                    <div className="relative h-44 overflow-hidden">
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                          {article.news_site || 'Space'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-neon-blue transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {article.summary || 'No summary available.'}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeAgo(article.published_at)}
                        </span>
                        {article.author && (
                          <span className="flex items-center gap-1 truncate max-w-[120px]">
                            <User className="w-3 h-3 shrink-0" /> {article.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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
        </>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56 sm:h-72">
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/30">
                    {selected.news_site || 'Space'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-orbitron font-bold text-white mb-3">{selected.title}</h2>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(selected.published_at).toLocaleDateString()}</span>
                  {selected.author && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {selected.author}</span>}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">{selected.summary || 'No summary available.'}</p>
                <div className="flex gap-3">
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-medium hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
                      Read Full Article <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => setSelected(null)}
                    className="px-5 py-2.5 rounded-xl glass text-gray-400 hover:text-white text-sm font-medium transition-all">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
