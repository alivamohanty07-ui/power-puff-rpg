import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Clock, 
  Trash2, 
  Edit3, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Check,
  X,
  Compass
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

const CATEGORY_MAP = {
  sleep: { label: 'Sleep & Rest', icon: '😴', color: 'border-indigo-500/50 bg-indigo-950/40 text-indigo-200' },
  school: { label: 'School', icon: '🏫', color: 'border-blue-500/50 bg-blue-950/40 text-blue-200' },
  college: { label: 'College / University', icon: '🎓', color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200' },
  work: { label: 'Work & Career', icon: '💼', color: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200' },
  study: { label: 'Study & Coding', icon: '📚', color: 'border-violet-500/50 bg-violet-950/40 text-violet-200' },
  exercise: { label: 'Exercise & Gym', icon: '🏃', color: 'border-amber-500/50 bg-amber-950/40 text-amber-200' },
  meals: { label: 'Meals & Nourishment', icon: '🍲', color: 'border-orange-500/50 bg-orange-950/40 text-orange-200' },
  hobbies: { label: 'Hobbies & Creative', icon: '🎨', color: 'border-pink-500/50 bg-pink-950/40 text-pink-200' },
  family: { label: 'Family & Social', icon: '👥', color: 'border-yellow-500/50 bg-yellow-950/40 text-yellow-200' },
  personal_time: { label: 'Personal Recharge', icon: '🧘', color: 'border-teal-500/50 bg-teal-950/40 text-teal-200' },
  other: { label: 'Other Pursuit', icon: '✦', color: 'border-slate-500/50 bg-slate-900/50 text-slate-200' }
};

const DEFAULT_PRESET_BLOCKS = [
  { activity_name: 'Wake Up & Morning Ritual', category: 'personal_time', start_time: '06:30', end_time: '07:30' },
  { activity_name: 'Deep Work / Classes', category: 'work', start_time: '09:00', end_time: '13:00' },
  { activity_name: 'Lunch & Recharge', category: 'meals', start_time: '13:00', end_time: '14:00' },
  { activity_name: 'Gym / Workout', category: 'exercise', start_time: '17:30', end_time: '18:45' },
  { activity_name: 'Study / Skill Building', category: 'study', start_time: '20:00', end_time: '21:30' },
  { activity_name: 'Wind Down & Sleep', category: 'sleep', start_time: '23:00', end_time: '06:30' }
];

export default function ChapterDailyRhythm({
  schedule = [],
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
  onApplyPresets,
  onBack,
  onFinish,
  isSaving
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    activity_name: '',
    category: 'study',
    start_time: '08:00',
    end_time: '09:00'
  });

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      activity_name: '',
      category: 'study',
      start_time: '08:00',
      end_time: '09:00'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (block, index) => {
    setEditingIndex(index);
    setFormData({
      activity_name: block.activity_name || block.title || '',
      category: block.category || 'study',
      start_time: block.start_time || '08:00',
      end_time: block.end_time || '09:00'
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e?.preventDefault();
    if (!formData.activity_name.trim()) return;

    if (editingIndex !== null) {
      onUpdateBlock(editingIndex, formData);
    } else {
      onAddBlock(formData);
    }

    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
    setIsModalOpen(false);
  };

  // Resolve time of day icon & celestial phase
  const getTimeIcon = (timeStr = '') => {
    const hour = parseInt(timeStr.split(':')[0], 10) || 0;
    if (hour >= 5 && hour < 11) return <Sunrise className="w-4 h-4 text-amber-300" />;
    if (hour >= 11 && hour < 17) return <Sun className="w-4 h-4 text-yellow-400" />;
    if (hour >= 17 && hour < 21) return <Sunset className="w-4 h-4 text-orange-400" />;
    return <Moon className="w-4 h-4 text-indigo-300" />;
  };

  const canProceed = schedule.length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Chapter Title & Header */}
      <div className="text-center mb-7">
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-amber-400 font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> CHAPTER 04 ── THE CHRONICLE OF TIME
        </span>
        <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase">
          MAP YOUR DAY
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-lg mx-auto mt-2">
          "Every adventurer has a rhythm." Shape your daily milestones so your quests appear right when you need them.
        </p>
      </div>

      {/* Quick Presets / Actions Strip */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 p-3 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-200">
            Timeline Markers ({schedule.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {schedule.length === 0 && (
            <button
              type="button"
              onClick={() => onApplyPresets(DEFAULT_PRESET_BLOCKS)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 text-purple-200 text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
            >
              Load Balanced Routine
            </button>
          )}

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold font-fantasy tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Block
          </button>
        </div>
      </div>

      {/* Visual Magical Timeline */}
      <div className="relative w-full rounded-3xl bg-slate-950/90 border border-slate-800/80 p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] min-h-[300px]">
        {/* Central Luminous Timeline Spire Line */}
        <div className="absolute top-8 bottom-8 left-8 sm:left-14 w-0.5 bg-gradient-to-b from-amber-400/80 via-purple-500/60 to-indigo-500/80 pointer-events-none" />

        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Compass className="w-10 h-10 text-slate-600 mb-3 animate-spin-slow" />
            <p className="font-fantasy text-base uppercase text-slate-400">Your daily chronicle is blank.</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Add your key routines or load a balanced starter routine to map out your adventure rhythm.
            </p>
            <button
              type="button"
              onClick={() => onApplyPresets(DEFAULT_PRESET_BLOCKS)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 text-xs font-bold font-sans uppercase tracking-wider transition-all"
            >
              Load Starter Routine
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((block, index) => {
              const catMeta = CATEGORY_MAP[block.category] || CATEGORY_MAP.other;
              return (
                <motion.div
                  key={block.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative flex items-center gap-3 sm:gap-6 pl-12 sm:pl-20 group select-none"
                >
                  {/* Timeline Glowing Node Marker */}
                  <div className="absolute left-6 sm:left-12 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] z-10">
                    <span className="w-2 h-2 rounded-full bg-amber-300" />
                  </div>

                  {/* Block Card */}
                  <div className={`flex-1 p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${catMeta.color}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center text-lg shadow-inner">
                        {catMeta.icon}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-fantasy font-bold text-sm sm:text-base tracking-wide text-slate-100">
                            {block.activity_name || block.title}
                          </span>
                          <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                            {catMeta.label}
                          </span>
                        </div>

                        {/* Time Span */}
                        <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-mono mt-0.5">
                          {getTimeIcon(block.start_time)}
                          <span>{block.start_time}</span>
                          <span className="text-slate-500">───</span>
                          <span>{block.end_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(block, index)}
                        className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Edit Block"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveBlock(index)}
                        className="p-2 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-amber-400/70 p-6 shadow-2xl"
            >
              <h3 className="font-fantasy font-black text-xl text-slate-100 uppercase tracking-wide mb-3">
                {editingIndex !== null ? 'Calibrate Timeline Block' : 'Add Daily Rhythm Marker'}
              </h3>

              <form onSubmit={handleSaveModal} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={formData.activity_name}
                    onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                    placeholder="e.g. Morning Study Sprint, Lunch Break, Gym..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                    Category Realm
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-sans text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 cursor-pointer"
                  >
                    Save to Chronicle
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
          <span>BACK TO PASSIONS</span>
        </button>

        <motion.button
          whileHover={{ scale: canProceed ? 1.04 : 1 }}
          whileTap={{ scale: canProceed ? 0.96 : 1 }}
          disabled={!canProceed || isSaving}
          onClick={onFinish}
          className="px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_40px_rgba(245,158,11,0.55)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSaving ? 'FORGING WORLD...' : 'FORGE MY LIFE WORLD →'}</span>
        </motion.button>
      </div>
    </div>
  );
}
