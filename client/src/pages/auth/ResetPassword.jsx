import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Rocket, Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset successfully!');
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-blue/5" />
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 neon-glow-purple">
          <div className="text-center mb-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink p-[3px]">
              <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-neon-purple" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-orbitron font-bold neon-text-purple">New Password</h1>
            <p className="text-gray-400 text-sm mt-2">
              {done ? 'Your password has been reset' : 'Enter your new password'}
            </p>
          </div>

          {done ? (
            <div className="space-y-4">
              <div className="glass rounded-xl p-6 text-center">
                <RefreshCw className="w-12 h-12 text-neon-green mx-auto mb-3" />
                <p className="text-white font-medium">Password updated successfully</p>
                <p className="text-sm text-gray-500 mt-1">You can now sign in with your new password</p>
              </div>
              <Link to="/login"
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-center hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50"
                    placeholder="•••••••• (min 6 chars)" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><RefreshCw className="w-4 h-4" /> Reset Password</>}
              </button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-neon-purple transition-colors mt-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
