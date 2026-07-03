import { Link } from 'react-router-dom';
import { Rocket, Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-neon-blue" />
              <span className="font-orbitron font-bold neon-text">COSMOSX</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              AI-powered space exploration platform. Explore the universe with NASA APIs and Gemini AI.
            </p>
          </div>
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-white mb-4">Explore</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Mission Control</Link>
              <Link to="/dashboard/mars" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Mars Rover</Link>
              <Link to="/dashboard/asteroids" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Asteroid Tracker</Link>
              <Link to="/dashboard/earth" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Earth Imagery</Link>
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-white mb-4">Features</h4>
            <div className="space-y-2">
              <Link to="/dashboard/ai" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">AI Assistant</Link>
              <Link to="/dashboard/search" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">NASA Search</Link>
              <Link to="/dashboard/favorites" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Favorites</Link>
              <Link to="/dashboard/journal" className="block text-sm text-gray-500 hover:text-neon-blue transition-colors">Space Journal</Link>
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com/subani248" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"><Github className="w-4 h-4" /></a>
              <a href="https://www.linkedin.com/in/subani-shaik" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"><Linkedin className="w-4 h-4" /></a>
              <a href="https://www.instagram.com/_shot.on.earth_" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} CosmosX. All rights reserved. Not affiliated with NASA.</p>
          <p className="text-xs text-gray-600">Powered by NASA Open APIs & Gemini AI</p>
        </div>
      </div>
    </footer>
  );
}
