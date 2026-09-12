import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Calendar,
  BookOpen,
  Palette,
  Dumbbell,
  Cpu,
  Coffee,
  Heart,
  Users
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

const PRESET_CATEGORIES = [
  {
    id: 'KNOWLEDGE & LEARNING',
    title: 'Knowledge & Learning',
    icon: BookOpen,
    emoji: '📚',
    color: 'border-indigo-500/40 text-indigo-300',
    items: ['Reading', 'Learning languages', 'Research', 'Writing', 'Studying']
  },
  {
    id: 'CREATIVE',
    title: 'Creative Arts',
    icon: Palette,
    emoji: '🎨',
    color: 'border-pink-500/40 text-pink-300',
    items: ['Painting', 'Drawing', 'Music', 'Photography', 'Crafting', 'Creative writing']
  },
  {
    id: 'FITNESS & SPORTS',
    title: 'Fitness & Sports',
    icon: Dumbbell,
    emoji: '🏃',
    color: 'border-amber-500/40 text-amber-300',
    items: ['Gym', 'Running', 'Walking', 'Cycling', 'Yoga', 'Athletics', 'Team sports']
  },
  {
    id: 'TECHNOLOGY',
    title: 'Technology & Building',
    icon: Cpu,
    emoji: '💻',
    color: 'border-cyan-500/40 text-cyan-300',
    items: ['Coding', 'Programming', 'AI', 'Gaming', 'Building projects']
  },
  {
    id: 'LIFE SKILLS',
    title: 'Life Skills & Craft',
    icon: Coffee,
    emoji: '🍳',
    color: 'border-emerald-500/40 text-emerald-300',
    items: ['Cooking', 'Gardening', 'Organization', 'Cleaning']
  },
  {
    id: 'WELLNESS',
    title: 'Wellness & Mind',
    icon: Heart,
    emoji: '🧘',
    color: 'border-rose-500/40 text-rose-300',
    items: ['Meditation', 'Journaling', 'Mindfulness', 'Self-care']
  },
  {
    id: 'SOCIAL',
    title: 'Social & Connection',
    icon: Users,
    emoji: '👥',
    color: 'border-yellow-500/40 text-yellow-300',
    items: ['Friends', 'Family', 'Community', 'Volunteering']
  }
];

const FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Daily' },
  { id: 'several_times_a_week', label: 'Several times / week' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'occasionally', label: 'Occasionally' }
];

const DURATION_OPTIONS = [
  { id: '15_minutes', label: '15 min' },
  { id: '30_minutes', label: '30 min' },
  { id: '1_hour', label: '1 hour' },
  { id: '2_plus_hours', label: '2+ hours' }
];

