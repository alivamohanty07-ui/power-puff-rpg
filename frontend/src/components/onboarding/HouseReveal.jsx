import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCcw, Shield, CheckCircle2 } from 'lucide-react';
import { triggerGameFX } from '../GameFX';

export default function HouseReveal({ house, onConfirm, onRetake }) {
  useEffect(() => {
    // Grand celebration particle burst matching house colors
    const colors = house.atmosphere.palette;
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.55 },
      colors
    });

    triggerGameFX(
      house.id === 'blossom' ? 'intellect' : (house.id === 'bubbles' ? 'vitality' : 'strength'),
      window.innerWidth / 2,
      window.innerHeight / 2
    );
  }, [house]);

  const isBlossom = house.id === 'blossom';
  const isBubbles = house.id === 'bubbles';
  const isButtercup = house.id === 'buttercup';

  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-between text-center p-6 sm:p-10 select-none overflow-hidden">
      
      {/* House-Specific Radial Glow Background */}
      <div 
        className="absolute -inset-24 pointer-events-none -z-10 rounded-full blur-3xl opacity-40"
        style={{
          background: isBlossom
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(168, 85, 247, 0.2) 60%, transparent 80%)'
            : isBubbles
              ? 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(56, 189, 248, 0.2) 60%, transparent 80%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(239, 68, 68, 0.2) 60%, transparent 80%)'
        }}
      />

      {/* Ambient Floating Environmental Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute select-none text-base"
            style={{
              left: `${(i * 18 + 7) % 94}%`,
              top: `${(i * 23 + 9) % 86}%`
            }}
            animate={{
              y: [0, -45, 0],
              opacity: [0.2, 0.85, 0.2],
              scale: [0.9, 1.25, 0.9]
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut'
            }}
          >
            {isBlossom ? '🌸' : (isBubbles ? '🫧' : '⚡')}
          </motion.div>
        ))}
      </div>

      {/* Top Pre-header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs font-sans tracking-[0.3em] uppercase text-amber-300 font-bold">
          ✦ YOUR DESTINY IS SEALED ✦
        </span>
      </motion.div>

      {/* Main Reveal Card Stage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
        className="w-full max-w-xl mx-auto flex flex-col items-center my-auto py-4"
      >
        {/* Emblem Crest */}
        <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950/90 border-2 ${house.borderClass} ${house.glowClass} flex items-center justify-center text-5xl sm:text-6xl mb-6`}>
          <span>{house.icon}</span>
          <span className="absolute -inset-2 rounded-3xl border border-white/20 animate-pulse pointer-events-none" />
        </div>

        {/* Main Title: YOU BELONG TO [HOUSE] */}
        <h1 className="font-fantasy font-black text-3xl sm:text-5xl text-slate-100 tracking-wide uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          YOU BELONG TO {house.name.replace('House ', '').toUpperCase()}
        </h1>

        {/* Subtitle */}
        <h2 className="font-fantasy font-bold text-lg sm:text-xl text-amber-200 tracking-widest uppercase mt-2">
          "{house.title}"
        </h2>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-md mt-3 leading-relaxed">
          "{house.revealDescription}"
        </p>

        {/* House Stat Bonuses */}
        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
          {house.bonuses.map((bonus) => (
            <div
              key={bonus.label}
              className={`p-3.5 rounded-2xl bg-slate-900/85 border ${house.borderClass} flex flex-col items-center justify-center`}
            >
              <span className="text-[10px] font-sans font-bold tracking-widest text-slate-400 uppercase">
                {bonus.label}
              </span>
              <span className="font-fantasy font-black text-xl sm:text-2xl text-slate-100 mt-0.5">
                {bonus.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons: ACCEPT vs RETAKE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-4"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>ACCEPT MY HOUSE →</span>
        </motion.button>

        <button
          onClick={onRetake}
          className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-sans text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RETAKE INDUCTION</span>
        </button>
      </motion.div>

    </div>
  );
}
