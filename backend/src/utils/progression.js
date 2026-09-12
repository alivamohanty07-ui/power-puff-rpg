/**
 * Power Puff RPG — Centralized Non-Linear Level Progression Engine
 * 
 * Implements a progressive polynomial curve rather than simple linear increments (XP / 100).
 * As players advance, each subsequent level demands deeper mastery and endurance.
 */

/**
 * Returns the cumulative total XP required to achieve a specific level.
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP
 * Level 4: 430 XP
 * Level 5: 640 XP
 * Level 10: 2,050 XP
 * ...
 */
function xpForLevel(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  // Non-linear polynomial curve: 55 * n^1.5 + 45 * n
  return Math.floor(55 * Math.pow(n, 1.5) + 45 * n);
}

/**
 * Calculates a player's level from their total accumulated XP.
 * Centralized server-side authority.
 * @param {number} totalXP 
 * @returns {number} Level (minimum 1, maximum 100)
 */
function calculateLevel(totalXP) {
  const xp = Math.max(0, Number(totalXP) || 0);
  let level = 1;
  
  while (level < 100) {
    const nextLevelReq = xpForLevel(level + 1);
    if (xp < nextLevelReq) {
      break;
    }
    level++;
  }
  
  return level;
}

/**
 * Returns detailed progress breakdown towards the next level for UI presentation
 * @param {number} totalXP 
 */
function getLevelProgress(totalXP) {
  const currentLevel = calculateLevel(totalXP);
  const currentBase = xpForLevel(currentLevel);
  const nextBase = xpForLevel(currentLevel + 1);
  const neededForNext = nextBase - currentBase;
  const earnedInLevel = (Number(totalXP) || 0) - currentBase;
  const percentage = Math.min(100, Math.max(0, Math.round((earnedInLevel / neededForNext) * 100)));

  return {
    level: currentLevel,
    total_xp: totalXP,
    xp_in_level: Math.max(0, earnedInLevel),
    xp_needed_for_next: neededForNext,
    percentage
  };
}

module.exports = {
  xpForLevel,
  calculateLevel,
  getLevelProgress
};