export default function ChapterInterests({
  interests = [],
  onToggleInterest,
  onUpdateInterestDetail,
  onAddCustomInterest,
  onRemoveInterest,
  onBack,
  onNext,
  isSaving
}) {
  const [activeCategory, setActiveCategory] = useState(PRESET_CATEGORIES[0].id);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('CREATIVE');

  // Currently expanded interest for editing frequency/duration
  const [configuringActivity, setConfiguringActivity] = useState(null);

  const isSelected = (activityName) => {
    return interests.some((i) => i.activity_name.toLowerCase() === activityName.toLowerCase());
  };

  const getInterestItem = (activityName) => {
    return interests.find((i) => i.activity_name.toLowerCase() === activityName.toLowerCase());
  };

  const handleToggle = (activityName, categoryName) => {
    onToggleInterest(activityName, categoryName);
    triggerGameFX('vitality', window.innerWidth / 2, window.innerHeight / 2);
    if (!isSelected(activityName)) {
      setConfiguringActivity(activityName);
    } else if (configuringActivity === activityName) {
      setConfiguringActivity(null);
    }
  };

  const handleCreateCustom = (e) => {
    e?.preventDefault();
    if (!customName.trim()) return;
    onAddCustomInterest(customName.trim(), customCategory);
    setConfiguringActivity(customName.trim());
    setCustomName('');
    setShowCustomModal(false);
    triggerGameFX('vitality', window.innerWidth / 2, window.innerHeight / 2);
  };

  const canProceed = interests.length >= 1;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
      {/* Chapter Title & Header */}
      <div className="text-center mb-7">
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-amber-400 font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> CHAPTER 03 ── PASSIONS & RECHARGE
        </span>
        <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase">
          WHAT FILLS YOUR FREE TIME?
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-lg mx-auto mt-2">
          "Your quests should reflect the things you actually care about." Select the activities that energize you.
        </p>
      </div>

      {/* Selected Items Summary Strip */}
      <div className="w-full mb-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-300">
            Selected Passions ({interests.length}):
          </span>
          {interests.length === 0 && (
            <span className="text-xs text-slate-500 italic">Select at least one activity below...</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
          {interests.map((item) => (
            <span
              key={item.activity_name}
              onClick={() => setConfiguringActivity(item.activity_name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium cursor-pointer transition-all border ${
                configuringActivity === item.activity_name
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-amber-400/50'
              }`}
            >
              <span>{item.activity_name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveInterest(item.activity_name);
                  if (configuringActivity === item.activity_name) {
                    setConfiguringActivity(null);
                  }
                }}
                className="hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-dashed border-amber-400/50 text-amber-300 text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Your Own
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 w-full">
        {PRESET_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/70 to-indigo-900/70 text-amber-300 border-amber-400/80 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Activity Cards */}
      {PRESET_CATEGORIES.filter((c) => c.id === activeCategory).map((cat) => (
        <div key={cat.id} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full mb-6">
          {cat.items.map((activity) => {
            const selected = isSelected(activity);
            return (
              <motion.div
                key={activity}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleToggle(activity, cat.id)}
                className={`relative p-3.5 sm:p-4 rounded-2xl cursor-pointer text-center select-none transition-all border flex flex-col items-center justify-between min-h-[90px] ${
                  selected
                    ? 'bg-purple-950/60 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
                    : 'bg-slate-950/70 hover:bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">
                  {cat.emoji}
                </div>
                <span className="font-fantasy font-bold text-xs sm:text-sm tracking-wide leading-tight">
                  {activity}
                </span>

                {selected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      ))}

      {/* Activity Details Drawer (When configuring an item) */}
      <AnimatePresence>
        {configuringActivity && isSelected(configuringActivity) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/40 to-slate-950 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-7 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-fantasy font-black text-sm uppercase text-amber-300 tracking-wider">
                  Calibrate Ritual: {configuringActivity}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setConfiguringActivity(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>

            {(() => {
              const item = getInterestItem(configuringActivity) || {};
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                  {/* Frequency */}
                  <div>
                    <label className="text-xs font-sans font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> How Often?
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <button
                          key={freq.id}
                          type="button"
                          onClick={() => onUpdateInterestDetail(configuringActivity, 'frequency', freq.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-sans transition-all border ${
                            (item.frequency || 'several_times_a_week') === freq.id
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                          }`}
                        >
                          {freq.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-sans font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Target Duration?
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DURATION_OPTIONS.map((dur) => (
                        <button
                          key={dur.id}
                          type="button"
                          onClick={() => onUpdateInterestDetail(configuringActivity, 'approximate_duration', dur.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-sans transition-all border ${
                            (item.approximate_duration || '1_hour') === dur.id
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                          }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Interest Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-amber-400/60 p-6 shadow-2xl"
            >
              <h3 className="font-fantasy font-black text-xl text-slate-100 uppercase tracking-wide mb-3">
                Add Custom Passion
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                What unique hobby or pursuit fills your adventure?
              </p>

              <form onSubmit={handleCreateCustom} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Speedcubing, Astrophotography, Tabletop RPG..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                    Category Realm
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {PRESET_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-sans text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 cursor-pointer"
                  >
                    Add to Passions
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white font-sans text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DISCIPLINE</span>
        </button>

        <motion.button
          whileHover={{ scale: canProceed ? 1.03 : 1 }}
          whileTap={{ scale: canProceed ? 0.97 : 1 }}
          disabled={!canProceed || isSaving}
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{isSaving ? 'PERSISTING PASSIONS...' : 'PROCEED TO CHAPTER 04'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
