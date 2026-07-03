import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { journalAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { BookOpen, Plus, Search, Trash2, Edit3, X, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SpaceJournal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', tags: '', nasaImageUrl: '', nasaImageTitle: '' });

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await journalAPI.getAll(); setEntries(data); } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSearch = async (q) => {
    setSearch(q);
    if (!q.trim()) {
      try { const { data } = await journalAPI.getAll(); setEntries(data); } catch {}
      return;
    }
    try { const { data } = await journalAPI.search({ q }); setEntries(data); } catch {}
  };

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required'); return; }
    try {
      const tags = form.tags ? form.tags.split(',').map((t) => t.trim()) : [];
      if (editing) {
        const { data } = await journalAPI.update(editing._id, { ...form, tags });
        setEntries((prev) => prev.map((e) => (e._id === editing._id ? data : e)));
        toast.success('Entry updated');
      } else {
        const { data } = await journalAPI.create({ ...form, tags });
        setEntries((prev) => [data, ...prev]);
        toast.success('Entry created');
      }
      setShowEditor(false);
      setEditing(null);
      setForm({ title: '', content: '', tags: '', nasaImageUrl: '', nasaImageTitle: '' });
    } catch { toast.error('Failed to save entry'); }
  };

  const handleEdit = (entry) => {
    setEditing(entry);
    setForm({
      title: entry.title,
      content: entry.content,
      tags: (entry.tags || []).join(', '),
      nasaImageUrl: entry.nasaImageUrl || '',
      nasaImageTitle: entry.nasaImageTitle || '',
    });
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    try { await journalAPI.delete(id); setEntries((prev) => prev.filter((e) => e._id !== id)); toast.success('Entry deleted'); } catch { toast.error('Failed to delete'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Space Journal" subtitle="Document your cosmic discoveries" icon={BookOpen} />

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search entries..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 text-sm" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: '', content: '', tags: '', nasaImageUrl: '', nasaImageTitle: '' }); setShowEditor(true); }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map((i) => <div key={i} className="glass rounded-2xl p-6 space-y-3"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton h-3 w-1/2 rounded" /><div className="skeleton h-20 w-full rounded" /></div>)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No journal entries yet. Start documenting your space journey!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {entries.map((entry, i) => (
            <motion.div key={entry._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard>
                <div className="flex gap-4">
                  {entry.nasaImageUrl && (
                    <img src={entry.nasaImageUrl} alt={entry.nasaImageTitle || ''} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{entry.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{new Date(entry.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">{entry.content}</p>
                    {entry.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {entry.tags.map((t, i) => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full glass text-neon-blue">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => handleEdit(entry)} className="p-1.5 rounded-lg hover:bg-white/5 transition-all text-gray-400 hover:text-neon-blue">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(entry._id)} className="p-1.5 rounded-lg hover:bg-white/5 transition-all text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-orbitron font-bold text-white">{editing ? 'Edit Entry' : 'New Entry'}</h3>
                <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Content</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50 resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image URL</label>
                    <input value={form.nasaImageUrl} onChange={(e) => setForm({ ...form, nasaImageUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Image Title</label>
                    <input value={form.nasaImageTitle} onChange={(e) => setForm({ ...form, nasaImageTitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue/50" />
                  </div>
                </div>
                <button onClick={handleSave}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
                  <Save className="w-4 h-4" /> {editing ? 'Update' : 'Save'} Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
