import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  Rocket, 
  Search, 
  Leaf, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Compass
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

const PATH_OPTIONS = [
  {
    id: 'school_student',
    title: 'School Student',
    icon: '🎒',
    lucide: GraduationCap,
    desc: 'Navigating school lessons, exams, and budding disciplines.',
    tag: 'Academic Initiate',
    color: 'from-pink-500/20 to-purple-600/20 border-pink-400/40'
  },
  {
    id: 'college_student',
    title: 'College / University',
    icon: '🎓',
    lucide: BookOpen,
    desc: 'Pursuing higher degrees, courses, lectures, and specialized focus.',
    tag: 'Higher Scholar',
    color: 'from-blue-500/20 to-indigo-600/20 border-blue-400/40'
  },
  {
    id: 'working_professional',
    title: 'Working Professional',
    icon: '💼',
    lucide: Briefcase,
    desc: 'Navigating workplace craft, career milestones, and industry deliverables.',
    tag: 'Guild Member',
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-400/40'
  },
  {
    id: 'self_employed',
    title: 'Self-Employed / Entrepreneur',
    icon: '🚀',
    lucide: Rocket,
    desc: 'Forging your own business, venture, freelancing, or independent projects.',
    tag: 'Venture Pioneer',
    color: 'from-amber-500/20 to-orange-600/20 border-amber-400/40'
  },
  {
    id: 'job_seeker',
    title: 'Job Seeker',
    icon: '🔎',
    lucide: Search,
    desc: 'Sharpening skills, preparing portfolios, and seeking new opportunities.',
    tag: 'Horizon Hunter',
    color: 'from-cyan-500/20 to-sky-600/20 border-cyan-400/40'
  },
  {
    id: 'retired',
    title: 'Retired / Mindful Living',
    icon: '🌿',
    lucide: Leaf,
    desc: 'Embracing leisure, personal wellness, creative passions, and timeless wisdom.',
    tag: 'Sage Elder',
    color: 'from-violet-500/20 to-fuchsia-600/20 border-violet-400/40'
  },
  {
    id: 'other',
    title: 'Other Custom Path',
    icon: '✦',
    lucide: Compass,
    desc: 'A unique lifestyle, sabbatical, or creative calling with its own rhythm.',
    tag: 'Wayfinder',
    color: 'from-yellow-500/20 to-amber-600/20 border-yellow-400/40'
  }
];

export default function ChapterPath({
  selectedPath,
  customPath,
  onSelectPath,
  onChangeCustomPath,
  onNext,
  isSaving
}) {
  const handleCardSelect = (pathId) => {
    onSelectPath(pathId);
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  };

  const isOther = selectedPath === 'other';
  const canProceed = Boolean(selectedPath && (!isOther || (customPath && customPath.trim().length > 0)));

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Chapter Title & Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-amber-400 font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> CHAPTER 01 ── YOUR CALLING
        </span>
        <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase">
          WHAT DOES YOUR CURRENT PATH LOOK LIKE?
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-lg mx-auto mt-2">
          Select the primary realm of your daily pursuits. This anchors how your quests will take shape.
        </p>
      </div>

      {/* Path Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
        {PATH_OPTIONS.map((opt) => {
          const isSelected = selectedPath === opt.id;
          const LucideIcon = opt.lucide;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardSelect(opt.id)}
              className={`relative group rounded-2xl p-4 sm:p-5 text-left cursor-pointer transition-all border select-none overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/50'
                  : 'bg-slate-950/60 hover:bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Background Glow Accent on Selected */}
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-40 pointer-events-none`} />
              )}

              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl shadow-inner">
                  {opt.icon}
                </div>
                <span className="text-[10px] font-sans font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-800/90 text-amber-300 border border-slate-700/40">
                  {opt.tag}
                </span>
              </div>

              <h3 className="font-fantasy font-black text-sm sm:text-base text-slate-100 tracking-wide">
                {opt.title}
              </h3>
              <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                {opt.desc}
              </p>

              {/* Glowing Rune Sparkle indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-3 right-3 text-amber-400"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Custom Other Input */}
      {isOther && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mt-6 p-4 rounded-2xl bg-slate-900/90 border border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          <label className="block text-xs font-sans uppercase tracking-widest text-amber-300 font-bold mb-2">
            Tell us about your path:
          </label>
          <input
            type="text"
            value={customPath || ''}
            onChange={(e) => onChangeCustomPath(e.target.value)}
            placeholder="e.g. Taking a creative gap year, writing a fantasy novel..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
            autoFocus
          />
        </motion.div>
      )}

      {/* Navigation Button */}
      <div className="mt-9 flex justify-end w-full">
        <motion.button
          whileHover={{ scale: canProceed ? 1.03 : 1 }}
          whileTap={{ scale: canProceed ? 0.97 : 1 }}
          disabled={!canProceed || isSaving}
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{isSaving ? 'PERSISTING PATH...' : 'PROCEED TO CHAPTER 02'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
