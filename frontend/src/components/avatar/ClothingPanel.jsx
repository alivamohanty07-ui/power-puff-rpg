import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { OUTFITS } from '../../utils/avatarData';

export default function ClothingPanel({
  avatar,
  onChange,
  onLockedClick,
  house = 'blossom'
}) {
  return (
    <div className="flex flex-col gap-4 select-none">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
        <div>
          <label className="font-fantasy font-bold text-xs uppercase tracking-wider text-slate-200">
            WARDROBE ATTIRE
          </label>
          <p className="text-[11px] font-sans text-slate-400 mt-0.5">
            Initial robes are tailored with your house sigils. Higher-tier regalia unlocks as you level up.
          </p>
        </div>
      </div>

      {/* Outfits List */}
      <div className="space-y-3">
        {OUTFITS.map((outfit) => {
          const isSelected = avatar.outfit === outfit.id;
          const isLocked = !outfit.free;

          return (
            <motion.button
              key={outfit.id}
              whileHover={isLocked ? {} : { scale: 1.015, x: 2 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => {
                if (isLocked) {
                  if (onLockedClick) onLockedClick(outfit.name, outfit.requiredLevel);
                } else {
                  onChange('outfit', outfit.id);
                }
              }}
              className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 text-left ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400/15 via-slate-900 to-purple-900/20 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-amber-100'
                  : isLocked
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 cursor-pointer'
                    : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
              }`}
            >
              {/* Outfit Icon & Descriptions */}
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  isSelected 
                    ? 'bg-amber-400/20 border-amber-300 shadow-sm'
                    : isLocked 
                      ? 'bg-slate-950 border-slate-800 opacity-60' 
                      : 'bg-slate-800 border-slate-700'
                }`}>
                  {outfit.previewIcon}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-fantasy font-bold text-sm text-slate-100 tracking-wide">
                      {outfit.name}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        Equipped
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-tech font-bold uppercase tracking-wider text-amber-300/80 mt-0.5">
                    {outfit.subtitle}
                  </div>
                  <p className="text-[11px] font-sans text-slate-400 mt-0.5 leading-snug">
                    {outfit.desc}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {isLocked ? (
                  <span className="px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-800/80 text-xs font-tech font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5 shadow-sm">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>LV. {outfit.requiredLevel}</span>
                  </span>
                ) : (
                  isSelected && (
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
