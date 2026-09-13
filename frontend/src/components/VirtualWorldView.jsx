import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Zap, 
  Coins, 
  Flame, 
  Brain, 
  Sword, 
  Heart, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Copy, 
  Compass, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function VirtualWorldView({ onBackToOverview }) {
  const { user, awardRewards } = useAuth();
  const { activeTheme } = useTheme();

  // Active selected map location
  const [selectedMap, setSelectedMap] = useState('Town Square');
  const [completedQuestIds, setCompletedQuestIds] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const MAP_LOCATIONS = [
    { id: 'Town Square', name: 'Town Square Portal', icon: '🏛️', desc: 'Central hub for daily focus sprints and habit checking.', color: 'border-purple-500' },
    { id: 'Neon Citadel', name: 'Neon Cyber Citadel', icon: '⚡', desc: 'High-speed coding, tech research, and deep problem-solving.', color: 'border-cyan-500' },
    { id: 'Blossom Sanctuary', name: 'Blossom Sanctuary', icon: '🌸', desc: 'Self-care, reading, mindful hydration, and creative arts.', color: 'border-pink-500' },
    { id: 'Gilded Vault', name: 'Gilded Vault of Glory', icon: '👑', desc: 'Epic high-difficulty boss projects with massive bounty rewards.', color: 'border-amber-500' }
  ];

  const SAMPLE_QUESTS = [
    { id: 1, title: 'Deep Work Sprint: Banish Procrastination', xp: 60, gold: 35, difficulty: 'Medium', attribute: 'Intellect', map: 'Town Square' },
    { id: 2, title: 'Physical Armor Conditioning (30m Workout)', xp: 75, gold: 40, difficulty: 'Hard', attribute: 'Strength', map: 'Town Square' },
    { id: 3, title: 'Hydration & Mindful Recharge Ritual', xp: 40, gold: 20, difficulty: 'Easy', attribute: 'Vitality', map: 'Blossom Sanctuary' },
    { id: 4, title: 'Refactor Legacy Code / Polish Architecture', xp: 90, gold: 50, difficulty: 'Boss', attribute: 'Intellect', map: 'Neon Citadel' }
  ];

  const handleCompleteQuest = (quest) => {
    if (completedQuestIds.includes(quest.id)) return;

    setCompletedQuestIds(prev => [...prev, quest.id]);
    awardRewards(quest.xp, quest.gold);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('PUFF-RPG-7729');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const xpCurrent = user.xp ?? 250;
  const xpMax = user.maxXp ?? 400;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpMax) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Banner with Navigation and Character Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-rpg-border">
        <div>
          <button
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rpg-muted hover:text-rpg-accent transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to World Overview
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rpg-accent/20 border border-rpg-accent flex items-center justify-center text-2xl shadow-theme-glow">
              ⚔️
            </div>
            <div>
              <h1 className="text-2xl font-black text-rpg-text">
                Virtual Realm: {user.username || 'Adventurer'}
              </h1>
              <p className="text-xs text-rpg-muted">
                House: <span className="text-rpg-accent font-bold">{user.personality_house || 'Blossom Leader'}</span> • Realm: <span className="font-bold text-rpg-text">{activeTheme.name}</span>
                {user.archetype && (
                  <> • Class: <span className="text-cyan-300 font-bold">{user.archetype}</span></>
                )}
                {user.tactical_gear && (
                  <> • Gear: <span className="text-amber-300 font-bold">{user.tactical_gear}</span></>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Live Progression Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-rpg-card p-3 rounded-2xl border border-rpg-border shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rpg-accent/15 border border-rpg-accent text-rpg-accent text-xs font-black">
            <Shield className="w-3.5 h-3.5" /> Lv. {user.level || 1}
          </div>

          <div className="w-36 sm:w-48">
            <div className="flex justify-between text-[10px] font-bold text-rpg-muted mb-1">
              <span>XP Progress</span>
              <span>{xpCurrent}/{xpMax}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-rpg-bg overflow-hidden border border-rpg-border">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-rpg-accent"
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Coins className="w-3.5 h-3.5" /> {user.gold ?? 100} G
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-orange-400 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <Flame className="w-3.5 h-3.5" /> {user.streak ?? 1}d
          </div>
        </div>
      </div>

      {/* Main Grid: 2D World Map & Questboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: 2D Interactive World Map Locations */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl pixel-card">
            <h2 className="text-base font-extrabold text-rpg-text mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-rpg-accent" /> 2D Map Portals
            </h2>
            <p className="text-xs text-rpg-muted mb-4">
              Select a realm location to teleport your focus session:
            </p>

            <div className="space-y-2.5">
              {MAP_LOCATIONS.map((loc) => {
                const isSelected = selectedMap === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedMap(loc.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                      isSelected
                        ? `${loc.color} bg-rpg-accent/15 shadow-theme-glow`
                        : 'border-rpg-border bg-rpg-bg/50 hover:border-rpg-muted'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{loc.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rpg-text">{loc.name}</span>
                        {isSelected && <span className="text-[10px] uppercase font-bold text-rpg-accent">Active</span>}
                      </div>
                      <p className="text-[11px] text-rpg-muted mt-0.5 leading-snug">{loc.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guild Lounge Invite Card */}
          <div className="p-6 rounded-3xl pixel-card">
            <h3 className="text-sm font-extrabold text-rpg-text mb-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Guild Lounge Portal
            </h3>
            <p className="text-xs text-rpg-muted mb-3">
              Party up with friends for synchronized focus raids:
            </p>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-rpg-bg border border-rpg-border text-xs font-mono">
              <span className="flex-1 text-center font-bold text-rpg-text">PUFF-RPG-7729</span>
              <button
                onClick={handleCopyInvite}
                className="px-3 py-1 rounded-lg bg-rpg-accent text-white font-sans text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Active Quest Board & Core Attributes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Quests */}
          <div className="p-6 rounded-3xl pixel-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-rpg-text flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rpg-accent" /> Active Quest Board
                </h2>
                <p className="text-xs text-rpg-muted">
                  Current Sector: <span className="font-bold text-rpg-accent">{selectedMap}</span>
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rpg-bg border border-rpg-border text-rpg-muted">
                {completedQuestIds.length} / {SAMPLE_QUESTS.length} Completed
              </span>
            </div>

            <div className="space-y-3">
              {SAMPLE_QUESTS.map((quest) => {
                const isCompleted = completedQuestIds.includes(quest.id);
                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/40 opacity-75' 
                        : 'bg-rpg-bg/70 border-rpg-border hover:border-rpg-accent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rpg-accent/20 text-rpg-accent">
                          {quest.attribute}
                        </span>
                        <span className="text-[11px] text-rpg-muted">
                          Map: {quest.map}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-rpg-muted' : 'text-rpg-text'}`}>
                        {quest.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-purple-400 flex items-center gap-0.5">
                          <Zap className="w-3.5 h-3.5" /> +{quest.xp} XP
                        </span>
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Coins className="w-3.5 h-3.5" /> +{quest.gold} G
                        </span>
                      </div>

                      {isCompleted ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Done
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteQuest(quest)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rpg-accent to-rpg-secondary text-white font-extrabold text-xs shadow-theme-glow hover:brightness-110"
                        >
                          Complete
                        </motion.button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hero Core Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Intellect', val: user.intellect ?? 18, icon: Brain, color: 'text-indigo-400', desc: 'Focus & Learning' },
              { label: 'Strength', val: user.strength ?? 14, icon: Sword, color: 'text-rose-400', desc: 'Fitness & Tenacity' },
              { label: 'Vitality', val: user.vitality ?? 16, icon: Heart, color: 'text-emerald-400', desc: 'Sleep & Health' },
              { label: 'Mind', val: user.mind ?? 20, icon: Sparkles, color: 'text-cyan-400', desc: 'Clarity & Meditation' },
            ].map((attr) => {
              const Icon = attr.icon;
              return (
                <div key={attr.label} className="p-4 rounded-2xl pixel-card">
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${attr.color}`} />
                    <span className="text-xs font-mono font-black text-rpg-text">
                      {attr.val} PTS
                    </span>
                  </div>
                  <div className="text-xs font-bold text-rpg-text">{attr.label}</div>
                  <div className="text-[10px] text-rpg-muted">{attr.desc}</div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
