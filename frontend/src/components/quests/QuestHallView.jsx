import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Sparkles, 
  Plus, 
  Flame, 
  Brain, 
  Sword, 
  Heart, 
  Clock, 
  Award, 
  Trash2, 
  CheckCircle2, 
  Play, 
  ArrowLeft,
  Compass,
  Zap,
  Coins,
  Gem,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStoredAvatar } from '../../utils/avatarData';
import { triggerGameFX } from '../GameFX';
import CreateQuestModal from './CreateQuestModal';
import DailyChallengeCard from './DailyChallengeCard';
import MagicalFocusChamber from './MagicalFocusChamber';

export default function QuestHallView({ onBackToHome, onExploreWorld }) {
  const { user, setUser, token } = useAuth();

  const [questsData, setQuestsData] = useState({
    summary: { total_quests: 0, completed_quests: 0, total_minutes: 0, completed_minutes: 0, potential_xp: 0, earned_xp: 0, is_perfect_day: false },
    quests: []
  });

  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [lifeProfile, setLifeProfile] = useState(null);
  const [activeQuest, setActiveQuest] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCompletingChallenge, setIsCompletingChallenge] = useState(false);
  const [celebrationBanner, setCelebrationBanner] = useState(null);

  // Avatar and house
  const avatar = user?.avatar || getStoredAvatar();
  const house = {
    id: (user?.personality_house || user?.house || 'blossom').toLowerCase().includes('buttercup')
      ? 'buttercup'
      : (user?.personality_house || user?.house || 'blossom').toLowerCase().includes('bubbles')
        ? 'bubbles'
        : 'blossom',
    name: user?.personality_house || user?.house || 'House Blossom'
  };

  // Fetch today's quests, daily challenge, and life profile
  const fetchAllData = async () => {
    if (!token) return;
    try {
      const [qRes, dcRes, lpRes] = await Promise.all([
        axios.get('/api/quests/today'),
        axios.get('/api/quests/daily-challenge'),
        axios.get('/api/life-profile')
      ]);

      if (qRes.data) setQuestsData(qRes.data);
      if (dcRes.data) setDailyChallenge(dcRes.data);
      if (lpRes.data) setLifeProfile(lpRes.data);
    } catch (err) {
      console.warn('Could not fetch Quest Hall data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Create Quest Handler
  const handleCreateQuest = async (questPayload) => {
    setIsCreating(true);
    try {
      const res = await axios.post('/api/quests', questPayload);
      if (res.data) {
        setIsCreateModalOpen(false);
        fetchAllData();
        triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
      }
    } catch (err) {
      console.error('Failed to create quest:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Start Quest Handler
  const handleStartQuest = async (quest) => {
    try {
      const res = await axios.patch(`/api/quests/${quest.id}/start`);
      setActiveQuest(res.data || quest);
      triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
    } catch (err) {
      setActiveQuest(quest);
    }
  };

  // Pause Quest
  const handlePauseQuest = async (questId, elapsedSeconds) => {
    try {
      await axios.patch(`/api/quests/${questId}/pause`, { elapsed_seconds: elapsedSeconds });
    } catch {}
  };

  // Resume Quest
  const handleResumeQuest = async (questId) => {
    try {
      await axios.patch(`/api/quests/${questId}/start`);
    } catch {}
  };

  // Complete Quest
  const handleCompleteQuest = async (questId) => {
    try {
      const res = await axios.post(`/api/quests/${questId}/complete`);
      setActiveQuest(null);

      if (res.data) {
        if (res.data.user && setUser) {
          setUser(res.data.user);
        }

        const rewards = res.data.rewards || {};
        setCelebrationBanner({
          title: 'QUEST CONQUERED!',
          xp: rewards.xp || 50,
          attribute: rewards.attribute || 'intellect',
          attribute_gain: rewards.attribute_gain || 2,
          is_perfect_day: res.data.is_perfect_day
        });

        setTimeout(() => setCelebrationBanner(null), 6000);
      }
      fetchAllData();
    } catch (err) {
      console.error('Failed to complete quest:', err);
      setActiveQuest(null);
    }
  };

  // Abandon Quest
  const handleAbandonQuest = async (questId) => {
    try {
      await axios.patch(`/api/quests/${questId}/pause`, { elapsed_seconds: 0 });
    } catch {}
    setActiveQuest(null);
  };

  // Delete Quest
  const handleDeleteQuest = async (questId) => {
    try {
      await axios.delete(`/api/quests/${questId}`);
      fetchAllData();
    } catch (err) {
      console.warn('Could not delete quest:', err);
    }
  };

  // Complete Daily Challenge
  const handleCompleteChallenge = async (challengeId) => {
    setIsCompletingChallenge(true);
    try {
      const res = await axios.post(`/api/quests/daily-challenge/${challengeId}/complete`);
      if (res.data) {
        if (res.data.user && setUser) {
          setUser(res.data.user);
        }
        setCelebrationBanner({
          title: 'ACADEMY TRIAL CONQUERED!',
          xp: res.data.rewards?.xp || 120,
          gems: res.data.rewards?.gems || 15,
          attribute: res.data.rewards?.attribute || 'intellect',
          attribute_gain: res.data.rewards?.attribute_gain || 5
        });
        setTimeout(() => setCelebrationBanner(null), 6000);
      }
      fetchAllData();
    } catch (err) {
      console.error('Failed to complete daily challenge:', err);
    } finally {
      setIsCompletingChallenge(false);
    }
  };

  const quests = questsData.quests || [];
  const summary = questsData.summary || {};
  const completedRatio = summary.total_quests > 0 ? (summary.completed_quests / summary.total_quests) : 0;

  return (
    <div className="relative min-h-screen bg-[#060a16] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Background Cosmic Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(88, 28, 135, 0.22) 0%, rgba(15, 23, 42, 0.7) 45%, #030712 95%)'
        }}
      />

      {/* Floating Constellation Dust */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              width: 2 + (i % 3) * 1.5,
              height: 2 + (i % 3) * 1.5,
              left: `${(i * 19 + 6) % 96}%`,
              top: `${(i * 23 + 9) % 90}%`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#080d1a]/85 border-b border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Return to Realm Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-fantasy font-black text-lg sm:text-xl text-slate-100 uppercase tracking-wide">
                QUEST HALL
              </span>
              <span className="px-2 py-0.5 text-[10px] font-sans font-bold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                TODAY'S ADVENTURE
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 hidden sm:block">
              "Choose your quests. Shape your day."
            </p>
          </div>
        </div>

        {/* Hero Attributes Ribbon */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">LVL {user?.level || 1}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{user?.xp || 0} XP</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-purple-300">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span>{user?.gems !== undefined ? user.gems : 25} Gems</span>
          </div>
        </div>
      </div>

      {/* Celebration Notification Banner */}
      <AnimatePresence>
        {celebrationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-16 z-40 max-w-xl mx-auto my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/30 to-amber-500/20 border-2 border-amber-400 text-center shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-amber-400 text-lg">
              <span>✨</span>
              <span className="font-fantasy font-black text-sm uppercase text-amber-200">
                {celebrationBanner.title}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
              <span>+{celebrationBanner.xp} XP</span>
              <span>+{celebrationBanner.attribute_gain} {celebrationBanner.attribute?.toUpperCase()}</span>
              {celebrationBanner.gems && <span>+{celebrationBanner.gems} Gems</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col w-full">
        
        {/* Today's Progress Overview Strip */}
        <div className="w-full mb-8 p-5 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-slate-400 font-bold block mb-1">
              EXPEDITION MILESTONES
            </span>
            <div className="flex items-center gap-3">
              <h3 className="font-fantasy font-black text-xl sm:text-2xl text-slate-100 uppercase">
                {summary.completed_quests} / {summary.total_quests} QUESTS COMPLETED
              </h3>
              {summary.is_perfect_day && (
                <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 text-xs font-fantasy font-black uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  ✦ PERFECT DAY! ✦
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar & Time */}
          <div className="w-full sm:w-80 flex flex-col items-end">
            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ width: `${completedRatio * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 mt-1.5">
              <span>Time: {summary.completed_minutes}m / {summary.total_minutes}m</span>
              <span className="text-emerald-400 font-bold">+{summary.earned_xp} / {summary.potential_xp} XP</span>
            </div>
          </div>
        </div>

        {/* 3-Column Quest Hall Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start flex-grow">
          
          {/* LEFT: Quick Quest Creator Panel (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800/80">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-amber-400 block mb-2">
                EXPEDITION FORGE
              </span>
              <h4 className="font-fantasy font-black text-base text-slate-100 uppercase mb-2">
                Create Today's Quest
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Shape your daily focus sprints from your subjects and interests.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ CREATE QUEST</span>
              </motion.button>
            </div>

            {/* Quick Categories Overview from Life Profile */}
            <div className="p-4 rounded-3xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Discipline Sources:
              </span>
              <div className="space-y-1.5">
                {(lifeProfile?.subjects || []).slice(0, 3).map((sub, i) => (
                  <div key={i} className="text-xs flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/50">
                    <span className="truncate text-slate-300 font-medium">📚 {typeof sub === 'string' ? sub : sub.subject_name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">INTELLECT</span>
                  </div>
                ))}
                {(lifeProfile?.interests || []).slice(0, 3).map((it, i) => (
                  <div key={i} className="text-xs flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/50">
                    <span className="truncate text-slate-300 font-medium">⚡ {it.activity_name}</span>
                    <span className="text-[10px] font-mono text-amber-400">PASSION</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Today's Quests Board (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-fantasy font-black text-lg text-slate-100 uppercase tracking-wide">
                  TODAY'S QUESTS ({quests.length})
                </h3>
              </div>
            </div>

            {quests.length === 0 ? (
              <div className="rounded-3xl bg-slate-950/60 border border-slate-800/80 p-8 text-center flex flex-col items-center justify-center min-h-[280px]">
                <Clock className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                <h4 className="font-fantasy font-black text-base text-slate-300 uppercase">Your Quest Board is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
                  What will you conquer today? Forge your first quest to begin your focus expedition.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/40 text-amber-300 text-xs font-bold font-sans uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  + Add First Quest
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quests.map((quest) => {
                  const isDone = quest.status === 'completed';
                  const isInProg = quest.status === 'in_progress';

                  return (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isDone
                          ? 'bg-slate-950/50 border-emerald-500/40 text-slate-400'
                          : isInProg
                            ? 'bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                            : 'bg-slate-950/80 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                          {quest.category === 'FITNESS' ? '🏃' : quest.category === 'CREATIVE' ? '🎨' : quest.category === 'TECH' ? '💻' : '📚'}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`font-fantasy font-bold text-sm sm:text-base ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                              {quest.title}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-slate-900 text-amber-300 border border-slate-800">
                              {quest.difficulty}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                            <span>⏳ {quest.duration_minutes}m</span>
                            <span>•</span>
                            <span className="text-cyan-300 font-bold uppercase">{quest.attribute}</span>
                            <span>•</span>
                            <span className="text-emerald-400">+{quest.xp_reward} XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {isDone ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-sans font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>COMPLETED</span>
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartQuest(quest)}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-fantasy font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:brightness-110 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>{isInProg ? 'RESUME' : 'START'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteQuest(quest.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Quest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Academy Daily Challenge (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <DailyChallengeCard
              challenge={dailyChallenge}
              onCompleteChallenge={handleCompleteChallenge}
              isCompleting={isCompletingChallenge}
            />
          </div>

        </div>

      </div>

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        lifeProfile={lifeProfile}
        onCreateQuest={handleCreateQuest}
        isCreating={isCreating}
      />

      {/* Active Quest Focus Chamber Overlay */}
      {activeQuest && (
        <MagicalFocusChamber
          quest={activeQuest}
          avatar={avatar}
          house={house}
          onPauseQuest={handlePauseQuest}
          onResumeQuest={handleResumeQuest}
          onCompleteQuest={handleCompleteQuest}
          onAbandonQuest={handleAbandonQuest}
        />
      )}

    </div>
  );
}
