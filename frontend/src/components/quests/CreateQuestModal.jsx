import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  Clock, 
  Flame, 
  Brain, 
  Sword, 
  Heart, 
  BookOpen, 
  Palette, 
  Dumbbell, 
  Cpu, 
  Coffee, 
  Plus,
  Compass
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

const PRESET_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 }
];

const DIFFICULTIES = [
  { id: 'easy', label: 'EASY', multiplier: '0.85x XP', color: 'border-emerald-500/40 text-emerald-300' },
  { id: 'normal', label: 'NORMAL', multiplier: '1.0x XP', color: 'border-amber-500/40 text-amber-300' },
  { id: 'challenging', label: 'CHALLENGING', multiplier: '1.4x XP', color: 'border-rose-500/40 text-rose-300' }
];

export default function CreateQuestModal({
  isOpen,
  onClose,
  lifeProfile,
  onCreateQuest,
  isCreating
}) {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [category, setCategory] = useState('KNOWLEDGE');
  const [duration, setDuration] = useState(45);
  const [customDurationInput, setCustomDurationInput] = useState('');
  const [difficulty, setDifficulty] = useState('normal');

  // Extract activities from Life Builder
  const subjects = (lifeProfile?.subjects || []).map((s) => ({
    name: typeof s === 'string' ? s : (s.subject_name || s.name),
    category: 'KNOWLEDGE',
    attribute: 'intellect'
  }));

  const interests = (lifeProfile?.interests || []).map((i) => ({
    name: i.activity_name,
    category: i.category || 'CUSTOM',
    attribute: i.category?.includes('FITNESS') ? 'strength'
      : i.category?.includes('WELLNESS') ? 'vitality'
      : i.category?.includes('CREATIVE') ? 'mind'
      : 'intellect'
  }));

  // Initial selection
  useEffect(() => {
    if (isOpen) {
      if (subjects.length > 0) {
        setSelectedActivity(subjects[0].name);
        setCategory('KNOWLEDGE');
        setIsCustom(false);
      } else if (interests.length > 0) {
        setSelectedActivity(interests[0].name);
        setCategory(interests[0].category);
        setIsCustom(false);
      } else {
        setIsCustom(true);
        setCategory('KNOWLEDGE');
      }
      setDuration(45);
      setDifficulty('normal');
      setCustomTitle('');
    }
  }, [isOpen, lifeProfile]);

  if (!isOpen) return null;

  const currentTitle = isCustom ? customTitle : selectedActivity;

  // Infer Attribute Preview
  const inferAttribute = (title = '', cat = '') => {
    const text = `${title} ${cat}`.toLowerCase();
    if (text.includes('math') || text.includes('physic') || text.includes('code') || text.includes('study') || text.includes('knowledge') || text.includes('tech') || text.includes('research')) {
      return { id: 'intellect', name: 'INTELLECT', icon: Brain, color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
    }
    if (text.includes('gym') || text.includes('workout') || text.includes('fitness') || text.includes('strength') || text.includes('sport')) {
      return { id: 'strength', name: 'STRENGTH', icon: Sword, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
    }
    if (text.includes('run') || text.includes('walk') || text.includes('yoga') || text.includes('wellness') || text.includes('meditat') || text.includes('vitality')) {
      return { id: 'vitality', name: 'VITALITY', icon: Heart, color: 'text-rose-300 border-rose-500/40 bg-rose-950/40' };
    }
    return { id: 'mind', name: 'MIND / CREATIVE', icon: Sparkles, color: 'text-purple-300 border-purple-500/40 bg-purple-950/40' };
  };

  const attrMeta = inferAttribute(currentTitle, category);
  const AttrIcon = attrMeta.icon;

  // Estimated XP preview (server will calculate authoritative value)
  const diffMultiplier = difficulty === 'easy' ? 0.85 : difficulty === 'challenging' ? 1.4 : 1.0;
  const estimatedXp = Math.round(duration * 1.25 * diffMultiplier);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!currentTitle.trim()) return;

    onCreateQuest({
      title: currentTitle.trim(),
      category: category,
      attribute: attrMeta.id,
      difficulty: difficulty,
      duration_minutes: duration
    });
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="relative w-full max-w-2xl rounded-3xl bg-[#080d1a] border-2 border-amber-400/50 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-10 text-slate-100 p-5 sm:p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="text-center mb-6">
          <span className="text-xs font-sans tracking-[0.3em] uppercase text-amber-400 font-bold flex items-center justify-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> FORGE TODAY'S EXPEDITION
          </span>
          <h2 className="font-fantasy font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-wide">
            WHAT WILL YOU CONQUER TODAY?
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-1">
            Choose from your charted disciplines or define a custom mission.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Life Builder Activities vs Custom */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-2.5">
              Select Pursuit / Mission
            </label>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
              {/* Subjects */}
              {subjects.map((s, i) => (
                <button
                  key={`sub-${i}`}
                  type="button"
                  onClick={() => {
                    setSelectedActivity(s.name);
                    setCategory('KNOWLEDGE');
                    setIsCustom(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all border flex items-center gap-1.5 ${
                    !isCustom && selectedActivity === s.name
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700/60'
                  }`}
                >
                  <span>📚</span>
                  <span>{s.name}</span>
                </button>
              ))}

              {/* Interests */}
              {interests.map((it, i) => (
                <button
                  key={`int-${i}`}
                  type="button"
                  onClick={() => {
                    setSelectedActivity(it.name);
                    setCategory(it.category);
                    setIsCustom(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all border flex items-center gap-1.5 ${
                    !isCustom && selectedActivity === it.name
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700/60'
                  }`}
                >
                  <span>⚡</span>
                  <span>{it.name}</span>
                </button>
              ))}

              {/* Custom Option Button */}
              <button
                type="button"
                onClick={() => {
                  setIsCustom(true);
                  setSelectedActivity('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                  isCustom
                    ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-900 text-purple-300 hover:bg-slate-800 border-purple-700/50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Mission</span>
              </button>
            </div>
          </div>

          {/* Custom Quest Input (if selected) */}
          {isCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40"
            >
              <label className="block text-xs font-sans uppercase tracking-widest text-purple-300 font-bold mb-1.5">
                Custom Mission Title:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Finish chemistry lab report, Refactor auth API..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </motion.div>
          )}

          {/* 2. Duration Selector */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>How Long Will This Quest Take?</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_DURATIONS.map((dur) => (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() => setDuration(dur.value)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-sans transition-all border ${
                    duration === dur.value
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Difficulty Selector */}
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Challenge Difficulty</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    difficulty === diff.id
                      ? 'bg-slate-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className={`font-fantasy font-black text-xs sm:text-sm tracking-wider ${diff.color}`}>
                    {diff.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {diff.multiplier}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Live Quest Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/30 to-slate-950 border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">QUEST PREVIEW</span>
              <h4 className="font-fantasy font-black text-base text-slate-100 uppercase tracking-wide mt-0.5 truncate max-w-[280px]">
                {currentTitle || 'Your Expedition'}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-amber-300">⏳ {duration}m</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-bold uppercase text-purple-300">{difficulty}</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider border flex items-center gap-1 ${attrMeta.color}`}>
                <AttrIcon className="w-3 h-3" />
                <span>{attrMeta.name}</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold mt-1.5">
                +{estimatedXp} XP upon completion
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-sans text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: currentTitle ? 1.03 : 1 }}
              whileTap={{ scale: currentTitle ? 0.97 : 1 }}
              disabled={!currentTitle || isCreating}
              type="submit"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isCreating ? 'FORGING QUEST...' : 'ADD TO TODAY\'S QUESTS'}</span>
            </motion.button>
          </div>

        </form>

      </motion.div>
    </div>
  );
}
