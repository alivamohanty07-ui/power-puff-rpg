import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Award } from 'lucide-react';
import { BASES } from '../../utils/avatarData';
import AvatarRenderer from './AvatarRenderer';

export default function BaseSelector({
  selectedBase = 'female',
  onSelectBase,
  house = 'blossom',
  avatar
}) {
  // House metadata
  const houseId = typeof house === 'object' && house?.id ? house.id : String(house || 'blossom').toLowerCase();
  const isBlossom = houseId.includes('blossom');
  const isBubbles = houseId.includes('bubbles');
  const isButtercup = houseId.includes('buttercup');

  const houseName = isBlossom ? 'House Blossom' : (isBubbles ? 'House Bubbles' : 'House Buttercup');
  const houseTitle = isBlossom ? 'THE STRATEGISTS' : (isBubbles ? 'THE VITAL GUARDIANS' : 'THE FRONTLINE');
  const houseIcon = isBlossom ? '🌸' : (isBubbles ? '🫧' : '⚡');
  const houseColor = isBlossom ? 'text-pink-400' : (isBubbles ? 'text-cyan-400' : 'text-amber-400');
  const houseBorder = isBlossom ? 'border-pink-500/40' : (isBubbles ? 'border-cyan-500/40' : 'border-amber-500/40');
  const houseGlow = isBlossom ? 'shadow-[0_0_20px_rgba(236,72,153,0.25)]' : (isBubbles ? 'shadow-[0_0_20px_rgba(6,182,212,0.25)]' : 'shadow-[0_0_20px_rgba(245,158,11,0.25)]');

  return (
    <div className="w-full flex flex-col gap-5 select-none">
      
      {/* Section Header */}
      <div>
        <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-amber-300/90 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>STEP 01</span>
        </span>
        <h3 className="font-fantasy font-black text-xl text-slate-100 uppercase tracking-wider mt-0.5">
          CHOOSE YOUR BASE
        </h3>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Select your character archetype to begin sculpting your appearance.
        </p>
      </div>

      {/* Two Base Options */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3.5">
        {BASES.map((b) => {
          const isSelected = selectedBase === b.id;
          return (
            <motion.button
              key={b.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBase(b.id)}
              className={`relative p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-center gap-3.5 text-left cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-900/40 via-slate-900 to-amber-950/30 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 text-slate-300'
              }`}
            >
              {/* Miniature Avatar Icon */}
              <div className="w-16 h-16 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                <div className="scale-75 translate-y-1">
                  <AvatarRenderer
                    base={b.id}
                    skinTone={avatar.skinTone}
                    hairstyle={b.id === 'female' ? 'twin-tails' : 'spiky-hero'}
                    hairColor={avatar.hairColor}
                    outfit={avatar.outfit}
                    hairAccessory={b.id === 'female' ? avatar.hairAccessory : 'none'}
                    headItem="none"
                    handItem="none"
                    house={houseId}
                    size={90}
                    isAnimated={false}
                  />
                </div>
              </div>

              {/* Text Meta */}
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className="font-fantasy font-bold text-sm sm:text-base text-slate-100 tracking-wide">
                    {b.name}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-sans font-semibold text-amber-300/90 tracking-wider uppercase">
                  {b.title}
                </div>
                <p className="text-[11px] font-sans text-slate-400 mt-1 leading-snug line-clamp-2">
                  {b.description}
                </p>
              </div>

              {/* Selected Radiant Corner Accent */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-400/30 to-transparent pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* House Attunement Ingot */}
      <div className={`p-4 rounded-2xl bg-slate-900/70 border ${houseBorder} ${houseGlow} flex flex-col gap-2 mt-2`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{houseIcon}</span>
          <div>
            <div className="text-[10px] font-sans font-bold tracking-[0.2em] text-slate-400 uppercase">
              ATTUNED HOUSE
            </div>
            <div className={`font-fantasy font-black text-sm tracking-wide ${houseColor}`}>
              {houseName}
            </div>
          </div>
        </div>
        <div className="text-[11px] font-sans text-slate-300 italic">
          "{houseTitle}"
        </div>
        <p className="text-[10px] font-sans text-slate-400/90 leading-relaxed border-t border-slate-800/80 pt-2">
          Your guild sigil and insignia are woven directly into your starting academy regalia.
        </p>
      </div>

    </div>
  );
}
