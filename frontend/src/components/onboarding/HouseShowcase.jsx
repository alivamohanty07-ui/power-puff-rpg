import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Heart, Sword, ChevronRight } from 'lucide-react';
import { HOUSES } from '../../utils/houseSorting';

export default function HouseShowcase({ onStartTrial }) {
  // Step: 'blossom' | 'bubbles' | 'buttercup' | 'ready'
  const [currentHouseStep, setCurrentHouseStep] = useState('blossom');

  const stepOrder = ['blossom', 'bubbles', 'buttercup', 'ready'];
  const currentIndex = stepOrder.indexOf(currentHouseStep);

  const handleNext = () => {
    if (currentIndex < stepOrder.length - 1) {
      setCurrentHouseStep(stepOrder[currentIndex + 1]);
    } else {
      onStartTrial();
    }
  };

  const currentHouse = HOUSES[currentHouseStep];

  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden">
      
      {/* Top Stepper Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-amber-300/80 font-bold">
            GUILD REVELATION
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs font-mono text-slate-400">
            0{Math.min(currentIndex + 1, 3)} / 03
          </span>
        </div>

        <div className="flex items-center gap-2">
          {['blossom', 'bubbles', 'buttercup'].map((hKey, idx) => (
            <button
              key={hKey}
              onClick={() => setCurrentHouseStep(hKey)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                currentHouseStep === hKey
                  ? 'w-7 bg-amber-300 shadow-[0_0_10px_#f59e0b]'
                  : idx < currentIndex
                    ? 'bg-slate-500'
                    : 'bg-slate-700 hover:bg-slate-600'
              }`}
              title={`View ${HOUSES[hKey].name}`}
            />
          ))}
        </div>
      </div>

      {/* Main Dynamic Showcase Stage */}
      <div className="relative flex-grow flex items-center justify-center my-auto py-6">
        <AnimatePresence mode="wait">
          
          {/* ========================================================================= */}
          {/* 1. HOUSE BLOSSOM SCENE                                                    */}
          {/* ========================================================================= */}
          {currentHouseStep === 'blossom' && (
            <motion.div
              key="blossom"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-2xl mx-auto flex flex-col items-center text-center"
            >
              {/* Atmospheric Background: Rose/Violet Petals & Celestial Library */}
              <div 
                className="absolute -inset-16 pointer-events-none -z-10 rounded-full blur-3xl opacity-35"
                style={{
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 80%)'
                }}
              />

              {/* Floating Flower Petals and Starlight Sparks */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                {['🌸', '✧', '🌸', '✦', '🌸', '✧', '🌸'].map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-pink-300 text-sm select-none"
                    style={{
                      left: `${(i * 18 + 8) % 92}%`,
                      top: `${(i * 22 + 10) % 85}%`,
                      filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.6))'
                    }}
                    animate={{
                      y: [0, -45, 0],
                      x: [0, (i % 2 === 0 ? 15 : -15), 0],
                      rotate: [0, 45, 0],
                      opacity: [0.2, 0.85, 0.2]
                    }}
                    transition={{
                      duration: 4.5 + (i % 3),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut'
                    }}
                  >
                    {p}
                  </motion.div>
                ))}
              </div>

              {/* Distant Academy / Library Silhouette Watermark */}
              <div className="absolute -top-10 opacity-15 pointer-events-none -z-10">
                <BookOpen className="w-56 h-56 text-pink-300/40" />
              </div>

              {/* House Emblem Banner */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-900/40 to-slate-900 border-2 border-pink-400/60 shadow-[0_0_35px_rgba(236,72,153,0.4)] flex items-center justify-center text-4xl sm:text-5xl mb-5"
              >
                🌸
              </motion.div>

              <span className="px-3.5 py-1 rounded-full text-[11px] font-sans font-bold tracking-[0.25em] uppercase bg-pink-500/15 border border-pink-400/40 text-pink-300 mb-2">
                HOUSE BLOSSOM
              </span>

              <h2 className="font-fantasy font-black text-3xl sm:text-5xl tracking-wide text-slate-100 uppercase">
                "THE STRATEGISTS"
              </h2>

              <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-lg mt-3 leading-relaxed">
                "{HOUSES.blossom.description}"
              </p>

              {/* Traits Revealed Sequentially */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {HOUSES.blossom.traits.map((trait, i) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    className="px-4 py-2 rounded-xl bg-slate-900/80 border border-pink-500/50 text-pink-200 font-fantasy font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(236,72,153,0.2)] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                    <span>{trait}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 2. HOUSE BUBBLES SCENE                                                    */}
          {/* ========================================================================= */}
          {currentHouseStep === 'bubbles' && (
            <motion.div
              key="bubbles"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-2xl mx-auto flex flex-col items-center text-center"
            >
              {/* Atmospheric Background: Cyan/Aqua Sanctuary & Water Motion */}
              <div 
                className="absolute -inset-16 pointer-events-none -z-10 rounded-full blur-3xl opacity-35"
                style={{
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 80%)'
                }}
              />

              {/* Floating Spherical Bubbles and Water Motes */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                {['🫧', '💧', '🫧', '✨', '🫧', '💧', '🫧'].map((b, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-cyan-300 text-base select-none"
                    style={{
                      left: `${(i * 19 + 6) % 94}%`,
                      top: `${(i * 21 + 12) % 86}%`,
                      filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.7))'
                    }}
                    animate={{
                      y: [0, -55, 0],
                      x: [0, (i % 2 === 0 ? -12 : 12), 0],
                      scale: [0.9, 1.25, 0.9],
                      opacity: [0.25, 0.9, 0.25]
                    }}
                    transition={{
                      duration: 4.0 + (i % 3),
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeInOut'
                    }}
                  >
                    {b}
                  </motion.div>
                ))}
              </div>

              {/* Distant Sanctuary Silhouette Watermark */}
              <div className="absolute -top-10 opacity-15 pointer-events-none -z-10">
                <Heart className="w-56 h-56 text-cyan-300/40" />
              </div>

              {/* House Emblem Banner */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-900/40 to-slate-900 border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.4)] flex items-center justify-center text-4xl sm:text-5xl mb-5"
              >
                🫧
              </motion.div>

              <span className="px-3.5 py-1 rounded-full text-[11px] font-sans font-bold tracking-[0.25em] uppercase bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 mb-2">
                HOUSE BUBBLES
              </span>

              <h2 className="font-fantasy font-black text-3xl sm:text-5xl tracking-wide text-slate-100 uppercase">
                "THE VITAL GUARDIANS"
              </h2>

              <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-lg mt-3 leading-relaxed">
                "{HOUSES.bubbles.description}"
              </p>

              {/* Traits Revealed Sequentially */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {HOUSES.bubbles.traits.map((trait, i) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    className="px-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/50 text-cyan-200 font-fantasy font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{trait}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 3. HOUSE BUTTERCUP SCENE                                                  */}
          {/* ========================================================================= */}
          {currentHouseStep === 'buttercup' && (
            <motion.div
              key="buttercup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-2xl mx-auto flex flex-col items-center text-center"
            >
              {/* Atmospheric Background: Amber/Gold Energy & Arena Glow */}
              <div 
                className="absolute -inset-16 pointer-events-none -z-10 rounded-full blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(239, 68, 68, 0.25) 50%, transparent 80%)'
                }}
              />

              {/* Flying Sparks, Electric Embers & Fireflies */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                {['⚡', '🔥', '✦', '⚡', '💥', '✦', '⚡'].map((s, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-amber-300 text-sm select-none"
                    style={{
                      left: `${(i * 17 + 9) % 94}%`,
                      top: `${(i * 24 + 8) % 88}%`,
                      filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))'
                    }}
                    animate={{
                      y: [0, -60, 0],
                      x: [0, (i % 2 === 0 ? 20 : -20), 0],
                      scale: [0.8, 1.3, 0.8],
                      opacity: [0.3, 0.95, 0.3]
                    }}
                    transition={{
                      duration: 3.2 + (i % 2.5),
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut'
                    }}
                  >
                    {s}
                  </motion.div>
                ))}
              </div>

              {/* Distant Mountain Arena Silhouette Watermark */}
              <div className="absolute -top-10 opacity-15 pointer-events-none -z-10">
                <Sword className="w-56 h-56 text-amber-400/40" />
              </div>

              {/* House Emblem Banner */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-950/50 to-slate-900 border-2 border-amber-400/70 shadow-[0_0_35px_rgba(245,158,11,0.45)] flex items-center justify-center text-4xl sm:text-5xl mb-5"
              >
                ⚡
              </motion.div>

              <span className="px-3.5 py-1 rounded-full text-[11px] font-sans font-bold tracking-[0.25em] uppercase bg-amber-500/15 border border-amber-400/40 text-amber-300 mb-2">
                HOUSE BUTTERCUP
              </span>

              <h2 className="font-fantasy font-black text-3xl sm:text-5xl tracking-wide text-slate-100 uppercase">
                "THE FRONTLINE"
              </h2>

              <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-lg mt-3 leading-relaxed">
                "{HOUSES.buttercup.description}"
              </p>

              {/* Traits Revealed Sequentially */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {HOUSES.buttercup.traits.map((trait, i) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    className="px-4 py-2 rounded-xl bg-slate-900/80 border border-amber-500/50 text-amber-200 font-fantasy font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{trait}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* 4. TRANSITION TO TRIAL READY STAGE                                        */}
          {/* ========================================================================= */}
          {currentHouseStep === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xl mx-auto flex flex-col items-center text-center py-4"
            >
              {/* 3 House Crest Icons in Harmony */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-400/50 flex items-center justify-center text-2xl shadow-theme-glow">
                  🌸
                </div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-2xl shadow-theme-glow">
                  🫧
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-2xl shadow-theme-glow">
                  ⚡
                </div>
              </div>

              <span className="text-xs font-sans tracking-[0.35em] uppercase text-amber-300 font-bold mb-2">
                ✦ THE TIE OF DESTINY ✦
              </span>

              <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase leading-tight">
                THREE HOUSES.<br />THREE PATHS.
              </h2>

              <p className="font-fantasy text-base sm:text-xl text-amber-200/90 tracking-widest italic mt-3">
                BUT WHICH ONE IS YOURS?
              </p>

              <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-md mx-auto mt-4 leading-relaxed">
                YOUR CHOICES WILL REVEAL THE PATH.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartTrial}
                className="mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500/25 via-purple-600/35 to-amber-500/25 border-2 border-amber-400/70 hover:border-amber-300 text-amber-100 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.55)] transition-all flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>BEGIN THE INDUCTION →</span>
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Navigation Control (When not in 'ready' stage) */}
      {currentHouseStep !== 'ready' && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentHouseStep(stepOrder[currentIndex - 1]);
              }
            }}
            disabled={currentIndex === 0}
            className={`text-xs font-sans uppercase tracking-wider transition-colors ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-600' : 'text-slate-400 hover:text-slate-200 cursor-pointer'
            }`}
          >
            ← Previous Guild
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-slate-900 border border-amber-400/50 hover:border-amber-300 text-amber-200 font-fantasy text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>{currentIndex === 2 ? 'Proceed to Trial' : 'Next Guild'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      )}

    </div>
  );
}
