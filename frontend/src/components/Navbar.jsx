import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Palette, 
  ChevronDown, 
  Check, 
  LogOut, 
  Sword,
  MapPin,
  Compass
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentView, 
  setCurrentView,
  companionChar = 'emily',
  onSelectCompanion
}) {
  const { currentTheme, activeTheme, setTheme, themes } = useTheme();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  
  const themeDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setThemeDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'realms', label: 'Realms' },
    { id: 'houses', label: 'Houses' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'journey', label: 'Journey' },
  ];

  const scrollToSection = (sectionId) => {
    if (setCurrentView) setCurrentView('home');
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-rpg-bg/85 border-b border-rpg-border transition-colors duration-700 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Animated Brand Logo */}
        <motion.div 
          onClick={() => setCurrentView && setCurrentView('home')}
          className="flex items-center gap-3.5 cursor-pointer select-none"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-rpg-card border-2 border-rpg-accent shadow-theme-glow overflow-hidden">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            >
              <Sword className="w-6 h-6 text-rpg-accent" />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rpg-secondary animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rpg-secondary" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-wider text-rpg-text">
                POWER PUFF
              </span>
              <span className="px-2 py-0.5 text-[10px] font-pixel font-bold rounded bg-gradient-to-r from-rpg-accent to-rpg-secondary text-white shadow-sm">
                RPG
              </span>
            </div>
            <p className="text-[10px] font-tech font-bold tracking-widest uppercase text-rpg-muted">
              GAMIFIED PRODUCTIVITY REALM
            </p>
          </div>
        </motion.div>

        {/* Center: Tactile Navigation Links with Animated Sliding Indicator */}
        <nav 
          className="hidden md:flex items-center gap-1 font-tech font-bold text-sm uppercase tracking-wider text-rpg-muted"
          onMouseLeave={() => setHoveredNav(null)}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              onMouseEnter={() => setHoveredNav(link.id)}
              className="relative px-3.5 py-2 rounded-xl transition-colors hover:text-rpg-text"
            >
              <span className="relative z-10">{link.label}</span>
              {hoveredNav === link.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-rpg-card border border-rpg-accent/60 shadow-theme-glow"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Section: Companion Switcher, Theme Selector & Auth Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Dual Companion Switcher Pill: [ 🌸 Emily (Angel) ♀ | ⚡ Ren (Knight) ♂ ] */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-rpg-card border border-rpg-border shadow-sm">
            <button
              onClick={() => onSelectCompanion && onSelectCompanion('emily')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                (companionChar === 'emily' || companionChar === 'aiko')
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow-theme-glow'
                  : 'text-rpg-muted hover:text-rpg-text'
              }`}
              title="Choose Emily (Angel) ♀ (Celestial Fairy Guide)"
            >
              <span>🌸 Emily (Angel) ♀</span>
            </button>
            <button
              onClick={() => onSelectCompanion && onSelectCompanion('ren')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                companionChar === 'ren'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-theme-glow'
                  : 'text-rpg-muted hover:text-rpg-text'
              }`}
              title="Choose Ren (Knight) ♂ (Cyber Knight Scout)"
            >
              <span>⚡ Ren (Knight) ♂</span>
            </button>
          </div>

          {/* 4-Theme Dropdown Switcher */}
          <div className="relative" ref={themeDropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="game-card flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-rpg-border text-xs font-tech font-bold text-rpg-text shadow-sm"
              title="Switch Visual Realm Theme"
            >
              <span className="text-base">{activeTheme.icon}</span>
              <span className="hidden sm:inline font-display tracking-wider text-xs">{activeTheme.name}</span>
              <span 
                className="w-3 h-3 rounded-full border border-white/30 shadow-[0_0_8px_var(--rpg-accent-glow)]" 
                style={{ backgroundColor: activeTheme.accent }}
              />
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${themeDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {themeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-rpg-card border-2 border-rpg-border p-2.5 shadow-2xl z-50 backdrop-blur-2xl"
                >
                  <div className="px-3 py-2 border-b border-rpg-border mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-tech font-bold uppercase tracking-wider text-rpg-muted flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-rpg-accent" /> 4 VISUAL REALMS
                    </span>
                    <span className="text-[9px] font-pixel text-rpg-accent">V1.0</span>
                  </div>

                  <div className="space-y-1.5">
                    {themes.map((theme) => {
                      const isSelected = theme.id === currentTheme;
                      return (
                        <motion.button
                          key={theme.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setTheme(theme.id);
                            setThemeDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                            isSelected 
                              ? 'bg-rpg-accent/20 border border-rpg-accent text-rpg-text shadow-theme-glow' 
                              : 'hover:bg-rpg-card-hover text-rpg-muted hover:text-rpg-text border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{theme.icon}</span>
                            <div>
                              <div className="text-xs font-display font-bold leading-tight tracking-wide">{theme.name}</div>
                              <div className="text-[10px] font-tech text-rpg-muted">{theme.badge}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm" 
                              style={{ backgroundColor: theme.accent }}
                            />
                            {isSelected && <Check className="w-4 h-4 text-rpg-accent" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Authenticated vs Clean Unauthenticated State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView && setCurrentView(currentView === 'quest-hall' ? 'home' : 'quest-hall')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-tech font-bold tracking-wider uppercase transition-colors ${
                  currentView === 'quest-hall'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-theme-glow'
                    : 'bg-rpg-card border-rpg-border hover:border-purple-400 text-purple-300/90'
                }`}
              >
                <Sword className="w-3.5 h-3.5 text-purple-400" />
                <span>Quest Hall</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView && setCurrentView(currentView === 'life-builder' ? 'home' : 'life-builder')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-tech font-bold tracking-wider uppercase transition-colors ${
                  currentView === 'life-builder'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-theme-glow'
                    : 'bg-rpg-card border-rpg-border hover:border-amber-400 text-amber-300/90'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Life Builder</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView && setCurrentView(currentView === 'world' ? 'home' : 'world')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rpg-card border border-rpg-border hover:border-rpg-accent text-xs font-tech font-bold tracking-wider uppercase text-rpg-text"
              >
                <MapPin className="w-3.5 h-3.5 text-rpg-accent" />
                <span>{currentView === 'world' ? 'Overview' : 'World Map'}</span>
              </motion.button>

              <div className="relative" ref={profileDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rpg-card border border-rpg-border hover:border-rpg-accent text-xs font-bold text-rpg-text shadow-theme-glow"
                >
                  <div className="w-6 h-6 rounded-full bg-rpg-accent text-white flex items-center justify-center text-xs font-display">
                    {user.username ? user.username[0].toUpperCase() : 'H'}
                  </div>
                  <span className="hidden md:inline font-tech tracking-wider text-sm">{user.username}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-rpg-muted" />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-rpg-card border-2 border-rpg-border p-2.5 shadow-2xl z-50 backdrop-blur-2xl"
                    >
                      <div className="px-3 py-2 border-b border-rpg-border">
                        <p className="text-xs font-display font-bold text-rpg-text">{user.username}</p>
                        <p className="text-[10px] text-rpg-muted">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase bg-rpg-accent/20 text-rpg-accent">
                          {user.personality_house || 'Blossom House'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (setCurrentView) setCurrentView('quest-hall');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full mt-1.5 flex items-center gap-2 px-3 py-2 text-xs font-tech font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors"
                      >
                        <Sword className="w-3.5 h-3.5 text-purple-400" /> Quest Hall
                      </button>
                      <button
                        onClick={() => {
                          if (setCurrentView) setCurrentView('life-builder');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-tech font-bold uppercase tracking-wider text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Build Your Life
                      </button>
                      <button
                        onClick={() => {
                          if (setCurrentView) setCurrentView('world');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-tech font-bold uppercase tracking-wider text-rpg-text hover:bg-rpg-bg rounded-xl transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-rpg-accent" /> Virtual World Hub
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          if (setCurrentView) setCurrentView('home');
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-tech font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => openAuthModal('signup')}
              className="game-btn-primary px-5 py-2.5 rounded-xl text-white font-tech font-black text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2 shadow-theme-glow-lg cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Enter Virtual World</span>
            </motion.button>
          )}

        </div>

      </div>
    </header>
  );
}
