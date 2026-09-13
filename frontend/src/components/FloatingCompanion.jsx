import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, X, Moon, Radio, Compass } from 'lucide-react';
import AnimeMascot from './AnimeMascot';
import { triggerGameFX } from './GameFX';

/**
 * Free-Roaming Companion AI ("Pixel Buddy // Hero Scout")
 * 
 * Capabilities:
 * - Free-roaming on the main page layer (not locked inside any sidebar capsule).
 * - Card Perching: When a user inspects/hovers over any card (Guild Houses, Attributes, Realms, Journey steps):
 *   - Companion glides smoothly across the screen to perch directly on top of the card.
 *   - Enters 'read' pose (studying glowing arcane tome / holographic datapad).
 *   - Displays an attached contextual RPG speech bubble with card-specific lore analysis.
 * - Autonomous Wandering: When idle without an active card hover, gently drifts and takes playful floating hops.
 * - 15s Inactivity Sleep: Curls up into 'sleep' pose with animated floating 'Zzz' motes.
 * - Instant Wake: Any mouse move or scroll immediately awakens the companion with 'wake' pose and '!' alert.
 * - Interactive Poke: Clicking the companion triggers 'jump' pose, joyous cheering dialogue, and celebratory particle FX.
 * - Zero Cursor Obstruction: Container has pointer-events-none; only the mascot sprite and bubble have pointer-events-auto.
 */
