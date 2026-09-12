import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

export default function OnboardingNextStep({ house, onCompleteOnboarding }) {
  return (
    <div className="relative min-h-[550px] sm:min-h-[620px] flex flex-col items-center justify-center text-center p-6 sm:p-10 select-none overflow-hidden">
      
      {/* Ambient Celestial Fog */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.15) 0%, rgba(5, 8, 17, 0.95) 75%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg mx-auto flex flex-col items-center"
      >
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-slate-900 border border-amber-400/50 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-6">
          {house.icon}
        </div>

        <span className="text-xs font-sans tracking-[0.3em] uppercase text-emerald-400 font-bold flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-4 h-4" /> INDUCTION CONCLUDED
        </span>

        <h1 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase leading-tight">
          YOUR HOUSE HAS BEEN CHOSEN.
        </h1>

        <p className="font-fantasy text-base sm:text-xl text-amber-200 tracking-widest uppercase mt-3">
          NEXT: CREATE YOUR AVATAR
        </p>

        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-md mt-4 leading-relaxed">
          You are now attuned as an initiate of <span className="font-bold text-amber-200">{house.name}</span>. Enter the magical chamber to shape your appearance.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCompleteOnboarding}
          className="mt-10 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(245,158,11,0.45)] hover:brightness-110 transition-all flex items-center gap-2.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>CREATE YOUR AVATAR →</span>
        </motion.button>
      </motion.div>

    </div>
  );
}
