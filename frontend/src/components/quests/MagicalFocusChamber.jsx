import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Brain, 
  Sword, 
  Heart, 
  Clock, 
  Eye, 
  Award,
  Compass
} from 'lucide-react';
import AvatarRenderer from '../avatar/AvatarRenderer';
import { triggerGameFX } from '../GameFX';

export default function MagicalFocusChamber({
  quest,
  avatar,
  house,
  onPauseQuest,
  onResumeQuest,
  onCompleteQuest,
  onAbandonQuest,
  isCompleting
}) {
  // Timer Visual Modes: 'digital' | 'analog' | 'arcane'
  const [visualMode, setVisualMode] = useState('digital');

  // Core Timer State (Independent of visual presentation)
  const totalSeconds = (quest.duration_minutes || 30) * 60;
  const initialElapsed = quest.elapsed_seconds || 0;
  
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsed);
  const [isPaused, setIsPaused] = useState(quest.status === 'paused');
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);

  // Companion accountability check-in states
  const [companionDialogue, setCompanionDialogue] = useState("Stay the course, adventurer! The first minutes build the greatest momentum.");
  const [checkInPrompt, setCheckInPrompt] = useState(null); // null | 'halfway' | 'routine'

  const timerRef = useRef(null);

  // Tick effect
  useEffect(() => {
    if (!isPaused && elapsedSeconds < totalSeconds) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;

          // Check-in triggers
          if (next === Math.floor(totalSeconds / 2) && !checkInPrompt) {
            setCheckInPrompt('halfway');
            setCompanionDialogue("Halfway there! Your focus is truly legendary.");
          } else if (next === totalSeconds - 120 && !checkInPrompt) {
            setCompanionDialogue("The finish line is close! Summon your final burst of resolve!");
          }

          if (next >= totalSeconds) {
            clearInterval(timerRef.current);
            handleAutoFinish();
          }
          return next;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, totalSeconds]);

  const handleTogglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      onResumeQuest(quest.id);
      setCompanionDialogue("Back into the flow! Adventure waits for no one.");
    } else {
      setIsPaused(true);
      onPauseQuest(quest.id, elapsedSeconds);
      setCompanionDialogue("Rest your focus a moment, then let's finish strong.");
    }
  };

  const handleAutoFinish = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#10b981']
    });
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
    onCompleteQuest(quest.id);
  };

  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);
  const progressRatio = Math.min(elapsedSeconds / totalSeconds, 1);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Activity-specific atmospheric props
  const titleLower = `${quest.title} ${quest.category}`.toLowerCase();
  const isMath = titleLower.includes('math') || titleLower.includes('physic') || titleLower.includes('science');
  const isCode = titleLower.includes('code') || titleLower.includes('program') || titleLower.includes('tech');
  const isGym = titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('strength');
  const isRead = titleLower.includes('read') || titleLower.includes('book') || titleLower.includes('write');
  const isArt = titleLower.includes('paint') || titleLower.includes('draw') || titleLower.includes('music');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#04060e] text-slate-100 p-4 sm:p-8 select-none overflow-hidden">
      
      {/* Dynamic Activity-Specific Ambient Nebula */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 transition-all duration-1000"
        style={{
          background: isCode
            ? 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.22) 0%, rgba(15, 23, 42, 0.8) 50%, #020617 95%)'
            : isGym
              ? 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.22) 0%, rgba(239, 68, 68, 0.15) 50%, #020617 95%)'
              : isArt
                ? 'radial-gradient(circle at 50% 30%, rgba(236, 72, 153, 0.22) 0%, rgba(168, 85, 247, 0.2) 50%, #020617 95%)'
                : 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25) 0%, rgba(15, 23, 42, 0.8) 50%, #020617 95%)'
        }}
      />

      {/* Floating Ambient Runes & Symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg sm:text-xl select-none"
            style={{
              left: `${(i * 19 + 7) % 94}%`,
              top: `${(i * 23 + 11) % 88}%`,
              opacity: 0.25
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.15, 0.45, 0.15],
              scale: [0.9, 1.2, 0.9]
            }}
            transition={{
              duration: 4.5 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {isMath ? '∑' : isCode ? '< />' : isGym ? '⚡' : isRead ? '📖' : isArt ? '✦' : '✨'}
          </motion.div>
        ))}
      </div>

      {/* Top Header: Quest Title & Visual Mode Switcher */}
      <div className="w-full max-w-4xl flex items-center justify-between gap-4 z-20">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-amber-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> ACTIVE FOCUS EXPEDITION
          </span>
          <h2 className="font-fantasy font-black text-xl sm:text-2xl text-slate-100 uppercase tracking-wide truncate max-w-sm sm:max-w-md">
            {quest.title}
          </h2>
        </div>

        {/* Visual Mode Toggle Strip */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
          {['digital', 'analog', 'arcane'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setVisualMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer ${
                visualMode === mode
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Central Visual Focus Timer Chamber */}
      <div className="my-auto flex flex-col items-center justify-center relative w-full max-w-lg z-10 py-6">
        
        {/* MODE 1: DIGITAL MODE */}
        {visualMode === 'digital' && (
          <motion.div
            key="digital"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative font-mono font-black text-7xl sm:text-8xl tracking-tight text-slate-100 drop-shadow-[0_0_40px_rgba(245,158,11,0.4)]">
              {formatTime(remainingSeconds)}
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-64 sm:w-80 h-2 rounded-full bg-slate-900/80 border border-slate-800 mt-6 overflow-hidden p-0.5">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* MODE 2: ANALOG ENCHANTED CLOCK */}
        {visualMode === 'analog' && (
          <motion.div
            key="analog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-slate-950/80 border-4 border-amber-400/50 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.3)]"
          >
            {/* Clock Ticks */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-3 bg-slate-700/80 rounded-full"
                style={{
                  top: 10,
                  transformOrigin: 'bottom center',
                  transform: `rotate(${i * 30}deg) translateY(0)`
                }}
              />
            ))}

            {/* Orbiting Radial Sweep Hand */}
            <div 
              className="absolute inset-0 flex items-center justify-center transition-transform"
              style={{ transform: `rotate(${progressRatio * 360}deg)` }}
            >
              <div className="w-1 h-24 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              <div className="absolute top-4 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
            </div>

            {/* Center Time Readout */}
            <div className="z-10 font-mono font-black text-3xl text-slate-100 drop-shadow-md">
              {formatTime(remainingSeconds)}
            </div>
          </motion.div>
        )}

        {/* MODE 3: ARCANE RUNIC RING */}
        {visualMode === 'arcane' && (
          <motion.div
            key="arcane"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center"
          >
            {/* Rotating Runic Outer Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40"
            />

            {/* SVG Arc Progress Circle */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="115"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-900 fill-none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="115"
                stroke="url(#arcaneGlow)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 115}
                strokeDashoffset={2 * Math.PI * 115 * (1 - progressRatio)}
                strokeLinecap="round"
                className="fill-none transition-all duration-300"
              />
              <defs>
                <linearGradient id="arcaneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Glyph & Time */}
            <div className="absolute flex flex-col items-center">
              <span className="text-amber-400 text-lg mb-1">✦ ⚔️ ✦</span>
              <div className="font-mono font-black text-4xl text-slate-100 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                {formatTime(remainingSeconds)}
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-purple-300 mt-1">
                {Math.round(progressRatio * 100)}% FORGED
              </span>
            </div>
          </motion.div>
        )}

        {/* Paused Banner */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>QUEST PAUSED — BREATHE & RECHARGE</span>
          </motion.div>
        )}

      </div>

      {/* Companion Accountability Bar & Dialogue */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl z-20">
        <div className="w-16 h-16 shrink-0 flex items-center justify-center">
          <AvatarRenderer
            base={avatar?.base || 'female'}
            skinTone={avatar?.skinTone || 'porcelain'}
            hairstyle={avatar?.hairstyle || 'twin-tails'}
            hairColor={avatar?.hairColor || 'pastel-rose'}
            outfit={avatar?.outfit || 'academy-uniform'}
            house={house?.id || 'blossom'}
            size={70}
            isAnimated={true}
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-sans text-slate-300 italic leading-relaxed">
            "{companionDialogue}"
          </p>

          {checkInPrompt && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  setCheckInPrompt(null);
                  setCompanionDialogue("Splendid focus! Keep marching forward.");
                  triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
                }}
                className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 text-[11px] font-bold uppercase tracking-wider"
              >
                I'm Here!
              </button>
              <button
                onClick={() => {
                  setCheckInPrompt(null);
                  handleTogglePause();
                }}
                className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-[11px] uppercase tracking-wider"
              >
                Need A Pause
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePause}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume Focus' : 'Pause Focus'}
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={() => setShowAbandonConfirm(true)}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Abandon Quest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Abandon Confirmation Modal */}
      <AnimatePresence>
        {showAbandonConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-rose-500/60 p-6 text-center shadow-2xl"
            >
              <h3 className="font-fantasy font-black text-xl text-slate-100 uppercase tracking-wide mb-2">
                Leave this quest behind?
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Abandoning will forfeit today's progress and potential bounty rewards for this session.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowAbandonConfirm(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-sans font-bold uppercase text-slate-300 hover:text-white"
                >
                  Continue Quest
                </button>
                <button
                  onClick={() => {
                    setShowAbandonConfirm(false);
                    onAbandonQuest(quest.id);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-sans font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  Abandon
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
