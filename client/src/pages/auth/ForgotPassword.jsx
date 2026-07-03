import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Rocket, ArrowLeft, Send } from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword(email);
      setResetToken(data.resetToken);
      setSent(true);
      toast.success('Reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5" />
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-8 neon-glow">
          <div className="text-center mb-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[3px]">
              <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-neon-blue" />
              </div>
            </motion.div>
            <h1 className="text-2xl font-orbitron font-bold neon-text">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2">
              {sent ? 'Use the link below to reset your password' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Your reset token (in production, this would be emailed):</p>
                <p className="text-sm text-neon-blue break-all font-mono">{resetToken}</p>
              </div>
              <Link to={`/reset-password/${resetToken}`}
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-center hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all">
                Reset Password
              </Link>
              <button onClick={() => setSent(false)} className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors">
                Send to different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50"
                    placeholder="your@email.com" required />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Send className="w-4 h-4" /> Send Reset Link</>}
              </button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-neon-blue transition-colors mt-6">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
