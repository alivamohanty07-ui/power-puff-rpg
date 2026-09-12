/**
 * House Induction & Personality Trial Logic Engine
 * 
 * Defines the 3 canonical houses, the 5 personality trial questions,
 * and the deterministic alignment calculation with Question 5 tie-breaker.
 */

export const HOUSES = {
  blossom: {
    id: 'blossom',
    name: 'House Blossom',
    title: 'THE STRATEGISTS',
    subtitle: 'The Strategist',
    icon: '🌸',
    emblem: '💖',
    color: 'rose',
    accentColor: '#ec4899',
    secondaryColor: '#a855f7',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    glowClass: 'shadow-[0_0_40px_rgba(236,72,153,0.35)]',
    borderClass: 'border-pink-500/60',
    description: 'For those who think before they act, turn chaos into plans, and pursue mastery through knowledge.',
    revealDescription: 'Your instinct is to understand, plan, and master.',
    traits: ['INTELLECT', 'STRATEGY', 'LEADERSHIP'],
    bonuses: [
      { label: 'INTELLECT', value: '+25%' },
      { label: 'STRATEGY', value: '+15%' }
    ],
    themeId: 'dark-dungeon',
    atmosphere: {
      particles: 'petals',
      palette: ['#f472b6', '#ec4899', '#c084fc', '#fbcfe8'],
      ambientText: 'Celestial library & strategic sanctuary'
    }
  },
  bubbles: {
    id: 'bubbles',
    name: 'House Bubbles',
    title: 'THE VITAL GUARDIANS',
    subtitle: 'The Vital Guardian',
    icon: '🫧',
    emblem: '🫧',
    color: 'cyan',
    accentColor: '#06b6d4',
    secondaryColor: '#38bdf8',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    glowClass: 'shadow-[0_0_40px_rgba(6,182,212,0.35)]',
    borderClass: 'border-cyan-500/60',
    description: 'For those who value balance, empathy, recovery, and the strength to care for themselves and others.',
    revealDescription: 'Your strength comes from balance, resilience, and care.',
    traits: ['VITALITY', 'MIND', 'BALANCE'],
    bonuses: [
      { label: 'VITALITY', value: '+20%' },
      { label: 'MIND RECOVERY', value: '+20%' }
    ],
    themeId: 'cozy-pinkish',
    atmosphere: {
      particles: 'bubbles',
      palette: ['#22d3ee', '#38bdf8', '#67e8f9', '#a5f3fc'],
      ambientText: 'Serene healing springs & mindful sanctuary'
    }
  },
  buttercup: {
    id: 'buttercup',
    name: 'House Buttercup',
    title: 'THE FRONTLINE',
    subtitle: 'The Frontline',
    icon: '⚡',
    emblem: '⚡',
    color: 'amber',
    accentColor: '#f59e0b',
    secondaryColor: '#ef4444',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glowClass: 'shadow-[0_0_40px_rgba(245,158,11,0.35)]',
    borderClass: 'border-amber-500/60',
    description: 'For those who act, endure, push through resistance, and thrive when the challenge gets harder.',
    revealDescription: "You don't wait for the challenge to disappear. You face it.",
    traits: ['STRENGTH', 'DISCIPLINE', 'RESILIENCE'],
    bonuses: [
      { label: 'STRENGTH', value: '+25%' },
      { label: 'DISCIPLINE', value: '+15%' }
    ],
    themeId: 'dark-dungeon',
    atmosphere: {
      particles: 'sparks',
      palette: ['#f59e0b', '#fbbf24', '#ef4444', '#f97316'],
      ambientText: 'Mountain forge & iron discipline arena'
    }
  }
};

