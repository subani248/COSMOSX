import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { chatAPI } from '../../services/api';
import SectionTitle from '../../components/ui/SectionTitle';
import GlassCard from '../../components/ui/GlassCard';
import { Bot, Send, User, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function AIChat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (location.state?.imageContext) {
      const ctx = location.state.imageContext;
      setMessages([{
        role: 'model',
        content: `I see you're interested in **${ctx.title || 'this NASA image'}**. Would you like me to explain what this image depicts, its scientific significance, or anything else about it?`,
      }]);
    }
  }, [location.state]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await chatAPI.sendMessage({ message: userMsg, sessionId });
      setSessionId(data.sessionId);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
    } catch { toast.error('Failed to get AI response'); } finally { setLoading(false); }
  };

  const handleExplainImage = async () => {
    if (!location.state?.imageContext) {
      toast.error('No image context available. Go to the APOD page first.');
      return;
    }
    const ctx = location.state.imageContext;
    setLoading(true);
    try {
      const { data } = await chatAPI.explainImage({ imageTitle: ctx.title, explanation: ctx.explanation });
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setMessages((prev) => [...prev, { role: 'user', content: `Explain this image: ${ctx.title}` }, { role: 'model', content: data.response }]);
    } catch { toast.error('Failed to explain image'); } finally { setLoading(false); }
  };

  const newChat = () => {
    setMessages([]);
    setSessionId(null);
    if (location.state?.imageContext) {
      const ctx = location.state.imageContext;
      setMessages([{ role: 'model', content: `Ready to discuss **${ctx.title}**? Ask me anything!` }]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <SectionTitle title="AI Space Assistant" subtitle="Powered by Google Gemini" icon={Bot} />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <GlassCard className="flex flex-col h-[600px] p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-neon-blue" />
                <span className="font-orbitron text-sm font-bold text-white">Gemini AI</span>
              </div>
              <div className="flex gap-2">
                {location.state?.imageContext && (
                  <button onClick={handleExplainImage} disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-lg glass text-neon-blue hover:bg-white/5 transition-all flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Explain Image
                  </button>
                )}
                <button onClick={newChat} className="text-xs px-3 py-1.5 rounded-lg glass text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-2">Ask me anything about astronomy</p>
                  <p className="text-xs text-gray-600">Planets, stars, galaxies, black holes, NASA missions...</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white border border-white/10'
                        : 'glass text-gray-200'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass p-4 rounded-2xl space-y-3 min-w-[200px]">
                    <div className="skeleton h-3 w-full rounded" />
                    <div className="skeleton h-3 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the cosmos..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/50 text-sm"
                />
                <button onClick={handleSend} disabled={loading || !input.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white disabled:opacity-30 transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-2">AI responses are generated by Google Gemini. Verify important information.</p>
            </div>
          </GlassCard>
        </div>

        <div className="hidden lg:block">
          <GlassCard>
            <h3 className="font-orbitron text-sm font-bold text-white mb-3">Suggestions</h3>
            <div className="space-y-2">
              {['Explain how stars are born', 'What is a black hole?', 'Tell me about Mars missions', 'How big is the universe?', 'What are exoplanets?', 'Explain dark matter'].map((s, i) => (
                <button key={i} onClick={() => { setInput(s); }}
                  className="w-full text-left text-xs text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
