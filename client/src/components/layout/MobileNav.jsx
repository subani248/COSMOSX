import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Moon, Earth, Satellite, Bot, Star, BookOpen, Sparkles, Sun, Newspaper } from 'lucide-react';

export default function MobileNav() {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/dashboard/mars', icon: Camera, label: 'Mars' },
    { to: '/dashboard/moon', icon: Moon, label: 'Moon' },
    { to: '/dashboard/iss', icon: Satellite, label: 'ISS' },
    { to: '/dashboard/solar', icon: Sun, label: 'Solar' },
    { to: '/dashboard/news', icon: Newspaper, label: 'News' },
    { to: '/dashboard/planets', icon: Earth, label: 'Planets' },
    { to: '/dashboard/exoplanets', icon: Sparkles, label: 'Exo' },
    { to: '/dashboard/ai', icon: Bot, label: 'AI' },
    { to: '/dashboard/favorites', icon: Star, label: 'Stars' },
    { to: '/dashboard/journal', icon: BookOpen, label: 'Journal' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5">
      <div className="flex items-center justify-around py-2 px-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors
              ${isActive ? 'text-neon-blue' : 'text-gray-500'}`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
