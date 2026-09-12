import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { SKIN_TONES, HAIR_COLORS, HAIRSTYLES } from '../../utils/avatarData';

export default function AppearancePanel({
  avatar,
  onChange,
  onLockedClick
}) {
  const currentBase = avatar.base || 'female';
  const availableHairstyles = HAIRSTYLES[currentBase] || HAIRSTYLES.female;

  return (
    <div className="flex flex-col gap-6 select-none">
      
      {/* =================================================================== */}
      {/* 1. SKIN TONE                                                        */}
      {/* =================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-fantasy font-bold text-xs uppercase tracking-wider text-slate-200">
            SKIN TONE
          </label>
          <span className="text-[11px] font-sans text-amber-300 font-medium">
            {SKIN_TONES.find((s) => s.id === avatar.skinTone)?.name || 'Porcelain'}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {SKIN_TONES.map((tone) => {
            const isSelected = avatar.skinTone === tone.id;
            return (
              <motion.button
                key={tone.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange('skinTone', tone.id)}
                className={`relative h-12 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
                style={{ backgroundColor: tone.color }}
                title={tone.name}
              >
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-slate-950/80 text-amber-400 flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. HAIR COLOR                                                       */}
      {/* =================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-fantasy font-bold text-xs uppercase tracking-wider text-slate-200">
            HAIR COLOR
          </label>
          <span className="text-[11px] font-sans text-amber-300 font-medium">
            {HAIR_COLORS.find((h) => h.id === avatar.hairColor)?.name || 'Blossom Lavender'}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {HAIR_COLORS.map((hc) => {
            const isSelected = avatar.hairColor === hc.id;
            return (
              <motion.button
                key={hc.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onChange('hairColor', hc.id)}
                className={`relative h-11 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.55)] scale-105'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${hc.gradient[0]}, ${hc.gradient[1]})`
                }}
                title={hc.name}
              >
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-slate-950/80 text-amber-300 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. HAIRSTYLE                                                        */}
      {/* =================================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-fantasy font-bold text-xs uppercase tracking-wider text-slate-200">
            HAIRSTYLE
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {availableHairstyles.filter((h) => h.free).length} Unlocked • {availableHairstyles.filter((h) => !h.free).length} Quest Rewards
          </span>
        </div>

        <div className="space-y-2">
          {availableHairstyles.map((style) => {
            const isSelected = avatar.hairstyle === style.id;
            const isLocked = !style.free;

            return (
              <motion.button
                key={style.id}
                whileHover={isLocked ? {} : { scale: 1.015, x: 2 }}
                whileTap={isLocked ? {} : { scale: 0.98 }}
                onClick={() => {
                  if (isLocked) {
                    if (onLockedClick) onLockedClick(style.name, style.requiredLevel);
                  } else {
                    onChange('hairstyle', style.id);
                  }
                }}
                className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-left ${
                  isSelected
                    ? 'bg-amber-400/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-amber-100'
                    : isLocked
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-500 hover:border-slate-700 cursor-pointer'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-fantasy font-bold text-xs sm:text-sm tracking-wide">
                      {style.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 mt-0.5">
                    {style.desc}
                  </p>
                </div>

                {isLocked ? (
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-[10px] font-tech font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5 shadow-sm">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>LV. {style.requiredLevel}</span>
                  </span>
                ) : (
                  isSelected && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
