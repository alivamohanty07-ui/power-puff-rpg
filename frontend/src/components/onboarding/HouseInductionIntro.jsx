import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function HouseInductionIntro({ onBegin }) {
  return (
    <div className="relative min-h-[550px] sm:min-h-[620px] flex flex-col items-center justify-center text-center px-4 py-8 select-none">
      
      {/* Mystic Atmospheric Fog & Celestial Spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 35%, rgba(168, 85, 247, 0.18) 0%, rgba(6, 182, 212, 0.1) 40%, rgba(5, 8, 17, 0.95) 80%)'
        }}
      />

      {/* Floating Ambient Starlight Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              width: 2 + (i % 3) * 1.5,
              height: 2 + (i % 3) * 1.5,
              left: `${(i * 19 + 7) % 94}%`,
              top: `${(i * 23 + 11) % 88}%`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)'
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.85, 0.2],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Ancient Gateway Crest Sigil */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-purple-900/40 via-slate-900 to-black/80 border-2 border-amber-400/50 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.3)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
          </motion.div>
        </div>
        <span className="absolute -inset-2 rounded-3xl border border-amber-400/20 animate-ping pointer-events-none opacity-40" />
      </motion.div>

      {/* Title & Ceremony Announcement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
        className="space-y-3 max-w-xl"
      >
        <span className="text-xs font-sans tracking-[0.4em] uppercase text-amber-300/80 font-bold">
          ✦ ANCIENT CEREMONY ✦
        </span>

        <h1 className="font-fantasy font-black text-3xl sm:text-5xl lg:text-6xl tracking-wider text-slate-100 uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          THE GUILD INDUCTION
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-fantasy text-lg sm:text-2xl text-amber-200/90 tracking-widest italic pt-1"
        >
          Three paths await you.
        </motion.p>

        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-md mx-auto pt-2 leading-relaxed">
          Before taking your first quest into the realm, your soul must be attuned. Discover which of the three sister houses reflects your spirit.
        </p>
      </motion.div>

      {/* Begin Induction CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBegin}
          className="group px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border-2 border-amber-400/60 hover:border-amber-300 text-amber-100 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all flex items-center gap-3 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
          <span>BEHOLD THE THREE PATHS</span>
          <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

    </div>
  );
}
