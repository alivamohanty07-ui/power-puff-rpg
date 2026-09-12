import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Sparkles, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  Compass, 
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStoredAvatar } from '../../utils/avatarData';
import AvatarRenderer from '../avatar/AvatarRenderer';
import ChapterPath from './ChapterPath';
import ChapterEducationWork from './ChapterEducationWork';
import ChapterInterests from './ChapterInterests';
import ChapterDailyRhythm from './ChapterDailyRhythm';
import LifeCompletionScreen from './LifeCompletionScreen';

const CHAPTERS = [
  { id: 1, key: 'path', label: '01 — YOUR PATH' },
  { id: 2, key: 'education', label: '02 — STUDIES / WORK' },
  { id: 3, key: 'interests', label: '03 — YOUR INTERESTS' },
  { id: 4, key: 'rhythm', label: '04 — DAILY RHYTHM' }
];

export default function LifeBuilderView({ onBackToHome, onCompleteLifeBuilder }) {
  const { user, token } = useAuth();

  // Load avatar and house
  const [avatar, setAvatar] = useState(() => {
    if (user?.avatar) return user.avatar;
    if (user?.avatar_config) {
      try {
        return JSON.parse(user.avatar_config);
      } catch {}
    }
    return getStoredAvatar();
  });

  const house = {
    id: (user?.personality_house || user?.house || 'blossom').toLowerCase().includes('buttercup')
      ? 'buttercup'
      : (user?.personality_house || user?.house || 'blossom').toLowerCase().includes('bubbles')
        ? 'bubbles'
        : 'blossom',
    name: user?.personality_house || user?.house || 'House Blossom'
  };

  // Stepper State: 1 | 2 | 3 | 4 | 'completion'
  const [currentChapter, setCurrentChapter] = useState(1);
  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState(1);

  // Form State
  const [selectedPath, setSelectedPath] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [educationData, setEducationData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [interests, setInterests] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // Loading & Saving States
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Companion avatar dialogue & floating magical item state
  const [companionDialogue, setCompanionDialogue] = useState(
    "Welcome, Adventurer! Let's shape your world together. What calling drives your days?"
  );
  const [floatingProp, setFloatingProp] = useState('none'); // 'none' | 'book' | 'dumbbell' | 'palette' | 'hourglass'

  // Fetch existing profile on mount to recover previous progress
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.get('/api/life-profile');
        if (res.data) {
          const p = res.data;
          if (p.path?.path_type) {
            setSelectedPath(p.path.path_type);
            setCustomPath(p.path.custom_path || '');
          }
          if (p.education) {
            setEducationData(p.education);
          }
          if (p.subjects && p.subjects.length > 0) {
            setSubjects(p.subjects);
          }
          if (p.interests && p.interests.length > 0) {
            setInterests(p.interests);
          }
          if (p.schedule && p.schedule.length > 0) {
            setSchedule(p.schedule);
          }

          if (p.is_completed) {
            setCurrentChapter('completion');
            setMaxUnlockedChapter(4);
          } else if (p.completed_step > 0) {
            const nextStep = Math.min(p.completed_step + 1, 4);
            setCurrentChapter(nextStep);
            setMaxUnlockedChapter(nextStep);
          }
        }
      } catch (err) {
        console.warn('Could not load existing life profile:', err.message);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token]);

  // Update companion reactions based on chapter and inputs
  const handleSelectPath = (pathId) => {
    setSelectedPath(pathId);
    setSaveError(null);

    const dialogMap = {
      school_student: "A school scholar! Diligence in early years unlocks immense magical potential.",
      college_student: "Higher academy scholar! Late night studies forge the strongest spellbooks.",
      working_professional: "A guild artisan! Daily craft and professional resilience are true valor.",
      self_employed: "An entrepreneur wayfinder! Forging your own venture takes bold adventuring spirit.",
      job_seeker: "A horizon hunter! You are sharpening your blade for magnificent opportunities.",
      retired: "A sage master! Wisdom and peaceful pursuits are the true endgame treasures.",
      other: "A rare wayfarer! The world needs adventurers who walk their own uncharted path."
    };

    setCompanionDialogue(dialogMap[pathId] || "A splendid choice! Let's chronicle your craft next.");
  };

  // Progression: Save Path -> Next
  const handleSavePathAndNext = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (token) {
        await axios.put('/api/life-profile/path', {
          path_type: selectedPath,
          custom_path: customPath
        });
      }
      setMaxUnlockedChapter((prev) => Math.max(prev, 2));
      setCurrentChapter(2);
      setFloatingProp('book');
      setCompanionDialogue("Tell me about your studies or career milestones. What knowledge do you wield?");
    } catch (err) {
      setSaveError("Could not save your path. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Progression: Save Education & Subjects -> Next
  const handleSaveEducationAndNext = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (token) {
        await axios.put('/api/life-profile/education', {
          education_data: educationData,
          subjects: subjects
        });
      }
      setMaxUnlockedChapter((prev) => Math.max(prev, 3));
      setCurrentChapter(3);
      setFloatingProp('palette');
      setCompanionDialogue("Splendid! Now, what passions energize your spirit outside of duties?");
    } catch (err) {
      setSaveError("Could not save your studies/work. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Subject Handlers
  const handleAddSubject = (subjectName) => {
    setSubjects((prev) => [...prev, subjectName]);
    setFloatingProp('book');
    setCompanionDialogue(`A new discipline: "${subjectName}"! I've inscribed it into your tome.`);
  };

  const handleUpdateSubject = (index, value) => {
    setSubjects((prev) => {
      const updated = [...prev];
      if (typeof updated[index] === 'object') {
        updated[index] = { ...updated[index], subject_name: value };
      } else {
        updated[index] = value;
      }
      return updated;
    });
  };

  const handleRemoveSubject = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSyncSubjects = (newList) => {
    setSubjects(newList);
  };

  // Interest Handlers
  const handleToggleInterest = (activityName, categoryName) => {
    setInterests((prev) => {
      const exists = prev.some((i) => i.activity_name.toLowerCase() === activityName.toLowerCase());
      if (exists) {
        return prev.filter((i) => i.activity_name.toLowerCase() !== activityName.toLowerCase());
      } else {
        return [
          ...prev,
          {
            activity_name: activityName,
            category: categoryName,
            frequency: 'several_times_a_week',
            approximate_duration: '1_hour'
          }
        ];
      }
    });

    if (categoryName.includes('FITNESS')) {
      setFloatingProp('dumbbell');
      setCompanionDialogue("Iron will and physical stamina! A hearty routine keeps our HP high.");
    } else if (categoryName.includes('CREATIVE')) {
      setFloatingProp('palette');
      setCompanionDialogue("Artistry and creativity! Let inspiration illuminate our realm.");
    } else if (categoryName.includes('TECH')) {
      setFloatingProp('book');
      setCompanionDialogue("Tech craft and coding runes! Logic is pure spellcasting.");
    } else {
      setFloatingProp('none');
      setCompanionDialogue(`"${activityName}" added to your constellation of passions!`);
    }
  };

  const handleUpdateInterestDetail = (activityName, field, value) => {
    setInterests((prev) =>
      prev.map((item) =>
        item.activity_name.toLowerCase() === activityName.toLowerCase()
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleAddCustomInterest = (name, category) => {
    setInterests((prev) => [
      ...prev,
      {
        activity_name: name,
        category: category || 'CUSTOM',
        frequency: 'several_times_a_week',
        approximate_duration: '1_hour'
      }
    ]);
    setCompanionDialogue(`A unique passion: "${name}"! Your adventure shall celebrate it.`);
  };

  const handleRemoveInterest = (activityName) => {
    setInterests((prev) => prev.filter((i) => i.activity_name.toLowerCase() !== activityName.toLowerCase()));
  };

  // Progression: Save Interests -> Next
  const handleSaveInterestsAndNext = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (token) {
        await axios.post('/api/life-profile/interests', {
          interests: interests
        });
      }
      setMaxUnlockedChapter((prev) => Math.max(prev, 4));
      setCurrentChapter(4);
      setFloatingProp('hourglass');
      setCompanionDialogue("Now for the master chronicle: map out the daily milestones of your routine!");
    } catch (err) {
      setSaveError("Could not save your interests. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Schedule Handlers
  const handleAddBlock = (block) => {
    setSchedule((prev) => [...prev, block]);
    setCompanionDialogue(`Rhythm milestone added: ${block.activity_name} (${block.start_time} - ${block.end_time})!`);
  };

  const handleUpdateBlock = (index, block) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[index] = block;
      return updated;
    });
  };

  const handleRemoveBlock = (index) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyPresets = (presetList) => {
    setSchedule(presetList);
    setCompanionDialogue("Starter rhythm loaded! You can adjust or customize each block to match your day.");
  };

  // Final Completion: Save Schedule & Complete Life Profile
  const handleFinishAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      if (token) {
        await axios.post('/api/life-profile/schedule', {
          schedule: schedule
        });
        await axios.post('/api/life-profile/complete');
      }
      setCurrentChapter('completion');
      setFloatingProp('none');
      setCompanionDialogue("Your world has taken shape! Your real life is now an epic RPG adventure!");
    } catch (err) {
      setSaveError("Could not finalize your life profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050813] text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* Deep Cosmos Radial Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(88, 28, 135, 0.22) 0%, rgba(15, 23, 42, 0.7) 45%, rgba(2, 6, 23, 0.98) 90%)'
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
              left: `${(i * 17 + 5) % 96}%`,
              top: `${(i * 23 + 8) % 92}%`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.6)'
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.9, 1.2, 0.9]
            }}
            transition={{
              duration: 4.5 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Header Bar: Navigation Back + Main Heading */}
      <div className="sticky top-0 z-30 w-full backdrop-blur-xl bg-[#080d1a]/85 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
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
              <span className="font-fantasy font-black text-base sm:text-lg text-slate-100 uppercase tracking-wide">
                BUILD YOUR LIFE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-sans font-bold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                PHASE 4
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 hidden sm:block">
              "Your everyday life is where the adventure truly begins."
            </p>
          </div>
        </div>

        {/* User House Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-900/80 border border-amber-400/40 text-amber-300">
            {house.name}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col w-full">
        
        {/* Stepper Header (Only shown during Chapters 1-4) */}
        {currentChapter !== 'completion' && (
          <div className="mb-8 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {CHAPTERS.map((chap) => {
                const isActive = currentChapter === chap.id;
                const isCompleted = currentChapter > chap.id;
                const isUnlocked = chap.id <= maxUnlockedChapter;

                return (
                  <button
                    key={chap.id}
                    disabled={!isUnlocked}
                    onClick={() => setCurrentChapter(chap.id)}
                    className={`relative p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
                        : isCompleted
                          ? 'bg-slate-950/70 border-emerald-500/40 text-emerald-300 hover:bg-slate-900/70'
                          : isUnlocked
                            ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-slate-950/30 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                        {chap.label.split('—')[0].trim()}
                      </span>
                      {isCompleted && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-fantasy font-black tracking-wide truncate text-slate-200">
                      {chap.label.split('—')[1]?.trim() || chap.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {saveError && (
          <div className="w-full max-w-xl mx-auto mb-6 p-3 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-300 text-xs font-sans text-center flex items-center justify-center gap-2 shadow-lg">
            <span>⚠️ {saveError}</span>
            <button onClick={() => setSaveError(null)} className="hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Two-Column Layout: Left Companion Dock + Right Chapter Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-grow">
          
          {/* Left Column: Interactive Avatar Companion (Desktop & Tablet) */}
          {currentChapter !== 'completion' && (
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col items-center lg:sticky lg:top-24 select-none">
              <div className="relative w-full rounded-3xl bg-slate-950/80 border border-slate-800/80 p-5 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col items-center">
                
                {/* Companion Speech Bubble */}
                <motion.div
                  key={companionDialogue}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="relative w-full p-3.5 mb-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/40 text-xs font-sans text-slate-200 shadow-md leading-relaxed"
                >
                  <p className="italic">"{companionDialogue}"</p>
                  {/* Speech bubble arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-950/80" />
                </motion.div>

                {/* Avatar Display */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <AvatarRenderer
                    base={avatar.base || 'female'}
                    skinTone={avatar.skinTone || 'porcelain'}
                    hairstyle={avatar.hairstyle || 'twin-tails'}
                    hairColor={avatar.hairColor || 'pastel-rose'}
                    outfit={avatar.outfit || 'academy-uniform'}
                    hairAccessory={avatar.hairAccessory || 'silk-bow'}
                    headItem={avatar.headItem || 'none'}
                    handItem={avatar.handItem || 'apprentice-wand'}
                    house={house.id}
                    size={160}
                    isAnimated={true}
                  />

                  {/* Floating Magical Props reacting to choices */}
                  <AnimatePresence>
                    {floatingProp === 'book' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute -top-2 -right-1 text-2xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                      >
                        📖
                      </motion.div>
                    )}
                    {floatingProp === 'dumbbell' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute -top-2 -right-1 text-2xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                      >
                        ⚡
                      </motion.div>
                    )}
                    {floatingProp === 'palette' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute -top-2 -right-1 text-2xl filter drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                      >
                        🎨
                      </motion.div>
                    )}
                    {floatingProp === 'hourglass' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.5 }}
                        animate={{ opacity: 1, y: [-4, 4, -4], scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="absolute -top-2 -right-1 text-2xl filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      >
                        ⏳
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-center mt-2">
                  <span className="font-fantasy font-black text-sm text-slate-200 uppercase tracking-wide">
                    {avatar.name || 'Your Avatar'}
                  </span>
                  <p className="text-[10px] font-sans text-amber-300 font-bold uppercase tracking-wider">
                    {house.name} Companion
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Right Column: Active Chapter Content */}
          <div className={currentChapter === 'completion' ? 'col-span-12' : 'lg:col-span-8 xl:col-span-9'}>
            <AnimatePresence mode="wait">
              {currentChapter === 1 && (
                <motion.div
                  key="chap1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <ChapterPath
                    selectedPath={selectedPath}
                    customPath={customPath}
                    onSelectPath={handleSelectPath}
                    onChangeCustomPath={setCustomPath}
                    onNext={handleSavePathAndNext}
                    isSaving={isSaving}
                  />
                </motion.div>
              )}

              {currentChapter === 2 && (
                <motion.div
                  key="chap2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <ChapterEducationWork
                    pathType={selectedPath}
                    educationData={educationData}
                    subjects={subjects}
                    onChangeEducation={setEducationData}
                    onAddSubject={handleAddSubject}
                    onUpdateSubject={handleUpdateSubject}
                    onRemoveSubject={handleRemoveSubject}
                    onSyncSubjects={handleSyncSubjects}
                    onBack={() => setCurrentChapter(1)}
                    onNext={handleSaveEducationAndNext}
                    isSaving={isSaving}
                  />
                </motion.div>
              )}

              {currentChapter === 3 && (
                <motion.div
                  key="chap3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <ChapterInterests
                    interests={interests}
                    onToggleInterest={handleToggleInterest}
                    onUpdateInterestDetail={handleUpdateInterestDetail}
                    onAddCustomInterest={handleAddCustomInterest}
                    onRemoveInterest={handleRemoveInterest}
                    onBack={() => setCurrentChapter(2)}
                    onNext={handleSaveInterestsAndNext}
                    isSaving={isSaving}
                  />
                </motion.div>
              )}

              {currentChapter === 4 && (
                <motion.div
                  key="chap4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                >
                  <ChapterDailyRhythm
                    schedule={schedule}
                    onAddBlock={handleAddBlock}
                    onUpdateBlock={handleUpdateBlock}
                    onRemoveBlock={handleRemoveBlock}
                    onApplyPresets={handleApplyPresets}
                    onBack={() => setCurrentChapter(3)}
                    onFinish={handleFinishAll}
                    isSaving={isSaving}
                  />
                </motion.div>
              )}

              {currentChapter === 'completion' && (
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <LifeCompletionScreen
                    profile={{
                      path: { path_type: selectedPath, custom_path: customPath },
                      education: educationData,
                      subjects: subjects,
                      interests: interests,
                      schedule: schedule
                    }}
                    avatar={avatar}
                    house={house}
                    onContinue={() => {
                      if (onCompleteLifeBuilder) {
                        onCompleteLifeBuilder();
                      } else if (onBackToHome) {
                        onBackToHome();
                      }
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
