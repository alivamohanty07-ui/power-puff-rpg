import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Compass, 
  AlertCircle,
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimeMascot from './AnimeMascot';
import { triggerGameFX } from './GameFX';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    login, 
    signup, 
    enterAsGuest,
    openOnboardingModal
  } = useAuth();

  const [tab, setTab] = useState(authModalTab || 'signup'); // 'signup' | 'login'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setErrorMessage('');
  };

  // Sign In Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      triggerGameFX('vitality', window.innerWidth / 2, window.innerHeight / 2);
      closeAuthModal();

      // Navigation: if user has not completed induction, open House Induction
      if (!result.user?.has_completed_induction && !result.user?.personality_house) {
        openOnboardingModal();
      }
    } else {
      setErrorMessage(result.error || "That spell didn't work. Check your email or password.");
    }
  };

  // Create Account Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Hero name must be at least 2 characters.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid realm scroll email.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Your password must contain at least 6 characters of power.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Your passwords do not match in harmony.');
      return;
    }

    setLoading(true);
    const result = await signup({
      username: trimmedName,
      email: trimmedEmail,
      password: password,
      confirm_password: confirmPassword
    });
    setLoading(false);

    if (result.success) {
      triggerGameFX('intellect', window.innerWidth / 2, window.innerHeight / 2);
      closeAuthModal();

      // Brand new user -> always proceed to House Induction ceremony!
      openOnboardingModal();
    } else {
      setErrorMessage(result.error || "That spell didn't work. Please check your registration details.");
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Academy Authentication Chamber"
      >
        {/* Backdrop Dismiss */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#080d1a]/95 border-2 border-amber-400/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-10 text-slate-100 overflow-hidden"
        >
          {/* Ambient Floating Starlight Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-amber-300"
                style={{
                  width: 2 + (i % 3) * 1.5,
                  height: 2 + (i % 3) * 1.5,
                  left: `${(i * 19 + 7) % 94}%`,
                  top: `${(i * 23 + 11) % 88}%`,
                  boxShadow: '0 0 8px rgba(251, 191, 36, 0.7)'
                }}
                animate={{
                  y: [0, -35, 0],
                  opacity: [0.15, 0.8, 0.15]
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            aria-label="Close authentication chamber"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Academy Header & Mascot Welcome */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 flex-shrink-0 relative">
              <div className="scale-90 -translate-y-2">
                <AnimeMascot 
                  character="emily" 
                  pose={tab === 'signup' ? 'wave' : 'idle'} 
                  size={85} 
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-amber-300 font-bold">
                ✦ ACADEMY ENTRY GATE ✦
              </span>
              <h2 className="font-fantasy font-black text-2xl sm:text-3xl text-slate-100 tracking-wide uppercase">
                WELCOME, ADVENTURER
              </h2>
              <p className="text-xs text-slate-300 font-sans italic mt-0.5">
                "Every journey begins with a name."
              </p>
            </div>
          </div>

          {/* Context Banner */}
          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] font-sans text-purple-200 flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
            <span>Before entering the world, the academy must know who you are.</span>
          </div>

          {/* Tabs: SIGN IN vs CREATE ACCOUNT */}
          <div className="flex p-1 rounded-2xl bg-slate-950/90 border border-slate-800 mb-5">
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-fantasy font-bold tracking-wider uppercase transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              CREATE ACCOUNT
            </button>
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-fantasy font-bold tracking-wider uppercase transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              SIGN IN
            </button>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/50 text-rose-300 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CREATE ACCOUNT FORM */}
          {tab === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Hero Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elysia or Arthur"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Realm Scroll Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adventurer@academy.rpg"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'BINDING ACCOUNT...' : 'CREATE MY ACCOUNT'}</span>
              </motion.button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-xs font-sans text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Already have an account? <span className="text-amber-300 font-bold underline">Sign in</span>
                </button>
              </div>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adventurer@academy.rpg or hero name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-fantasy font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 shadow-inner"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-fantasy font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(245,158,11,0.45)] hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{loading ? 'OPENING GATES...' : 'ENTER THE WORLD'}</span>
              </motion.button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="text-xs font-sans text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Don't have an account? <span className="text-amber-300 font-bold underline">Create one</span>
                </button>
              </div>
            </form>
          )}

          {/* Guest Access Option */}
          <div className="mt-5 pt-3 border-t border-slate-800/80 text-center">
            <button
              onClick={() => {
                enterAsGuest();
                openOnboardingModal();
              }}
              className="text-xs font-sans text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400/70" />
              <span>Explore as Guest Adventurer (Instant Demo)</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
