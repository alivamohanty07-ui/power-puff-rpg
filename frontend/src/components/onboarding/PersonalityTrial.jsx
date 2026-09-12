import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronLeft } from 'lucide-react';
import { PERSONALITY_QUESTIONS } from '../../utils/houseSorting';

export default function PersonalityTrial({ onCompleteTrial }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { 1: 'A', 2: 'B', ... }
  const [selectedOptionId, setSelectedOptionId] = useState(null); // for brief selection animation

  const currentQ = PERSONALITY_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === PERSONALITY_QUESTIONS.length - 1;

  const handleSelectOption = (optionId) => {
    if (selectedOptionId) return; // prevent double taps during transition

    setSelectedOptionId(optionId);
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQ.id]: optionId
    };
    setSelectedAnswers(updatedAnswers);

    // Smooth 380ms delay to visually acknowledge choice then advance
    setTimeout(() => {
      setSelectedOptionId(null);
      if (isLastQuestion) {
        onCompleteTrial(updatedAnswers);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 420);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedOptionId(null);
    }
  };

  return (
    <div className="relative min-h-[580px] sm:min-h-[640px] flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden">
      
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={handlePrevious}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              ✦
            </span>
          )}
          <span className="text-xs font-sans tracking-[0.25em] uppercase text-amber-300/80 font-bold">
            {currentQ.stageTitle}
          </span>
        </div>

        {/* Subtle Step Progress: 01 / 05 */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 tracking-wider">
            0{currentQuestionIndex + 1} / 0{PERSONALITY_QUESTIONS.length}
          </span>
          <div className="w-20 sm:w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-200"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / PERSONALITY_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>
      </div>

      {/* Main Interactive Question Card Stage */}
      <div className="relative flex-grow flex items-center justify-center my-auto py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
          >
            {/* Question Text */}
            <div className="mb-8 max-w-xl">
              <span className="inline-block mb-2 px-3 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-[0.2em] bg-slate-900 border border-slate-700 text-amber-300">
                {currentQ.isMystical ? 'Final Alignment' : 'Trial of Instinct'}
              </span>

              <h2 className="font-fantasy font-black text-xl sm:text-3xl text-slate-100 tracking-wide leading-relaxed">
                "{currentQ.question}"
              </h2>
            </div>

            {/* Answer Options */}
            <div className="w-full space-y-3.5">
              {currentQ.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 sm:p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between gap-4 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-300 bg-amber-400/20 shadow-[0_0_30px_rgba(245,158,11,0.35)] scale-[1.02]'
                        : 'border-slate-800/80 bg-slate-900/60 hover:border-amber-400/50 hover:bg-slate-900/90 text-slate-300'
                    }`}
                  >
                    {/* Option Text Content */}
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-fantasy font-bold text-xs border transition-colors flex-shrink-0 ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300'
                      }`}>
                        {option.id}
                      </span>

                      <div>
                        {option.powerTitle && (
                          <div className="font-fantasy font-bold text-xs sm:text-sm text-amber-200 tracking-wider uppercase mb-0.5">
                            {option.powerTitle}
                          </div>
                        )}
                        <p className={`font-sans text-xs sm:text-sm leading-relaxed ${
                          isSelected ? 'text-white font-medium' : 'text-slate-300'
                        }`}>
                          {option.text}
                        </p>
                      </div>
                    </div>

                    {/* Radio/Checkmark Indicator */}
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'border-amber-300 bg-amber-400 text-slate-950'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Guidance */}
      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="font-sans text-[11px] text-slate-500 tracking-widest uppercase">
          ✦ Answer with your honest instinct • Your soul will respond ✦
        </p>
      </div>

    </div>
  );
}
