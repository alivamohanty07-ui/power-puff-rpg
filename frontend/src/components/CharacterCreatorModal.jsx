import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  Sword, 
  Brain, 
  Heart, 
  Zap, 
  Dices, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Terminal, 
  Cpu, 
  Radio, 
  Crosshair
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AnimeMascot from './AnimeMascot';
import { triggerGameFX } from './GameFX';

// Random cyberpunk codename bank
const CYBER_CODENAMES = [
  'CYBER-BLOSSOM',
  'NEON-VALKYRIE',
  'CHRONO-KNIGHT',
  'VOID-RUNNER',
  'GLITCH-RAIDER',
  'QUANTUM-SPARK',
  'APEX-WARRIOR',
  'SYNTH-STRIKER',
  'HEX-PHANTOM',
  'AURA-PULSE',
  'CIRCUIT-BLADE',
  'PIXEL-RONIN'
];

const ARCHETYPES = [
  {
    id: 'netrunner',
    title: 'Netrunner Specialist',
    role: 'Deep Work & Logic',
    icon: Brain,
    accent: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    desc: 'Bypasses mental firewalls. Excels at uninterrupted coding sprints and problem solving.',
    primaryStat: 'Intellect'
  },
  {
    id: 'samurai',
    title: 'Street Vanguard',
    role: 'Physical Grit & Tenacity',
    icon: Sword,
    accent: 'text-rose-400 border-rose-500/50 bg-rose-500/10',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    desc: 'Confronts intimidating boss quests head-on. High endurance and workout discipline.',
    primaryStat: 'Strength'
  },
  {
    id: 'alchemist',
    title: 'Bio-Alchemist',
    role: 'Restoration & Vitality',
    icon: Heart,
    accent: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    desc: 'Synthesizes healthy habits. Maintains hydration, nutrition, and restorative circadian cycles.',
    primaryStat: 'Vitality'
  },
  {
    id: 'weaver',
    title: 'Chrono-Weaver',
    role: 'Mindfulness & Clarity',
    icon: Sparkles,
    accent: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    desc: 'Manipulates time perception with mindfulness rituals, meditation, and calm focus.',
    primaryStat: 'Mind'
  }
];

const HOUSES = [
  {
    id: 'Blossom Leader',
    key: 'blossom',
    name: 'House Blossom',
    leader: 'Commander Blossom',
    color: 'border-pink-500',
    glow: 'shadow-[0_0_25px_rgba(236,72,153,0.4)]',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    textColor: 'text-pink-400',
    icon: '💖',
    tagline: 'Strategic Leadership & Vision',
    perk: '+15% XP on deep work coding sprints & engineering quests'
  },
  {
    id: 'Bubbles Empath',
    key: 'bubbles',
    name: 'House Bubbles',
    leader: 'Sprite Bubbles',
    color: 'border-cyan-400',
    glow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    textColor: 'text-cyan-300',
    icon: '🫧',
    tagline: 'Creative Joy & Empathy',
    perk: '+20% Vitality recovery on hydration & rest streaks'
  },
  {
    id: 'Buttercup Brawler',
    key: 'buttercup',
    name: 'House Buttercup',
    leader: 'Berserker Buttercup',
    color: 'border-lime-400',
    glow: 'shadow-[0_0_25px_rgba(163,230,53,0.4)]',
    badge: 'bg-lime-500/20 text-lime-300 border-lime-500/50',
    textColor: 'text-lime-300',
    icon: '⚡',
    tagline: 'Fearless Action & Raw Grit',
    perk: '+15% bonus Gold & critical hit rate on Boss quests'
  }
];

