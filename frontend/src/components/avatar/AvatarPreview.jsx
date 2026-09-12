import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, Sparkles, AlertCircle } from 'lucide-react';
import AvatarRenderer from './AvatarRenderer';

export default function AvatarPreview({
  avatar,
  onChangeName,
  nameError,
  house = 'blossom'
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(avatar.name || '');
  const nameInputRef = useRef(null);

  useEffect(() => {
    setTempName(avatar.name || '');
  }, [avatar.name]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    onChangeName(trimmed);
    setIsEditingName(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setTempName(avatar.name || '');
      setIsEditingName(false);
    }
  };

  // House ambiance resolution
  const houseId = typeof house === 'object' && house?.id ? house.id : String(house || 'blossom').toLowerCase();
  const isBlossom = houseId.includes('blossom');
  const isBubbles = houseId.includes('bubbles');
  const isButtercup = houseId.includes('buttercup');

  const houseParticle = isBlossom ? '🌸' : (isBubbles ? '🫧' : '⚡');
  const houseGlow = isBlossom 
    ? 'rgba(236, 72, 153, 0.4)' 
    : (isBubbles ? 'rgba(6, 182, 212, 0.4)' : 'rgba(245, 158, 11, 0.4)');

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-md mx-auto">
      
      {/* =================================================================== */}
      {/* 1. MAGICAL MIRROR & CHAMBER STAGE                                   */}
      {/* =================================================================== */}
      <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center">
        
        {/* Soft Radial Backlight Spotlight */}
        <div 
          className="absolute inset-4 rounded-full blur-3xl pointer-events-none -z-10 opacity-60 transition-colors duration-700"
          style={{
            background: `radial-gradient(circle, ${houseGlow} 0%, rgba(15, 23, 42, 0.8) 65%, transparent 80%)`
          }}
        />

        {/* Ambient Floating House Motes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sm select-none"
              style={{
                left: `${(i * 21 + 10) % 90}%`,
                top: `${(i * 27 + 15) % 85}%`
              }}
              animate={{
                y: [0, -38, 0],
                opacity: [0.15, 0.85, 0.15],
                scale: [0.9, 1.25, 0.9]
              }}
              transition={{
                duration: 3.8 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            >
              {houseParticle}
            </motion.div>
          ))}
        </div>

        {/* Arcane Mirror Arch Border */}
        <div className="absolute inset-x-8 top-3 bottom-14 rounded-t-full border-2 border-amber-400/30 shadow-[0_0_40px_rgba(0,0,0,0.8)_inset] pointer-events-none bg-gradient-to-b from-purple-950/20 via-slate-950/40 to-transparent" />

        {/* Left & Right Candle/Lantern Glows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-12 flex flex-col items-center pointer-events-none">
          <motion.div 
            className="w-3.5 h-3.5 rounded-full bg-amber-300 blur-[2px]"
            animate={{ scale: [1, 1.3, 0.9, 1.2, 1], opacity: [0.7, 1, 0.6, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <div className="w-1.5 h-6 bg-amber-200/40 rounded-sm mt-0.5" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-12 flex flex-col items-center pointer-events-none">
          <motion.div 
            className="w-3.5 h-3.5 rounded-full bg-amber-300 blur-[2px]"
            animate={{ scale: [1.1, 0.85, 1.3, 1, 1.1], opacity: [0.8, 0.6, 1, 0.7, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.1 }}
          />
          <div className="w-1.5 h-6 bg-amber-200/40 rounded-sm mt-0.5" />
        </div>

        {/* Central Avatar Character */}
        <div className="relative z-10 scale-95 sm:scale-105 transition-transform">
          <AvatarRenderer
            base={avatar.base}
            skinTone={avatar.skinTone}
            hairstyle={avatar.hairstyle}
            hairColor={avatar.hairColor}
            outfit={avatar.outfit}
            hairAccessory={avatar.hairAccessory}
            headItem={avatar.headItem}
            handItem={avatar.handItem}
            house={houseId}
            size={290}
            isAnimated={true}
          />
        </div>

        {/* Ground Rotating Arcane Platform */}
        <div className="absolute bottom-6 w-56 sm:w-64 h-20 flex items-center justify-center pointer-events-none">
          {/* Platform Disc Outer Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-md opacity-70"
            style={{ backgroundColor: houseGlow }}
          />
          {/* Inner Pedestal Stone */}
          <div className="absolute inset-1 rounded-full bg-slate-950/90 border border-amber-400/50 shadow-[0_0_20px_rgba(0,0,0,0.9)]" />
          {/* Rotating Runic Arc Guideline */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2.5 rounded-full border border-dashed border-amber-300/40 flex items-center justify-between px-3 text-[9px] text-amber-200 font-mono tracking-widest"
          >
            <span>᚛</span>
            <span>ᚚ</span>
            <span>᚛</span>
            <span>ᚚ</span>
          </motion.div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* 2. CHARACTER NAME & WORLD RECOGNITION                               */}
      {/* =================================================================== */}
      <div className="mt-1 flex flex-col items-center text-center w-full px-4">
        
        {/* Name Display / Inline Input */}
        <div className="relative flex items-center justify-center group">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                ref={nameInputRef}
                type="text"
                value={tempName}
                maxLength={18}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="font-fantasy font-black text-xl sm:text-2xl text-amber-200 bg-slate-900/90 border-2 border-amber-400/80 rounded-xl px-3.5 py-1 text-center focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] w-48 sm:w-56"
                placeholder="Enter Hero Name"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveName}
                className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 shadow-md cursor-pointer"
                title="Save Name"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-2 font-fantasy font-black text-2xl sm:text-3xl text-slate-100 tracking-wider hover:text-amber-300 transition-colors py-1 px-3 rounded-xl hover:bg-slate-900/50 cursor-pointer"
              title="Click to edit character name"
            >
              <span>{avatar.name || 'Hero'}</span>
              <Edit3 className="w-4 h-4 text-amber-400/80 group-hover:text-amber-300 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>

        {/* Validation Error Message */}
        <AnimatePresence>
          {nameError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-rose-400 flex items-center gap-1.5 font-sans mt-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{nameError}</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Subtitle Lore */}
        <p className="font-sans text-xs text-slate-400/90 mt-1">
          "This is how the world will know you."
        </p>

        {/* Character Count Info when Editing */}
        {isEditingName && (
          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
            {tempName.length} / 18 characters
          </span>
        )}

      </div>

    </div>
  );
}
