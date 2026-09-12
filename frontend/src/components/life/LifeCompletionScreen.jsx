import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ShieldCheck, Compass, ArrowRight, Clock, BookOpen, Heart } from 'lucide-react';
import AvatarRenderer from '../avatar/AvatarRenderer';
import { triggerGameFX } from '../GameFX';

export default function LifeCompletionScreen({
  profile,
  avatar,
  house,
  onContinue
}) {
  useEffect(() => {
    // Grand celebration confetti burst
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.55 },
      colors: ['#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#10b981']
    });

    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  }, []);

  const pathTitle = profile?.path?.path_type 
    ? profile.path.path_type.replace('_', ' ').toUpperCase()
    : 'HERO';

  const interestsList = profile?.interests || [];
  const scheduleList = profile?.schedule || [];

  return (
    <div className="relative min-h-[640px] w-full max-w-4xl mx-auto flex flex-col items-center justify-between text-center p-6 sm:p-10 select-none">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 rounded-full blur-3xl opacity-50"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.25) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)'
        }}
      />

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-emerald-400 font-bold flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-4 h-4" /> REALM SYNCHRONIZATION CONCLUDED
        </span>

        <h1 className="font-fantasy font-black text-3xl sm:text-5xl text-slate-100 tracking-wider uppercase leading-tight">
          YOUR WORLD HAS TAKEN SHAPE
        </h1>

        <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-xl mt-3 leading-relaxed">
          "We know what you do, what you love, and how your days unfold. Your adventure is ready to begin."
        </p>
      </motion.div>

      {/* Central Heroic Showcase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full my-8 text-left"
      >
        {/* Left: Avatar & House Card */}
        <div className="rounded-3xl bg-slate-950/80 border-2 border-amber-400/50 p-5 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(245,158,11,0.2)]">
          <div className="w-36 h-36 flex items-center justify-center">
            <AvatarRenderer
              base={avatar?.base || 'female'}
              skinTone={avatar?.skinTone || 'porcelain'}
              hairstyle={avatar?.hairstyle || 'twin-tails'}
              hairColor={avatar?.hairColor || 'pastel-rose'}
              outfit={avatar?.outfit || 'academy-uniform'}
              hairAccessory={avatar?.hairAccessory || 'silk-bow'}
              headItem={avatar?.headItem || 'none'}
              handItem={avatar?.handItem || 'apprentice-wand'}
              house={house?.id || 'blossom'}
              size={140}
              isAnimated={true}
            />
          </div>

          <h3 className="font-fantasy font-black text-lg text-slate-100 uppercase tracking-wide mt-2">
            {avatar?.name || 'Initiate Hero'}
          </h3>
          <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
            {house?.name || 'House Blossom'}
          </span>
          <span className="text-[10px] font-sans uppercase tracking-widest text-purple-300 font-bold mt-2">
            ✦ {pathTitle} ✦
          </span>
        </div>

        {/* Middle: Passions & Discipline */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <BookOpen className="w-4 h-4" />
              <h4 className="font-fantasy font-black text-xs sm:text-sm uppercase tracking-wider">
                Craft & Disciplines
              </h4>
            </div>

            {profile?.subjects && profile.subjects.length > 0 ? (
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-bold block">Subjects / Courses:</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.subjects.slice(0, 4).map((sub, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/60 text-purple-200 text-[11px] font-sans">
                      {typeof sub === 'string' ? sub : (sub.subject_name || sub.name)}
                    </span>
                  ))}
                  {profile.subjects.length > 4 && (
                    <span className="text-[10px] text-slate-400 self-center">+{profile.subjects.length - 4} more</span>
                  )}
                </div>
              </div>
            ) : null}

            <div>
              <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-bold block mb-1">Passions:</span>
              <div className="flex flex-wrap gap-1.5">
                {interestsList.slice(0, 5).map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-200 text-xs font-sans font-medium">
                    {item.activity_name}
                  </span>
                ))}
                {interestsList.length > 5 && (
                  <span className="text-[10px] text-slate-400 self-center">+{interestsList.length - 5} more</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-sans text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for personalized quest generation</span>
          </div>
        </div>

        {/* Right: Daily Rhythm Preview */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-amber-400 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4" />
              <h4 className="font-fantasy font-black text-xs sm:text-sm uppercase tracking-wider">
                Daily Rhythm Map
              </h4>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {scheduleList.slice(0, 4).map((block, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="font-fantasy font-bold text-slate-200 truncate max-w-[130px]">
                    {block.activity_name || block.title}
                  </span>
                  <span className="font-mono text-[11px] text-amber-300/80 shrink-0">
                    {block.start_time}–{block.end_time}
                  </span>
                </div>
              ))}
              {scheduleList.length > 4 && (
                <p className="text-[10px] text-slate-500 text-center pt-1">
                  +{scheduleList.length - 4} additional milestones charted
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-sans text-purple-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Harmonized with Power Puff RPG realm</span>
          </div>
        </div>
      </motion.div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md pt-2"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onContinue}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>CONTINUE TO YOUR ADVENTURE ✦</span>
        </motion.button>
      </motion.div>

    </div>
  );
}
