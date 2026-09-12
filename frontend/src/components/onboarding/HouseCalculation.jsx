import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOUSES } from '../../utils/houseSorting';

export default function HouseCalculation({ winningHouse, onFinishCalculation }) {
  // Phase: 'orbiting' | 'resolving'
  const [phase, setPhase] = useState('orbiting');

  useEffect(() => {
    // 2.2s suspenseful orbit, then resolve winning house
    const timer1 = setTimeout(() => {
      setPhase('resolving');
    }, 2200);

    // After resolving finishes (1.2s), transition to full reveal celebration
    const timer2 = setTimeout(() => {
      onFinishCalculation();
    }, 3400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinishCalculation]);

  const houseIcons = [
    { id: 'blossom', icon: '🌸', color: 'border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.5)]' },
    { id: 'bubbles', icon: '🫧', color: 'border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.5)]' },
    { id: 'buttercup', icon: '⚡', color: 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)]' }
  ];

  return (
    <div className="relative min-h-[550px] sm:min-h-[620px] flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden bg-black/95">
      
      {/* Dark Ambient Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30, 27, 75, 0.4) 0%, rgba(0, 0, 0, 0.98) 75%)'
        }}
      />

      {/* Header Announcement */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <span className="text-xs font-sans tracking-[0.4em] uppercase text-amber-300 font-bold">
          ✦ THE ORACLE PONDERS ✦
        </span>
        <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase mt-2">
          ALIGNMENT COMPLETE
        </h2>
        <p className="font-fantasy text-sm text-amber-200/70 tracking-widest italic mt-1">
          Summoning the sacred resonance...
        </p>
      </motion.div>

      {/* Orbiting / Resolving House Sigils Stage */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        
        {/* Orbital Arc Guideline */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: phase === 'orbiting' ? 3.5 : 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-amber-400/20 border-dashed pointer-events-none"
        />

        {/* 3 House Sigils */}
        <AnimatePresence>
          {houseIcons.map((h, index) => {
            const isWinner = h.id === winningHouse.id;
            const angle = (index * 120 * Math.PI) / 180;
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (phase === 'resolving' && !isWinner) {
              // Non-winning houses fade away
              return null;
            }

            return (
              <motion.div
                key={h.id}
                layoutId={h.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  phase === 'orbiting'
                    ? {
                        opacity: 1,
                        x: [x, -y, -x, y, x],
                        y: [y, x, -y, -x, y],
                        scale: [1, 1.15, 1],
                        transition: { duration: 3.5, repeat: Infinity, ease: 'linear' }
                      }
                    : {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1.5,
                        transition: { duration: 0.8, ease: 'backOut' }
                      }
                }
                exit={{ opacity: 0, scale: 0.3, transition: { duration: 0.5 } }}
                className={`absolute w-16 h-16 rounded-2xl bg-slate-900 border-2 flex items-center justify-center text-3xl shadow-2xl ${h.color}`}
              >
                {h.icon}
              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>

      {/* Suspense Indicator Bar */}
      <div className="mt-12 w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.2, ease: 'easeInOut' }}
        />
      </div>

    </div>
  );
}
