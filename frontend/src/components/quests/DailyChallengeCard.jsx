import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Award,
  Crown,
  Zap
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

export default function DailyChallengeCard({
  challenge,
  onCompleteChallenge,
  isCompleting
}) {
  const [isRevealed, setIsRevealed] = useState(true);

  if (!challenge) return null;

  const tasks = challenge.tasks || [];
  const isCompleted = challenge.status === 'completed';

  const handleComplete = () => {
    onCompleteChallenge(challenge.id);
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-3xl p-5 sm:p-6 select-none overflow-hidden border transition-all ${
        isCompleted
          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          : 'bg-gradient-to-br from-[#0c1024] via-[#090d1c] to-[#120e2a] border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
      }`}
    >
      {/* Background Celestial Mist */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, rgba(168, 85, 247, 0.4) 60%, transparent 80%)' }}
      />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span className="text-[11px] font-sans font-black uppercase tracking-[0.25em]">
            ACADEMY DAILY TRIAL
          </span>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider border ${
          isCompleted 
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
            : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
        }`}>
          {isCompleted ? 'CONQUERED' : 'ACTIVE TRIAL'}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="font-fantasy font-black text-lg sm:text-xl text-slate-100 uppercase tracking-wide leading-tight mb-1">
        {challenge.title}
      </h3>
      <p className="font-sans text-xs text-slate-300/80 leading-relaxed mb-4">
        {challenge.description || "The Grand Academy presents your daily crucible for heroic growth."}
      </p>

      {/* Tasks List */}
      <div className="space-y-2 mb-5">
        {tasks.map((task, idx) => (
          <div
            key={task.id || idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{task.icon || '⚔️'}</span>
              <span className="font-fantasy font-bold text-slate-200">{task.title}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-amber-300 text-[11px]">
              <Clock className="w-3 h-3" />
              <span>{task.target_minutes}m</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Strip */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/90 border border-slate-800/80 mb-5">
        <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400 font-bold">
          Trial Bounty:
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-emerald-400">+{challenge.xp_reward || 120} XP</span>
          <span className="text-xs font-mono font-bold text-amber-300">+{challenge.gold_reward || 60} Gold</span>
          <span className="text-xs font-mono font-bold text-purple-300">+{challenge.gems_reward || 15} Gems</span>
        </div>
      </div>

      {/* Action Button */}
      {isCompleted ? (
        <div className="w-full py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>TRIAL REWARDS CLAIMED</span>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isCompleting}
          onClick={handleComplete}
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Award className="w-4 h-4" />
          <span>{isCompleting ? 'VERIFYING TRIAL...' : 'COMPLETE ACADEMY TRIAL'}</span>
        </motion.button>
      )}

    </motion.div>
  );
}
