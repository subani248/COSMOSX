import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Camera, Asterisk, Globe, Search, Bot,
  Star, BookOpen, User, ChevronLeft, Rocket, Moon, Satellite,
  Earth, Sparkles, Sun, Newspaper
} from 'lucide-react';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Mission Control', exact: true },
  { to: '/dashboard/mars', icon: Camera, label: 'Mars Rover' },
  { to: '/dashboard/moon', icon: Moon, label: 'Moon Phase' },
  { to: '/dashboard/solar', icon: Sun, label: 'Solar Activity' },
  { to: '/dashboard/news', icon: Newspaper, label: 'Space News' },
  { to: '/dashboard/iss', icon: Satellite, label: 'ISS Tracker' },
  { to: '/dashboard/planets', icon: Earth, label: 'Planets' },
  { to: '/dashboard/exoplanets', icon: Sparkles, label: 'Exoplanets' },
  { to: '/dashboard/asteroids', icon: Asterisk, label: 'Asteroids' },
  { to: '/dashboard/earth', icon: Globe, label: 'Earth Imagery' },
  { to: '/dashboard/search', icon: Search, label: 'NASA Search' },
  { to: '/dashboard/ai', icon: Bot, label: 'AI Assistant' },
  { to: '/dashboard/favorites', icon: Star, label: 'Favorites' },
  { to: '/dashboard/journal', icon: BookOpen, label: 'Space Journal' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      className="h-screen glass border-r border-white/5 fixed left-0 top-0 z-40 hidden lg:flex flex-col overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {!collapsed && (
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-neon-blue" />
            <span className="font-orbitron text-sm font-bold neon-text">COSMOSX</span>
          </NavLink>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
              ${isActive
                ? 'bg-neon-blue/10 text-neon-blue neon-glow border border-neon-blue/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <link.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
