import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Layers,
  Clock,
  Target
} from 'lucide-react';
import { triggerGameFX } from '../GameFX';

export default function ChapterEducationWork({
  pathType,
  educationData = {},
  subjects = [],
  onChangeEducation,
  onAddSubject,
  onUpdateSubject,
  onRemoveSubject,
  onSyncSubjects,
  onBack,
  onNext,
  isSaving
}) {
  const [numSubjectsInput, setNumSubjectsInput] = useState('');
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Handle number of subjects preset generator for school student
  const handleGenerateSlots = (count) => {
    const n = parseInt(count, 10);
    if (isNaN(n) || n <= 0) return;
    const currentList = [...subjects];
    while (currentList.length < n) {
      currentList.push(`Subject ${currentList.length + 1}`);
    }
    onSyncSubjects(currentList.slice(0, Math.min(n, 12)));
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  };

  const handleAddNewSubject = (e) => {
    e?.preventDefault();
    if (!newSubjectInput.trim()) return;
    onAddSubject(newSubjectInput.trim());
    setNewSubjectInput('');
    triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
  };

  const isStudent = pathType === 'school_student' || pathType === 'college_student';
  const isSchool = pathType === 'school_student';
  const isCollege = pathType === 'college_student';
  const isProfessional = pathType === 'working_professional';
  const isSelfEmployed = pathType === 'self_employed';
  const isJobSeeker = pathType === 'job_seeker';
  const isRetired = pathType === 'retired';

  // Validation: ensures user has filled at least minimal details
  const canProceed = () => {
    if (isSchool) return subjects.length > 0;
    if (isCollege) return (educationData.program || educationData.major || subjects.length > 0);
    if (isProfessional) return Boolean(educationData.job_title || educationData.industry);
    if (isSelfEmployed) return Boolean(educationData.role || educationData.business_name);
    if (isJobSeeker) return Boolean(educationData.desired_role || educationData.skills);
    return true;
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Chapter Title & Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-sans tracking-[0.35em] uppercase text-amber-400 font-bold flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> CHAPTER 02 ── DISCIPLINE & CRAFT
        </span>
        <h2 className="font-fantasy font-black text-2xl sm:text-4xl text-slate-100 tracking-wider uppercase">
          {isSchool && 'WHAT SUBJECTS ARE YOU STUDYING?'}
          {isCollege && 'WHAT ARE YOU STUDYING & RESEARCHING?'}
          {isProfessional && 'WHAT IS YOUR PROFESSION & CRAFT?'}
          {isSelfEmployed && 'WHAT VENTURE ARE YOU BUILDING?'}
          {isJobSeeker && 'WHAT REALMS ARE YOU PURSUING?'}
          {isRetired && 'HOW DO YOU ENJOY YOUR DAYS?'}
          {!isStudent && !isProfessional && !isSelfEmployed && !isJobSeeker && !isRetired && 'TELL US ABOUT YOUR PURSUITS'}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-slate-300/80 max-w-lg mx-auto mt-2">
          {isStudent && 'Enter your courses and subjects. These will generate knowledge quests and study sprints.'}
          {isProfessional && 'Define your role and industry. These shape your deep-work campaigns and focus sessions.'}
          {!isStudent && !isProfessional && 'Tell us how you spend your time so we can craft your daily quests.'}
        </p>
      </div>

      {/* Dynamic Content Panel */}
      <div className="w-full rounded-3xl bg-slate-950/80 border border-slate-800/90 p-5 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        
        {/* 1. School Student Form */}
        {isSchool && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-purple-300">
                  Quick Generator: How many subjects do you have?
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">Generates editable subject slots automatically.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={numSubjectsInput}
                  onChange={(e) => setNumSubjectsInput(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-20 px-3 py-2 text-center rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleGenerateSlots(numSubjectsInput)}
                  className="px-3 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Subjects List */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Your Subjects ({subjects.length})
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {subjects.map((sub, index) => {
                  const subjectName = typeof sub === 'string' ? sub : (sub.subject_name || sub.name);
                  const subId = typeof sub === 'object' ? sub.id : index;

                  return (
                    <motion.div
                      key={subId || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="text"
                        value={subjectName}
                        onChange={(e) => onUpdateSubject(index, e.target.value)}
                        placeholder={`Subject ${index + 1}`}
                        className="w-full bg-transparent text-sm text-slate-100 font-medium focus:outline-none focus:text-amber-200"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveSubject(index)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Add Custom Subject Bar */}
              <form onSubmit={handleAddNewSubject} className="flex items-center gap-2 mt-3 pt-2">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="Type a subject name (e.g. Mathematics, Physics, History)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 2. College / University Student Form */}
        {isCollege && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Degree / Program
                </label>
                <input
                  type="text"
                  value={educationData.program || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, program: e.target.value })}
                  placeholder="e.g. B.Tech, B.Sc, BA, Master of Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Branch / Major
                </label>
                <input
                  type="text"
                  value={educationData.major || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, major: e.target.value })}
                  placeholder="e.g. Computer Science, Mechanical, Fine Arts"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Year / Semester
              </label>
              <input
                type="text"
                value={educationData.year || ''}
                onChange={(e) => onChangeEducation({ ...educationData, year: e.target.value })}
                placeholder="e.g. 2nd Year / 4th Semester"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Courses / Subjects */}
            <div className="pt-3 border-t border-slate-800">
              <label className="text-xs font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-2.5">
                <BookOpen className="w-3.5 h-3.5" /> Current Courses & Subjects ({subjects.length})
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {subjects.map((sub, index) => {
                  const subjectName = typeof sub === 'string' ? sub : (sub.subject_name || sub.name);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800"
                    >
                      <input
                        type="text"
                        value={subjectName}
                        onChange={(e) => onUpdateSubject(index, e.target.value)}
                        placeholder="Course title"
                        className="w-full bg-transparent text-sm text-slate-100 font-medium focus:outline-none focus:text-amber-200"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveSubject(index)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <form onSubmit={handleAddNewSubject} className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="Add course (e.g. Machine Learning, Macroeconomics)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 3. Working Professional Form */}
        {isProfessional && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Job Title / Profession
                </label>
                <input
                  type="text"
                  value={educationData.job_title || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, job_title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer, Architect, Designer"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={educationData.industry || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, industry: e.target.value })}
                  placeholder="e.g. FinTech, Healthcare, Aerospace, Creative Studio"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Work Schedule (Optional)
              </label>
              <input
                type="text"
                value={educationData.work_schedule || ''}
                onChange={(e) => onChangeEducation({ ...educationData, work_schedule: e.target.value })}
                placeholder="e.g. Mon-Fri 9:00 AM - 5:30 PM, Remote Flexible"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Main Responsibilities & Goals (Optional)
              </label>
              <textarea
                rows={2}
                value={educationData.responsibilities || ''}
                onChange={(e) => onChangeEducation({ ...educationData, responsibilities: e.target.value })}
                placeholder="e.g. Lead system architecture, deliver client sprints, mentor juniors..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* 4. Self-Employed / Entrepreneur Form */}
        {isSelfEmployed && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Your Role / Business Name
                </label>
                <input
                  type="text"
                  value={educationData.role || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, role: e.target.value })}
                  placeholder="e.g. Founder, Freelance Consultant, Indie Dev"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                  Industry / Venture Type
                </label>
                <input
                  type="text"
                  value={educationData.industry || ''}
                  onChange={(e) => onChangeEducation({ ...educationData, industry: e.target.value })}
                  placeholder="e.g. SaaS Startup, E-commerce, Design Agency"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Work Rhythm (Optional)
              </label>
              <input
                type="text"
                value={educationData.work_schedule || ''}
                onChange={(e) => onChangeEducation({ ...educationData, work_schedule: e.target.value })}
                placeholder="e.g. Intensive morning sprints, flexible evening shipping"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* 5. Job Seeker Form */}
        {isJobSeeker && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Desired Profession / Field
              </label>
              <input
                type="text"
                value={educationData.desired_role || ''}
                onChange={(e) => onChangeEducation({ ...educationData, desired_role: e.target.value })}
                placeholder="e.g. Frontend Engineer, Product Manager, Data Analyst"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                Key Skills / Disciplines You're Leveling Up
              </label>
              <input
                type="text"
                value={educationData.skills || ''}
                onChange={(e) => onChangeEducation({ ...educationData, skills: e.target.value })}
                placeholder="e.g. React, System Design, SQL, Interview Prep"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* 6. Retired / Other */}
        {(isRetired || (!isStudent && !isProfessional && !isSelfEmployed && !isJobSeeker)) && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-sans uppercase tracking-widest text-slate-300 font-bold mb-1.5">
                What fills your days and creative energy?
              </label>
              <textarea
                rows={3}
                value={educationData.retired_activities || educationData.custom_notes || ''}
                onChange={(e) => onChangeEducation({ ...educationData, custom_notes: e.target.value })}
                placeholder="e.g. Gardening, writing memoirs, exploring arts, morning walks, community mentorship..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white font-sans text-xs tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO PATH</span>
        </button>

        <motion.button
          whileHover={{ scale: canProceed() ? 1.03 : 1 }}
          whileTap={{ scale: canProceed() ? 0.97 : 1 }}
          disabled={!canProceed() || isSaving}
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-black text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>{isSaving ? 'PERSISTING CRAFT...' : 'PROCEED TO CHAPTER 03'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
