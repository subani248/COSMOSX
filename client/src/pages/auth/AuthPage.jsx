import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, Rocket, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Commander!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.access_token);
      toast.success('Google authentication successful!');
      navigate('/dashboard');
    } catch { toast.error('Google login failed'); }
  };

  const googleLoginAction = useGoogleLogin({
    onSuccess: handleGoogle,
    onError: () => toast.error('Google login failed'),
  });

  const cardVariants = {
    enter: { opacity: 0, scale: 0.85, rotateY: -15, z: -200 },
    center: { opacity: 1, scale: 1, rotateY: 0, z: 0 },
    exit: { opacity: 0, scale: 0.85, rotateY: 15, z: -200 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{ perspective: 1200 }}
    >
      <div className="glass rounded-3xl p-8 neon-glow">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[3px]"
          >
            <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-neon-blue" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-orbitron font-bold neon-text">Mission Control</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
                placeholder="your@email.com" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
                placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="px-4 bg-cosmos-950 text-xs text-gray-500">or continue with</span></div>
        </div>

          <button onClick={() => googleLoginAction()}
          className="w-full py-3 rounded-xl glass border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:border-neon-blue/30 hover:bg-white/5 transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>

        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-gray-500 hover:text-neon-blue transition-colors">
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          New recruit?{' '}
          <button onClick={onSwitch} className="text-neon-blue hover:text-neon-blue/80 neon-text font-medium bg-transparent border-none cursor-pointer inline">
            Create account
          </button>
        </p>
      </div>
    </motion.div>
  );
}

function RegisterForm({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Welcome to CosmosX, Commander!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const cardVariants = {
    enter: { opacity: 0, scale: 0.85, rotateY: 15, z: -200 },
    center: { opacity: 1, scale: 1, rotateY: 0, z: 0 },
    exit: { opacity: 0, scale: 0.85, rotateY: -15, z: -200 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{ perspective: 1200 }}
    >
      <div className="glass rounded-3xl p-8 neon-glow-purple">
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink p-[3px]"
          >
            <div className="w-full h-full rounded-full bg-cosmos-950 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-neon-purple" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-orbitron font-bold neon-text-purple">New Recruit</h1>
          <p className="text-gray-400 text-sm mt-2">Join the CosmosX mission</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                placeholder="Your name" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                placeholder="your@email.com" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 transition-all"
                placeholder="•••••••• (min 6 chars)" required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Join Mission <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have clearance?{' '}
          <button onClick={onSwitch} className="text-neon-purple hover:text-neon-purple/80 neon-text-purple font-medium bg-transparent border-none cursor-pointer inline">
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitch = useCallback(() => {
    setIsLogin((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-cosmos-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5" />
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm key="login" onSwitch={handleSwitch} />
            ) : (
              <RegisterForm key="register" onSwitch={handleSwitch} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
