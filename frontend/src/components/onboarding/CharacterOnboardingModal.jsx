import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateHouseAlignment, persistHouseInduction, HOUSES } from '../../utils/houseSorting';

import HouseInductionIntro from './HouseInductionIntro';
import HouseShowcase from './HouseShowcase';
import PersonalityTrial from './PersonalityTrial';
import HouseCalculation from './HouseCalculation';
import HouseReveal from './HouseReveal';
import OnboardingNextStep from './OnboardingNextStep';

export default function CharacterOnboardingModal({ isOpen, onClose, onEnterWorld }) {
  const { user, setUser, setIsAuthenticated, saveHouseToBackend } = useAuth();
  const { setTheme } = useTheme();

  // Onboarding Step State: 'intro' | 'showcase' | 'trial' | 'calculation' | 'reveal' | 'next_step'
  const [step, setStep] = useState('intro');
  const [answers, setAnswers] = useState({});
  const [winningHouse, setWinningHouse] = useState(HOUSES.blossom);
  const [scores, setScores] = useState({ blossom: 0, bubbles: 0, buttercup: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Reset state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setAnswers({});
      setWinningHouse(HOUSES.blossom);
      setIsSaving(false);
      setSaveError(null);
    }
  }, [isOpen]);

  // Handle ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Step Transitions
  const handleBeginShowcase = () => setStep('showcase');
  const handleStartTrial = () => setStep('trial');

  const handleCompleteTrial = (finalAnswers) => {
    setAnswers(finalAnswers);
    const result = calculateHouseAlignment(finalAnswers);
    setWinningHouse(result.winningHouse);
    setScores(result.scores);
    setSaveError(null);
    setStep('calculation');
  };

  const handleFinishCalculation = () => {
    setStep('reveal');
  };

  const handleRetake = () => {
    setAnswers({});
    setSaveError(null);
    setStep('trial');
  };

  const handleConfirmHouse = async () => {
    setIsSaving(true);
    setSaveError(null);

    // 1. Sync to backend if authenticated
    if (saveHouseToBackend && user?.id !== 0) {
      const result = await saveHouseToBackend(winningHouse.name, winningHouse.id, scores);
      if (result && !result.success) {
        setIsSaving(false);
        setSaveError(result.error || "Your house could not be recorded. Please try again.");
        return;
      }
    }

    // 2. Persist to localStorage powerpuff_rpg_character & power_puff_user
    persistHouseInduction(winningHouse, scores);

    // 3. Sync to AuthContext user state if user is logged in or guest
    if (setUser) {
      setUser((prev) => ({
        ...(prev || {}),
        personality_house: winningHouse.name,
        house: winningHouse.name,
        has_completed_induction: true
      }));
    }

    // 4. Sync theme if applicable
    if (setTheme && winningHouse.themeId) {
      setTheme(winningHouse.themeId);
    }

    setIsSaving(false);
    // Advance to clean next-step transition
    setStep('next_step');
  };

  const handleFinishAll = () => {
    // Authenticate / Enter as guest and switch view to world
    if (setIsAuthenticated) {
      setIsAuthenticated(true);
    }
    if (onEnterWorld) {
      onEnterWorld();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl select-none"
        role="dialog"
        aria-modal="true"
        aria-label="House Induction & Personality Sorting Ceremony"
      >
        {/* Backdrop Dismiss */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#080d1a]/95 border-2 border-amber-400/40 shadow-[0_0_80px_rgba(0,0,0,0.9)] z-10 text-slate-100 overflow-hidden"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            aria-label="Close ceremony"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Active Step Sequence */}
          {step === 'intro' && (
            <HouseInductionIntro onBegin={handleBeginShowcase} />
          )}

          {step === 'showcase' && (
            <HouseShowcase onStartTrial={handleStartTrial} />
          )}

          {step === 'trial' && (
            <PersonalityTrial onCompleteTrial={handleCompleteTrial} />
          )}

          {step === 'calculation' && (
            <HouseCalculation 
              winningHouse={winningHouse} 
              onFinishCalculation={handleFinishCalculation} 
            />
          )}

          {step === 'reveal' && (
            <HouseReveal 
              house={winningHouse} 
              onConfirm={handleConfirmHouse} 
              onRetake={handleRetake} 
              isSaving={isSaving}
              saveError={saveError}
            />
          )}

          {step === 'next_step' && (
            <OnboardingNextStep 
              house={winningHouse} 
              onCompleteOnboarding={handleFinishAll} 
            />
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
