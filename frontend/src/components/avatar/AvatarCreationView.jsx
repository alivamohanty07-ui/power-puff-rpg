import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Compass, 
  Palette, 
  Shirt, 
  Gem,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  getStoredAvatar, 
  persistAvatar, 
  DEFAULT_AVATAR_FEMALE, 
  DEFAULT_AVATAR_MALE 
} from '../../utils/avatarData';
import { triggerGameFX } from '../GameFX';

import BaseSelector from './BaseSelector';
import AvatarPreview from './AvatarPreview';
import AppearancePanel from './AppearancePanel';
import ClothingPanel from './ClothingPanel';
import AccessoriesPanel from './AccessoriesPanel';

export default function AvatarCreationView({
  onBackToHome,
  onBackToInduction
}) {
  const { user, setUser, saveAvatarToBackend } = useAuth();
  const { currentTheme } = useTheme();

  // Load house from character or user
  const [houseData, setHouseData] = useState(() => {
    try {
      const charRaw = localStorage.getItem('powerpuff_rpg_character');
      if (charRaw) {
        const c = JSON.parse(charRaw);
        if (c.houseId || c.house) return c;
      }
    } catch {}
    return { houseId: 'blossom', house: 'House Blossom' };
  });

  // Avatar state
  const [avatar, setAvatar] = useState(() => {
    return getStoredAvatar();
  });

  const [activeTab, setActiveTab] = useState('appearance'); // 'appearance' | 'clothing' | 'accessories'
  const [nameError, setNameError] = useState('');
  const [lockedNotice, setLockedNotice] = useState(null); // { name, level }
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Sync initial name with logged in user or saved character if available
  useEffect(() => {
    try {
      const charRaw = localStorage.getItem('powerpuff_rpg_character');
      if (charRaw) {
        const parsed = JSON.parse(charRaw);
        if (parsed.characterName && !avatar.name) {
          setAvatar((prev) => ({ ...prev, name: parsed.characterName }));
        }
      }
    } catch {}
  }, []);

  // Update handlers
  const handleSelectBase = (newBase) => {
    if (newBase === avatar.base) return;

    // Trigger subtle magical FX
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);

    if (newBase === 'male') {
      setAvatar((prev) => ({
        ...prev,
        base: 'male',
        name: prev.name === 'Emily' ? 'Ren' : prev.name,
        hairstyle: 'spiky-hero',
        hairColor: prev.hairColor === 'pastel-rose' ? 'dark-brown' : prev.hairColor,
        hairAccessory: 'none'
      }));
    } else {
      setAvatar((prev) => ({
        ...prev,
        base: 'female',
        name: prev.name === 'Ren' ? 'Emily' : prev.name,
        hairstyle: 'twin-tails',
        hairColor: prev.hairColor === 'dark-brown' ? 'pastel-rose' : prev.hairColor,
        hairAccessory: 'silk-bow'
      }));
    }
  };

  const handleCustomizationChange = (field, value) => {
    setAvatar((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangeName = (newName) => {
    if (!newName || newName.trim() === '') {
      setNameError('Please choose a name for your hero.');
    } else if (newName.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
    } else {
      setNameError('');
    }
    setAvatar((prev) => ({
      ...prev,
      name: newName
    }));
  };

  const handleLockedItemClick = (itemName, level) => {
    setLockedNotice({ name: itemName, level });
    setTimeout(() => {
      setLockedNotice(null);
    }, 3600);
  };

  const handleContinue = async () => {
    const trimmed = (avatar.name || '').trim();
    if (!trimmed) {
      setNameError('Character name cannot be empty.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Character name must be at least 2 characters.');
      return;
    }

    setNameError('');
    const finalAvatar = { ...avatar, name: trimmed };
    setAvatar(finalAvatar);

    // Persist to localStorage and AuthContext
    persistAvatar(finalAvatar);
    if (setUser) {
      setUser((prev) => ({
        ...(prev || {}),
        username: trimmed,
        avatar: finalAvatar
      }));
    }

    // Persist to backend if authenticated
    if (saveAvatarToBackend) {
      try {
        await saveAvatarToBackend(finalAvatar, trimmed);
      } catch (err) {
        console.warn('Backend avatar sync failed or offline:', err);
      }
    }

    // Celebration burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    triggerGameFX('vitality', window.innerWidth / 2, window.innerHeight / 2);

    setShowCompleteModal(true);
  };

  return (
    <div className="relative min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Dynamic Magical Chamber Background Light */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(88, 28, 135, 0.2) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(2, 6, 23, 0.98) 90%)'
        }}
      />

      {/* Floating Constellation Stardust Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              width: 2 + (i % 3) * 1.5,
              height: 2 + (i % 3) * 1.5,
              left: `${(i * 17 + 8) % 94}%`,
              top: `${(i * 23 + 12) % 90}%`,
              boxShadow: '0 0 8px rgba(251, 191, 36, 0.7)'
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.85, 0.2]
            }}
            transition={{
              duration: 4.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* =================================================================== */}
      {/* 1. PAGE HEADER                                                      */}
      {/* =================================================================== */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Back to House Selection Button */}
          <button
            onClick={() => {
              if (onBackToInduction) {
                onBackToInduction();
              } else if (onBackToHome) {
                onBackToHome();
              }
            }}
            className="self-start sm:self-auto flex items-center gap-2 text-xs font-fantasy font-bold uppercase tracking-wider text-slate-400 hover:text-amber-300 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>Back to House Selection</span>
          </button>

          {/* Center Title & Supporting Copy */}
          <div className="text-center">
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-amber-300 font-bold">
              ✦ CHARACTER AWAKENING ✦
            </span>
            <h1 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase mt-0.5">
              CREATE YOUR AVATAR
            </h1>
            <p className="font-sans text-xs text-slate-300/90 max-w-lg mx-auto mt-1 leading-snug">
              "Your story continues, but first, bring your character to life."
            </p>
            <p className="font-sans text-[11px] text-slate-400 max-w-xl mx-auto hidden md:block">
              Choose your appearance, style, and accessories. You can always unlock more as you progress.
            </p>
          </div>

          {/* Environmental Quote Banner */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-[11px] font-sans text-amber-200/90 italic">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>"Same dreams. Different paths. Make yours."</span>
          </div>

        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. MAIN 3-COLUMN COMPOSITION                                        */}
      {/* =================================================================== */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =============================================================== */}
          {/* LEFT COLUMN: BASE SELECTION (3 cols)                            */}
          {/* =============================================================== */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <BaseSelector
              selectedBase={avatar.base}
              onSelectBase={handleSelectBase}
              house={houseData}
              avatar={avatar}
            />
          </div>

          {/* =============================================================== */}
          {/* CENTER COLUMN: LARGE AVATAR PREVIEW (5 cols)                    */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col items-center justify-center">
            <AvatarPreview
              avatar={avatar}
              onChangeName={handleChangeName}
              nameError={nameError}
              house={houseData}
            />
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: CUSTOMIZATION TABS & PANELS (4 cols)              */}
          {/* =============================================================== */}
          <div className="lg:col-span-4 order-3 rounded-3xl bg-slate-900/60 border border-slate-800/90 p-4 sm:p-5 backdrop-blur-md shadow-2xl">
            
            {/* Customization Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-fantasy font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'appearance'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Appearance</span>
              </button>

              <button
                onClick={() => setActiveTab('clothing')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-fantasy font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'clothing'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothing</span>
              </button>

              <button
                onClick={() => setActiveTab('accessories')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-fantasy font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'accessories'
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>Accessories</span>
              </button>
            </div>

            {/* Active Panel Stage */}
            <div className="min-h-[380px]">
              {activeTab === 'appearance' && (
                <AppearancePanel
                  avatar={avatar}
                  onChange={handleCustomizationChange}
                  onLockedClick={handleLockedItemClick}
                />
              )}

              {activeTab === 'clothing' && (
                <ClothingPanel
                  avatar={avatar}
                  onChange={handleCustomizationChange}
                  onLockedClick={handleLockedItemClick}
                  house={houseData}
                />
              )}

              {activeTab === 'accessories' && (
                <AccessoriesPanel
                  avatar={avatar}
                  onChange={handleCustomizationChange}
                  onLockedClick={handleLockedItemClick}
                />
              )}
            </div>

          </div>

        </div>

        {/* =================================================================== */}
        {/* 3. BOTTOM ACTION BAR                                                */}
        {/* =================================================================== */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <button
            onClick={() => {
              if (onBackToInduction) {
                onBackToInduction();
              } else if (onBackToHome) {
                onBackToHome();
              }
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 font-fantasy text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            BACK
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>CONTINUE TO YOUR OUTFIT</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.button>
          </div>

        </div>

      </main>

      {/* =================================================================== */}
      {/* 4. LOCKED ITEM NOTICE TOAST                                         */}
      {/* =================================================================== */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 p-4 rounded-2xl bg-slate-950/95 border-2 border-purple-500/80 shadow-[0_0_35px_rgba(168,85,247,0.5)] flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-fantasy font-bold text-xs text-amber-300 uppercase tracking-wider">
                LOCKED REWARD • LV. {lockedNotice.level}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <span className="font-bold text-white">{lockedNotice.name}</span> will be awarded upon reaching Level {lockedNotice.level}!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* 5. AVATAR COMPLETION MILESTONE CELEBRATION MODAL                     */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showCompleteModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-[#080d1a] border-2 border-amber-400/60 p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.4)] flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-amber-400/60 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-5">
                ✨
              </div>

              <span className="text-xs font-sans tracking-[0.3em] uppercase text-emerald-400 font-bold flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4" /> AVATAR CREATED & BONDED
              </span>

              <h2 className="font-fantasy font-black text-2xl sm:text-3xl text-slate-100 tracking-wide uppercase">
                {avatar.name}
              </h2>

              <p className="font-fantasy text-sm text-amber-200 tracking-widest uppercase mt-1">
                INITIATE OF {houseData.house?.toUpperCase() || 'YOUR HOUSE'}
              </p>

              <p className="font-sans text-xs sm:text-sm text-slate-300/90 max-w-sm mt-3 leading-relaxed">
                Your character has been forged and saved! You are now prepared to build your daily schedule, habits, and adventure quests.
              </p>

              <div className="mt-6 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] font-sans text-purple-200">
                <span>✦ Next Stage: </span>
                <span className="font-bold text-amber-300">Life Setup & Daily Habit Builder (Phase 4)</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowCompleteModal(false);
                  if (onBackToHome) onBackToHome();
                }}
                className="mt-7 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>RETURN TO REALM OVERVIEW</span>
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