export const PERSONALITY_QUESTIONS = [
  {
    id: 1,
    stageTitle: 'THE FIRST TRIAL',
    question: 'A difficult challenge stands before you. What is your first instinct?',
    options: [
      {
        id: 'A',
        text: 'I step back, understand the problem, and create a strategy.',
        houseId: 'blossom'
      },
      {
        id: 'B',
        text: 'I consider how the situation is affecting me and everyone involved before deciding what to do.',
        houseId: 'bubbles'
      },
      {
        id: 'C',
        text: 'I stop overthinking and start attacking the problem immediately.',
        houseId: 'buttercup'
      }
    ]
  },
  {
    id: 2,
    stageTitle: 'THE SECOND TRIAL',
    question: 'Your energy is completely drained. What helps you recover?',
    options: [
      {
        id: 'A',
        text: 'I disconnect and spend some quiet time reading, thinking, or learning.',
        houseId: 'blossom'
      },
      {
        id: 'B',
        text: 'I rest, hydrate, listen to something calming, and reset my mind.',
        houseId: 'bubbles'
      },
      {
        id: 'C',
        text: 'I move. A workout, walk, or physical activity gets me back into action.',
        houseId: 'buttercup'
      }
    ]
  },
  {
    id: 3,
    stageTitle: 'THE THIRD TRIAL',
    question: 'Your team has a difficult mission. What role naturally attracts you?',
    options: [
      {
        id: 'A',
        text: "The strategist — I'll figure out the plan and coordinate everyone.",
        houseId: 'blossom'
      },
      {
        id: 'B',
        text: "The guardian — I'll make sure everyone stays supported and the team doesn't burn out.",
        houseId: 'bubbles'
      },
      {
        id: 'C',
        text: "The frontliner — give me the difficult task and I'll get it done.",
        houseId: 'buttercup'
      }
    ]
  },
  {
    id: 4,
    stageTitle: 'THE FOURTH TRIAL',
    question: 'You can create your perfect workspace. What does it look like?',
    options: [
      {
        id: 'A',
        text: 'A beautifully organized command center designed for deep focus.',
        houseId: 'blossom'
      },
      {
        id: 'B',
        text: 'A cozy, peaceful space with plants, warm lighting, music, and comfortable surroundings.',
        houseId: 'bubbles'
      },
      {
        id: 'C',
        text: 'A minimalist, high-energy setup that makes me want to get moving immediately.',
        houseId: 'buttercup'
      }
    ]
  },
  {
    id: 5,
    stageTitle: 'THE FINAL BLESSING',
    isMystical: true,
    question: 'A mysterious artifact offers you one blessing. Which power do you choose?',
    options: [
      {
        id: 'A',
        powerTitle: 'THE MIND OF THE ARCHITECT',
        text: 'See patterns others miss.',
        houseId: 'blossom'
      },
      {
        id: 'B',
        powerTitle: 'THE HEART OF THE GUARDIAN',
        text: 'Restore yourself and those around you.',
        houseId: 'bubbles'
      },
      {
        id: 'C',
        powerTitle: 'THE WILL OF THE WARRIOR',
        text: 'Push through any challenge that stands before you.',
        houseId: 'buttercup'
      }
    ]
  }
];

/**
 * Deterministically calculates house alignment based on 5 answers.
 * If there is a tie, Question 5's choice acts as the deterministic tie-breaker.
 * 
 * @param {Record<number, string>} answers - Map of questionId (1..5) to optionId ('A' | 'B' | 'C')
 * @returns {{ winningHouse: object, scores: { blossom: number, bubbles: number, buttercup: number }, isTieBroken: boolean }}
 */
export function calculateHouseAlignment(answers) {
  const scores = {
    blossom: 0,
    bubbles: 0,
    buttercup: 0
  };

  PERSONALITY_QUESTIONS.forEach((q) => {
    const chosenOptionId = answers[q.id];
    if (chosenOptionId) {
      const option = q.options.find((opt) => opt.id === chosenOptionId);
      if (option && option.houseId && scores[option.houseId] !== undefined) {
        scores[option.houseId] += 1;
      }
    }
  });

  // Find max score
  const maxScore = Math.max(scores.blossom, scores.bubbles, scores.buttercup);
  const topHouses = Object.keys(scores).filter((houseId) => scores[houseId] === maxScore);

  let winningHouseId = topHouses[0];
  let isTieBroken = false;

  if (topHouses.length > 1) {
    isTieBroken = true;
    // Tie-breaker: Question 5 choice
    const q5Answer = answers[5];
    const q5Option = PERSONALITY_QUESTIONS[4].options.find((opt) => opt.id === q5Answer);
    if (q5Option && topHouses.includes(q5Option.houseId)) {
      winningHouseId = q5Option.houseId;
    } else {
      // Fallback in case Q5 choice wasn't one of the tied houses
      winningHouseId = topHouses[0];
    }
  }

  return {
    winningHouse: HOUSES[winningHouseId] || HOUSES.blossom,
    scores,
    isTieBroken
  };
}

/**
 * Persists induction results to localStorage keeping compatibility
 * with powerpuff_rpg_character and power_puff_user.
 * 
 * @param {object} house - The selected house object
 * @param {object} scores - The test scores breakdown
 */
export function persistHouseInduction(house, scores = {}) {
  try {
    const existingRaw = localStorage.getItem('powerpuff_rpg_character');
    const existing = existingRaw ? JSON.parse(existingRaw) : {};
    
    const updatedCharacter = {
      ...existing,
      house: house.name,
      houseId: house.id,
      personality_house: house.name,
      completedHouseInduction: true,
      inductionScores: scores,
      sortedAt: new Date().toISOString()
    };
    
    localStorage.setItem('powerpuff_rpg_character', JSON.stringify(updatedCharacter));

    // Also sync to power_puff_user if it exists
    const userRaw = localStorage.getItem('power_puff_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      user.personality_house = house.name;
      user.selected_theme = house.themeId || user.selected_theme;
      localStorage.setItem('power_puff_user', JSON.stringify(user));
    }

    return updatedCharacter;
  } catch (err) {
    console.error('Failed to persist house induction payload:', err);
    return null;
  }
}
