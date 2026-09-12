import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { ACCESSORIES } from '../../utils/avatarData';

export default function AccessoriesPanel({
  avatar,
  onChange,
  onLockedClick
}) {
  // Sub-category selector: 'hair' | 'head' | 'hand'
  const [subCategory, setSubCategory] = useState('hair');

  const categories = [
    { id: 'hair', label: 'Hair Pins', key: 'hairAccessory' },
    { id: 'head', label: 'Headwear', key: 'headItem' },
    { id: 'hand', label: 'Hand Relics', key: 'handItem' }
  ];

  const currentCategory = categories.find((c) => c.id === subCategory) || categories[0];
  const items = ACCESSORIES[subCategory] || [];
  const activeEquippedId = avatar[currentCategory.key] || 'none';

  return (
    <div className="flex flex-col gap-4 select-none">
      
      {/* Category Pills Switcher */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
        {categories.map((cat) => {
          const isActive = subCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSubCategory(cat.id)}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-fantasy font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Item List for Active Category */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const isSelected = activeEquippedId === item.id;
          const isLocked = !item.free;

          return (
            <motion.button
              key={item.id}
              whileHover={isLocked ? {} : { scale: 1.015, x: 2 }}
              whileTap={isLocked ? {} : { scale: 0.98 }}
              onClick={() => {
                if (isLocked) {
                  if (onLockedClick) onLockedClick(item.name, item.requiredLevel);
                } else {
                  onChange(currentCategory.key, item.id);
                }
              }}
              className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left ${
                isSelected
                  ? 'bg-amber-400/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-amber-100'
                  : isLocked
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 cursor-pointer'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900 cursor-pointer'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-fantasy font-bold text-xs sm:text-sm tracking-wide">
                    {item.name}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </div>
                {item.desc && (
                  <p className="text-[11px] font-sans text-slate-400 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0">
                {isLocked ? (
                  <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-[10px] font-tech font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5 shadow-sm">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>LV. {item.requiredLevel}</span>
                  </span>
                ) : (
                  isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
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