const TACTICAL_GEAR = [
  {
    id: 'Neural Overclock Visor',
    name: 'Neural Overclock Visor',
    icon: Cpu,
    statBonus: '+2 Intellect',
    desc: 'Streams real-time quest telemetry directly onto your optic nerve.'
  },
  {
    id: 'Kinetic Phase Gauntlet',
    name: 'Kinetic Phase Gauntlet',
    icon: Sword,
    statBonus: '+2 Strength',
    desc: 'Amplifies physical momentum to obliterate morning procrastination.'
  },
  {
    id: 'Nano-Repair Vitalizer',
    name: 'Nano-Repair Vitalizer',
    icon: Heart,
    statBonus: '+2 Vitality',
    desc: 'Monitors vital biological cycles, hydration levels, and sleep.'
  },
  {
    id: 'Zenith Hologram Charm',
    name: 'Zenith Hologram Charm',
    icon: Sparkles,
    statBonus: '+2 Mind',
    desc: 'Projects an ambient calming aura during high-stress task deadlines.'
  }
];

export default function CharacterCreatorModal({ 
  isOpen, 
  onClose, 
  companionChar = 'ren',
  onSelectCompanion 
}) {
  const { createCustomCharacter, openAuthModal } = useAuth();
  const { currentTheme } = useTheme();

  // Onboarding Step State (1: Identity, 2: House Alignment, 3: Neural Stats & Gear, 4: Holo-Review)
  const [step, setStep] = useState(1);

  // Form selections
  const [callsign, setCallsign] = useState('CYBER-BLOSSOM');
  const [archetype, setArchetype] = useState(ARCHETYPES[0]);
  const [characterAvatar, setCharacterAvatar] = useState(companionChar || 'ren');
  const [personalityHouse, setPersonalityHouse] = useState(HOUSES[0]);
  const [tacticalGear, setTacticalGear] = useState(TACTICAL_GEAR[0]);

  // Stat point allocation
  const [stats, setStats] = useState({
    intellect: 18,
    strength: 14,
    vitality: 16,
    mind: 20
  });
  const [unallocatedPoints, setUnallocatedPoints] = useState(4);

  if (!isOpen) return null;

  // Randomize codename
  const handleRandomizeCallsign = (e) => {
    e?.stopPropagation();
    const available = CYBER_CODENAMES.filter(n => n !== callsign);
    const pick = available[Math.floor(Math.random() * available.length)];
    setCallsign(pick);
    triggerGameFX('cyberpunk', window.innerWidth / 2, window.innerHeight / 2);
  };

  // Stat adjustment handlers
  const handleStatChange = (statName, delta) => {
    if (delta > 0 && unallocatedPoints > 0) {
      setStats(prev => ({ ...prev, [statName]: prev[statName] + 1 }));
      setUnallocatedPoints(prev => prev - 1);
    } else if (delta < 0 && stats[statName] > 10) {
      setStats(prev => ({ ...prev, [statName]: prev[statName] - 1 }));
      setUnallocatedPoints(prev => prev + 1);
    }
  };

  // Switch companion & avatar
  const handleChooseAvatar = (charId) => {
    setCharacterAvatar(charId);
    if (onSelectCompanion) {
      onSelectCompanion(charId);
    }
    triggerGameFX('cyberpunk', window.innerWidth / 2, window.innerHeight / 2);
  };

  // Complete Character Onboarding & Enter World
  const handleFinalizeHero = () => {
    triggerGameFX('celebrate', window.innerWidth / 2, window.innerHeight / 2);
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.5 }
    });

    createCustomCharacter({
      username: callsign,
      personality_house: personalityHouse.id,
      character_avatar: characterAvatar,
      selected_theme: 'cyberpunk-neon',
      archetype: archetype.title,
      tactical_gear: tacticalGear.name,
      intellect: stats.intellect,
      strength: stats.strength,
      vitality: stats.vitality,
      mind: stats.mind
    });

    onClose();
  };

  // Switch to permanent signup with pre-filled state
  const handleCreateAccount = () => {
    onClose();
    openAuthModal('signup');
  };

  const stepsList = [
    { num: 1, label: 'PROTOCOL // IDENTITY' },
    { num: 2, label: 'MATRIX // GUILD' },
    { num: 3, label: 'ATTRIBUTES // GEAR' },
    { num: 4, label: 'HOLO // GRID LINK' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
        
        {/* Backdrop Dismiss */}
        <motion.div 
          className="fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Cyberpunk Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#060a14] border-2 border-cyan-500/80 shadow-[0_0_50px_rgba(6,182,212,0.35)] hud-frame overflow-hidden text-cyan-50 z-10 my-auto"
        >
          {/* Subtle Ambient Scanline & Hex Grid Texture */}
          <div className="absolute inset-0 scanline-texture opacity-30 pointer-events-none" />
          
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#06b6d4 1.2px, transparent 1.2px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Cyberpunk Terminal Header */}
          <div className="relative px-6 py-4 border-b border-cyan-500/40 bg-cyan-950/40 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-sm sm:text-base tracking-wider text-cyan-300 uppercase">
                    HERO FORGE // ONBOARDING PROTOCOL
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-pixel font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    V2.4
                  </span>
                </div>
                <p className="font-tech text-xs tracking-widest text-cyan-400/70 uppercase">
                  NEURAL LINK ESTABLISHED • ATTUNING CYBERPUNK STAT MATRIX
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 hover:text-white hover:border-cyan-300 hover:bg-cyan-900/50 transition-all cursor-pointer"
              title="Abort Protocol (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Tracker HUD */}
          <div className="px-6 py-3 border-b border-cyan-500/25 bg-black/40 flex items-center justify-between overflow-x-auto gap-2">
            {stepsList.map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-tech font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : isPast
                        ? 'text-emerald-400 border border-emerald-500/40 bg-emerald-500/10'
                        : 'text-slate-400 border border-transparent hover:text-cyan-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-pixel ${
                    isActive 
                      ? 'bg-cyan-400 text-slate-950 font-bold' 
                      : isPast 
                        ? 'bg-emerald-400 text-slate-950 font-bold' 
                        : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="p-6 sm:p-8 max-h-[68vh] overflow-y-auto relative z-10">
            
            {/* ================= STEP 1: IDENTITY & ARCHETYPE ================= */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-tech text-xs uppercase font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-300" /> STEP 01 // IDENTITY PROTOCOL
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide mt-1">
                    Designate Your Hero Callsign
                  </h3>
                  <p className="font-tech text-xs sm:text-sm text-cyan-200/70 mt-1">
                    Your cybernetic handle will be registered into the Power Puff RPG grid and displayed across multiplayer leaderboards.
                  </p>
                </div>

                {/* Codename Input & Randomizer */}
                <div className="space-y-2">
                  <label className="block font-tech font-bold text-xs uppercase tracking-widest text-cyan-300">
                    HERO CODENAME / CALLSIGN
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Terminal className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
                      <input
                        type="text"
                        maxLength={22}
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                        placeholder="ENTER CALLSIGN..."
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border-2 border-cyan-500/50 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.5)] focus:outline-none font-tech font-black text-base text-cyan-200 uppercase tracking-widest transition-all"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRandomizeCallsign}
                      className="px-4 py-3 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-500/30 text-xs font-tech font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                      title="Generate Random Cyberpunk Callsign"
                    >
                      <Dices className="w-4 h-4" />
                      <span className="hidden sm:inline">Randomize</span>
                    </motion.button>
                  </div>
                </div>

                {/* Base Avatar Model Picker (Emily vs Ren) */}
                <div className="space-y-3 pt-2">
                  <label className="block font-tech font-bold text-xs uppercase tracking-widest text-cyan-300">
                    SELECT NEURAL CHIBI AVATAR
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Emily */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChooseAvatar('emily')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        characterAvatar === 'emily'
                          ? 'border-pink-400 bg-pink-500/15 shadow-[0_0_25px_rgba(244,114,182,0.4)]'
                          : 'border-cyan-500/30 bg-black/40 hover:border-cyan-400'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-black/60 border border-pink-400/50 flex items-center justify-center shadow-inner relative overflow-hidden flex-shrink-0">
                        <AnimeMascot character="emily" pose="wave" size={80} currentTheme="cyberpunk-neon" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-sm text-pink-300 uppercase">
                            Emily ♀ // Celestial Scout
                          </h4>
                          {characterAvatar === 'emily' && <Check className="w-4 h-4 text-pink-400" />}
                        </div>
                        <p className="font-tech text-xs text-pink-200/70 mt-1">
                          Luminous fairy wings, celestial tactical halo, and radiant encouragement buffs.
                        </p>
                      </div>
                    </motion.div>

                    {/* Ren */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChooseAvatar('ren')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                        characterAvatar === 'ren'
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                          : 'border-cyan-500/30 bg-black/40 hover:border-cyan-400'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-2xl bg-black/60 border border-cyan-400/50 flex items-center justify-center shadow-inner relative overflow-hidden flex-shrink-0">
                        <AnimeMascot character="ren" pose="cyber" size={80} currentTheme="cyberpunk-neon" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-sm text-cyan-300 uppercase">
                            Ren ♂ // Cyber Knight
                          </h4>
                          {characterAvatar === 'ren' && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="font-tech text-xs text-cyan-200/70 mt-1">
                          Cybernetic armor plates, energy blade vanguard, and overclocked focus radar.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Class / Archetype Selector */}
                <div className="space-y-3 pt-2">
                  <label className="block font-tech font-bold text-xs uppercase tracking-widest text-cyan-300">
                    CHOOSE CLASS ARCHETYPE
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ARCHETYPES.map((arch) => {
                      const Icon = arch.icon;
                      const isSelected = archetype.id === arch.id;
                      return (
                        <div
                          key={arch.id}
                          onClick={() => {
                            setArchetype(arch);
                            triggerGameFX('cyberpunk', window.innerWidth / 2, window.innerHeight / 2);
                          }}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? `${arch.accent} ${arch.glow} scale-[1.02]`
                              : 'border-cyan-500/30 bg-black/40 hover:border-cyan-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                                {arch.title}
                              </span>
                            </div>
                            <span className="font-tech font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-black/50 border border-current">
                              +{arch.primaryStat}
                            </span>
                          </div>
                          <p className="font-tech text-xs text-cyan-200/70 mt-1.5 leading-snug">
                            {arch.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* ================= STEP 2: GUILD ALIGNMENT ================= */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-tech text-xs uppercase font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-300" /> STEP 02 // GUILD ALIGNMENT MATRIX
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide mt-1">
                    Align With Your Sister Guild
                  </h3>
                  <p className="font-tech text-xs sm:text-sm text-cyan-200/70 mt-1">
                    In the Power Puff universe, each guild channels distinct tactical power. Choose the house that fuels your ambition.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {HOUSES.map((house) => {
                    const isSelected = personalityHouse.key === house.key;
                    return (
                      <motion.div
                        key={house.key}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          setPersonalityHouse(house);
                          triggerGameFX(house.key === 'buttercup' ? 'strength' : (house.key === 'bubbles' ? 'vitality' : 'intellect'));
                        }}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                          isSelected
                            ? `${house.color} ${house.glow} bg-black/75`
                            : 'border-cyan-500/30 bg-black/40 hover:border-cyan-400'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-black/70 border border-current flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                              {house.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className={`font-display font-black text-base sm:text-lg uppercase tracking-wide ${house.textColor}`}>
                                  {house.name}
                                </h4>
                                <span className={`px-2.5 py-0.5 rounded-full font-tech font-bold text-[10px] uppercase tracking-wider border ${house.badge}`}>
                                  {house.tagline}
                                </span>
                              </div>
                              <p className="font-tech text-xs text-slate-300 mt-1">
                                COMMANDER: <span className="font-display font-bold text-white">{house.leader}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                            <div className="text-left sm:text-right">
                              <span className="font-tech font-bold text-[10px] uppercase text-cyan-400 block tracking-widest">
                                INNATE COMBAT BLESSING
                              </span>
                              <span className="font-display font-bold text-xs text-white">
                                {house.perk}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ================= STEP 3: STAT MATRIX & TACTICAL GEAR ================= */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-tech text-xs uppercase font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-300" /> STEP 03 // STAT MATRIX & LOADOUT
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide mt-1">
                    Allocate Attributes & Cyberware
                  </h3>
                  <p className="font-tech text-xs sm:text-sm text-cyan-200/70 mt-1">
                    Tune your real-world RPG capabilities. Distribute surplus neural energy reserves to calibrate your starting build.
                  </p>
                </div>

                {/* Point Allocation Pool Strip */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-2 font-tech font-bold text-xs uppercase tracking-wider text-cyan-300">
                    <Cpu className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>UNALLOCATED NEURAL POINTS:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-amber-300 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                      {unallocatedPoints} PTS
                    </span>
                  </div>
                </div>

                {/* 4 Attributes Adjuster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'intellect', name: 'Intellect', icon: Brain, color: 'text-indigo-400', desc: 'Focus sprints & problem-solving' },
                    { key: 'strength', name: 'Strength', icon: Sword, color: 'text-rose-400', desc: 'Physical grit & hard boss quests' },
                    { key: 'vitality', name: 'Vitality', icon: Heart, color: 'text-emerald-400', desc: 'Sleep, nutrition & hydration' },
                    { key: 'mind', name: 'Mind', icon: Sparkles, color: 'text-amber-400', desc: 'Mindfulness & situational clarity' }
                  ].map((attr) => {
                    const Icon = attr.icon;
                    const val = stats[attr.key];
                    return (
                      <div key={attr.key} className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${attr.color}`} />
                            <span className="font-display font-black text-sm uppercase text-white">
                              {attr.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStatChange(attr.key, -1)}
                              disabled={val <= 10}
                              className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-white font-tech font-black text-sm hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-pixel font-bold text-xs text-cyan-300 w-8 text-center">
                              {val}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStatChange(attr.key, 1)}
                              disabled={unallocatedPoints <= 0}
                              className="w-7 h-7 rounded-lg bg-cyan-900 border border-cyan-400 text-cyan-300 font-tech font-black text-sm hover:bg-cyan-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20 mt-2">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                            style={{ width: `${Math.min(100, (val / 30) * 100)}%` }}
                          />
                        </div>
                        <span className="font-tech text-[10px] text-cyan-200/60 mt-1 block">
                          {attr.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tactical Cyberware Gear */}
                <div className="space-y-3 pt-2">
                  <label className="block font-tech font-bold text-xs uppercase tracking-widest text-cyan-300">
                    STARTER CYBERWARE IMPLANT
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TACTICAL_GEAR.map((gear) => {
                      const Icon = gear.icon;
                      const isSelected = tacticalGear.name === gear.name;
                      return (
                        <div
                          key={gear.name}
                          onClick={() => setTacticalGear(gear)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                              : 'border-cyan-500/30 bg-black/40 hover:border-cyan-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-cyan-300" />
                              <span className="font-display font-black text-xs uppercase text-white truncate">
                                {gear.name}
                              </span>
                            </div>
                            <span className="font-tech font-bold text-[10px] uppercase text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                              {gear.statBonus}
                            </span>
                          </div>
                          <p className="font-tech text-xs text-cyan-200/70 mt-1 leading-snug">
                            {gear.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* ================= STEP 4: HOLO-REVIEW & GRID LINK ================= */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="font-tech text-xs uppercase font-bold text-cyan-400 tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-300" /> STEP 04 // PROTOCOL COMPLETE
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wide mt-1">
                    Holographic Hero Dossier
                  </h3>
                  <p className="font-tech text-xs sm:text-sm text-cyan-200/70 mt-1">
                    Your avatar parameters have been codified. Review your credentials before jacking into the live virtual world.
                  </p>
                </div>

                {/* Holographic ID Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0a1226] via-[#060b18] to-black border-2 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.4)] relative overflow-hidden">
                  
                  {/* Holographic Sheen Line */}
                  <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" />

                  <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    
                    {/* Avatar Display Stage */}
                    <div className="relative flex-shrink-0 flex flex-col items-center">
                      <div className="w-28 h-28 rounded-3xl bg-black/80 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center p-2 relative overflow-hidden">
                        <AnimeMascot 
                          character={characterAvatar} 
                          pose="jump" 
                          size={110} 
                          currentTheme="cyberpunk-neon" 
                        />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <span className="mt-2 text-[10px] font-pixel text-cyan-300 uppercase tracking-wider">
                        {characterAvatar === 'ren' ? 'REN // KNIGHT' : 'EMILY // FAIRY'}
                      </span>
                    </div>

                    {/* ID Details */}
                    <div className="flex-1 text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-cyan-500/30">
                        <div>
                          <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-cyan-400">
                            OFFICIAL CALLSIGN
                          </span>
                          <h4 className="font-display font-black text-2xl text-white tracking-wider uppercase">
                            {callsign || 'CYBER-HERO'}
                          </h4>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-tech font-bold uppercase tracking-wider border ${personalityHouse.badge}`}>
                          {personalityHouse.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-tech pt-1">
                        <div>
                          <span className="text-cyan-400/70 block uppercase">ARCHETYPE:</span>
                          <span className="font-display font-bold text-white">{archetype.title}</span>
                        </div>
                        <div>
                          <span className="text-cyan-400/70 block uppercase">EQUIPPED GEAR:</span>
                          <span className="font-display font-bold text-amber-300">{tacticalGear.name}</span>
                        </div>
                        <div>
                          <span className="text-cyan-400/70 block uppercase">STARTING RANK:</span>
                          <span className="font-display font-bold text-cyan-300">Level 1 // Recruit</span>
                        </div>
                        <div>
                          <span className="text-cyan-400/70 block uppercase">INITIAL GOLD BOUNTY:</span>
                          <span className="font-display font-bold text-amber-400">500 G</span>
                        </div>
                      </div>

                      {/* Stat meters readout */}
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                        <div className="p-2 rounded-xl bg-black/60 border border-indigo-500/40">
                          <span className="text-[10px] font-tech text-indigo-300 uppercase block">INT</span>
                          <span className="font-pixel text-xs text-white">{stats.intellect}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/60 border border-rose-500/40">
                          <span className="text-[10px] font-tech text-rose-300 uppercase block">STR</span>
                          <span className="font-pixel text-xs text-white">{stats.strength}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/60 border border-emerald-500/40">
                          <span className="text-[10px] font-tech text-emerald-300 uppercase block">VIT</span>
                          <span className="font-pixel text-xs text-white">{stats.vitality}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/60 border border-amber-500/40">
                          <span className="text-[10px] font-tech text-amber-300 uppercase block">MND</span>
                          <span className="font-pixel text-xs text-white">{stats.mind}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Final Launch Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleFinalizeHero}
                    className="w-full sm:flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500 text-slate-950 font-display font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.7)] cursor-pointer"
                  >
                    <Zap className="w-5 h-5 fill-slate-950" />
                    <span>JACK INTO THE GRID</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateAccount}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-black/70 border-2 border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-300 font-tech font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Create Permanent Account
                  </motion.button>
                </div>

              </motion.div>
            )}

          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="px-6 py-4 border-t border-cyan-500/30 bg-black/60 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setStep(prev => prev + 1);
                  triggerGameFX('cyberpunk', window.innerWidth / 2, window.innerHeight / 2);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-tech font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                <span>Proceed To Step {step + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            ) : (
              <span className="font-tech text-xs text-cyan-400 uppercase tracking-widest font-bold">
                READY TO INITIALIZE
              </span>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