export default function FloatingCompanion({
  character = 'emily',
  onChangeCharacter,
  currentTheme = 'dark-dungeon',
  activeSection = 'about',
  perchTarget = null, // { element, title, speech, pose }
  onDismissPerch
}) {
  // Companion State
  const [pose, setPose] = useState('idle');
  const [isSleeping, setIsSleeping] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [speechText, setSpeechText] = useState(
    character === 'ren'
      ? "Ren here! Cyber-armor online. Hover over cards and I'll fly over to scout them! ⚔️⚡"
      : "Emily at your service! Hover over any card and I'll fly over to inspect its lore! 🌸✨"
  );
  const [speechTitle, setSpeechTitle] = useState(character === 'ren' ? "REN // SCOUT" : "EMILY // GUIDE");

  // Free-roaming coordinates (fixed viewport pixel positions)
  const [coords, setCoords] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth - 130 : 800,
    y: typeof window !== 'undefined' ? window.innerHeight - 150 : 500
  });

  // Flag indicating if companion is currently perched on a card
  const isPerched = !!perchTarget && !!perchTarget.element;

  const inactivityTimerRef = useRef(null);
  const wanderTimerRef = useRef(null);
  const wasSleepingRef = useRef(false);

  // Inactivity Sleep & Instant Wake Engine
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (wasSleepingRef.current) {
      // WAKE UP!
      wasSleepingRef.current = false;
      setIsSleeping(false);
      setPose('wake');
      setSpeechTitle(character === 'ren' ? "REN // AWAKENED!" : "EMILY // AWAKENED!");
      setSpeechText(character === 'ren' ? "Whoa! I'm awake! Ready for combat! ⚔️" : "Ha! I'm awake! Let's conquer quests! ✨");
      setShowSpeech(true);

      // Trigger wake sparkles at current coords
      triggerGameFX('celebrate', coords.x + 35, coords.y + 35);

      setTimeout(() => {
        setPose(isPerched ? 'read' : 'idle');
      }, 1500);
    }

    // 15s Inactivity Timer for Sleeping
    inactivityTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
      wasSleepingRef.current = true;
      setPose('sleep');
      setSpeechTitle(character === 'ren' ? "REN // RESTING" : "EMILY // SLEEPING");
      setSpeechText("Zzz... (Stamina resting... move mouse to wake!) 💤");
      setShowSpeech(true);
    }, 15000);
  };

  // Scroll & Activity Listeners
  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('mousedown', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [coords.x, coords.y, character]);

  // Card Perching Tracking: Update position to stay perched on target card even during scrolling
  useEffect(() => {
    if (isSleeping) return;

    if (perchTarget && perchTarget.element) {
      const updatePerchPosition = () => {
        const el = perchTarget.element;
        if (!el || typeof el.getBoundingClientRect !== 'function') return;
        const rect = el.getBoundingClientRect();

        // Calculate perched position directly on top border of card
        const targetX = Math.max(30, Math.min(window.innerWidth - 130, rect.left + rect.width / 2 - 35));
        const targetY = Math.max(75, rect.top - 68);

        setCoords({ x: targetX, y: targetY });
      };

      updatePerchPosition();

      // Study reaction
      setPose(perchTarget.pose || 'read');
      setSpeechTitle(perchTarget.title || (character === 'ren' ? "REN // SCOUTING" : "EMILY // STUDYING"));
      setSpeechText(perchTarget.speech || "Analyzing tactical parameters... 📜✨");
      setShowSpeech(true);

      window.addEventListener('scroll', updatePerchPosition, { passive: true });
      window.addEventListener('resize', updatePerchPosition, { passive: true });

      return () => {
        window.removeEventListener('scroll', updatePerchPosition);
        window.removeEventListener('resize', updatePerchPosition);
      };
    } else {
      // Returned from perching to idle
      setPose('idle');
    }
  }, [perchTarget, character, isSleeping]);

  // Autonomous Wandering Engine (when NOT perched and NOT sleeping)
  useEffect(() => {
    if (isPerched || isSleeping) {
      if (wanderTimerRef.current) clearInterval(wanderTimerRef.current);
      return;
    }

    // Default home anchor near bottom-right quadrant
    const getHomeAnchor = () => ({
      x: Math.max(60, window.innerWidth - 130),
      y: Math.max(120, window.innerHeight - 150)
    });

    const wanderInterval = setInterval(() => {
      const home = getHomeAnchor();
      // Take playful small hops around home anchor (+/- 35px X, +/- 25px Y)
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 45;

      setCoords({
        x: Math.max(50, Math.min(window.innerWidth - 120, home.x + offsetX)),
        y: Math.max(100, Math.min(window.innerHeight - 120, home.y + offsetY))
      });
    }, 4500);

    wanderTimerRef.current = wanderInterval;

    return () => clearInterval(wanderInterval);
  }, [isPerched, isSleeping]);

  // Poke / Tap Companion Handler
  const handlePoke = (e) => {
    e.stopPropagation();
    setPose('jump');
    triggerGameFX('celebrate', coords.x + 35, coords.y + 35);

    const scoutName = character === 'ren' ? 'REN' : 'EMILY';
    setSpeechTitle(`${scoutName} // CHEERING!`);
    setSpeechText(
      character === 'ren'
        ? "Hell yeah! Let's conquer the dungeon bosses! ⚔️🔥"
        : "Kyaaa! You poked me! Quest energy recharged to 100%! 💖✨"
    );
    setShowSpeech(true);

    setTimeout(() => {
      setPose(isPerched ? 'read' : 'idle');
    }, 2200);
  };

  // Check if speech bubble should flip to the left when near right edge
  const shouldFlipBubble = coords.x > (typeof window !== 'undefined' ? window.innerWidth - 280 : 800);

  // If not actively perched on a card, companion rests inside the docked bottom-right HUD
  if (!isPerched) {
    return null;
  }

  return (
    <motion.div
      className="fixed z-40 pointer-events-none select-none"
      animate={{
        x: coords.x,
        y: coords.y
      }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 20
      }}
      style={{ left: 0, top: 0 }}
    >
      <div className="relative flex items-center justify-center">

        {/* Attached Contextual RPG Speech Bubble */}
        <AnimatePresence>
          {showSpeech && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-full mb-3 pointer-events-auto max-w-[210px] sm:max-w-[250px] p-3 rounded-2xl game-card hud-frame border-2 border-rpg-accent shadow-theme-glow-lg text-left backdrop-blur-2xl ${
                shouldFlipBubble ? 'right-0' : 'left-0'
              }`}
            >
              {/* Dialogue Header */}
              <div className="flex items-center justify-between gap-1 pb-1 mb-1.5 border-b border-rpg-border/60">
                <div className="flex items-center gap-1.5 truncate">
                  <Terminal className="w-3 h-3 text-rpg-accent flex-shrink-0" />
                  <span className="font-display font-bold text-[10px] text-rpg-accent uppercase tracking-wider truncate">
                    {speechTitle}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowSpeech(false);
                    if (onDismissPerch) onDismissPerch();
                  }}
                  className="text-rpg-muted hover:text-rpg-text text-[11px] p-0.5 rounded cursor-pointer"
                  title="Dismiss tip"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Dialogue Text */}
              <p className="font-sans text-[11px] text-rpg-text leading-snug font-medium">
                "{speechText}"
              </p>

              {/* Dialogue Tail Pointer Triangle */}
              <div 
                className={`absolute top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-rpg-accent ${
                  shouldFlipBubble ? 'right-6' : 'left-6'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Living Companion Avatar Sprite */}
        <div
          onClick={handlePoke}
          className="pointer-events-auto relative cursor-pointer group flex flex-col items-center"
          title="Click to interact with your companion!"
        >
          {/* Perching Indicator Glow Aura */}
          {isPerched && (
            <motion.div
              className="absolute -inset-2 rounded-full bg-rpg-accent/25 blur-md pointer-events-none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          {/* Anime Mascot Vector Model */}
          <div className="relative group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
            <AnimeMascot
              character={character}
              pose={pose}
              currentTheme={currentTheme}
              size={72}
            />

            {/* Inactivity Moon indicator if sleeping */}
            {isSleeping && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-950 border border-indigo-400 flex items-center justify-center text-[9px] text-indigo-300 shadow">
                🌙
              </span>
            )}

            {/* Active Radar Ping when roaming */}
            {!isSleeping && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rpg-secondary animate-ping" />
            )}
          </div>

          {/* Cute interactive tag below sprite */}
          <motion.span
            className="mt-1 px-2 py-0.5 rounded-full text-[8px] font-tech font-bold uppercase tracking-wider bg-rpg-bg/90 border border-rpg-border text-rpg-accent shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            {isSleeping ? 'Zzz...' : isPerched ? 'PERCHED 📖' : character === 'ren' ? 'REN ⚡' : 'EMILY 🌸'}
          </motion.span>
        </div>

      </div>
    </motion.div>
  );
}
