import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/ui/GlassCard';
import SectionTitle from '../../components/ui/SectionTitle';
import { User, Mail, Calendar, Shield, Save, Upload, MapPin, Globe, Github, Twitter, Linkedin, Instagram, Moon, Sun, LogOut } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [github, setGithub] = useState(user?.github || '');
  const [twitter, setTwitter] = useState(user?.twitter || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [instagram, setInstagram] = useState(user?.instagram || '');
  const [preferences, setPreferences] = useState(user?.preferences || { theme: 'cosmos' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('light', preferences.theme === 'light');
  }, [preferences.theme]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await authAPI.uploadAvatar(file);
      setAvatar(data.url);
      toast.success('Avatar uploaded');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, avatar, bio, location, website, github, twitter, linkedin, instagram, preferences });
      toast.success('Profile updated');
    } catch { toast.error('Failed to update profile'); } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="Profile" subtitle="Manage your account" icon={User} />

      <div className="max-w-2xl mx-auto space-y-6">
        <GlassCard className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[3px] relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-10 h-10 text-neon-blue" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {uploading && <p className="text-xs text-neon-blue mt-2">Uploading...</p>}
          <h2 className="text-2xl font-orbitron font-bold text-white mt-2">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="font-orbitron font-bold text-white mb-4">General</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Bio / Call Sign</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell the cosmos about yourself..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Earth, Milky Way"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-orbitron font-bold text-white mb-4">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</label>
              <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><Twitter className="w-3.5 h-3.5" /> Twitter / X</label>
              <input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="username or URL"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram</label>
              <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-orbitron font-bold text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {preferences.theme === 'cosmos' ? <Moon className="w-4 h-4 text-neon-blue" /> : <Sun className="w-4 h-4 text-yellow-400" />}
                <span className="text-sm text-gray-300">Theme</span>
              </div>
              <button onClick={() => setPreferences((p) => ({ ...p, theme: p.theme === 'cosmos' ? 'light' : 'cosmos' }))}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${preferences.theme === 'cosmos' ? 'glass text-neon-blue' : 'bg-yellow-400/20 text-yellow-300'}`}>
                {preferences.theme === 'cosmos' ? 'Cosmos' : 'Light'}
              </button>
            </div>

          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-orbitron font-bold text-white mb-4">Account Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Avatar URL</label>
              <div className="flex gap-2">
                <input value={avatar} onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
                <button onClick={() => fileRef.current?.click()}
                  className="px-4 rounded-xl glass text-gray-400 hover:text-white hover:border-neon-blue/30 transition-all">
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Mail className="w-3 h-3" /> Email</div>
                <p className="text-sm text-white">{user?.email}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Calendar className="w-3 h-3" /> Joined</div>
                <p className="text-sm text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><Shield className="w-3 h-3" /> Role</div>
                <p className="text-sm text-white capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><User className="w-3 h-3" /> Account</div>
                <p className="text-sm text-white">{user?.googleId ? 'Google' : 'Email'}</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50">
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Update Profile</>}
            </button>
          </div>
        </GlassCard>

        <button onClick={() => { logout(); navigate('/'); }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </motion.div>
  );
}
