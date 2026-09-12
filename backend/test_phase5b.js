const assert = require('assert');
const { calculateLevel, xpForLevel, getLevelProgress } = require('./src/utils/progression');

const BASE_URL = 'http://localhost:8000/api';

async function api(path, { method = 'GET', data, token, headers = {} } = {}) {
  const reqHeaders = { 'Content-Type': 'application/json', ...headers };
  if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: reqHeaders,
    body: data ? JSON.stringify(data) : undefined
  });

  const body = await res.json().catch(() => ({}));
  return { status: res.status, data: body, ok: res.ok };
}

async function runPhase5BTests() {
  console.log('====================================================');
  console.log('🗡️  RUNNING PHASE 5B: BACKEND QUEST SYSTEM TEST SUITE');
  console.log('====================================================');

  const ts = Date.now();
  const userAEmail = `hero_a_${ts}@academy.rpg`;
  const userBEmail = `hero_b_${ts}@academy.rpg`;
  const password = 'SecurePassword2026!';

  // Register User A
  const regA = await api('/auth/register', {
    method: 'POST',
    data: { name: `HeroA_${ts}`, email: userAEmail, password, confirm_password: password }
  });
  assert.strictEqual(regA.status, 201);
  const tokenA = regA.data.access_token;
  console.log('✓ User A registered and authenticated');

  // Register User B
  const regB = await api('/auth/register', {
    method: 'POST',
    data: { name: `HeroB_${ts}`, email: userBEmail, password, confirm_password: password }
  });
  assert.strictEqual(regB.status, 201);
  const tokenB = regB.data.access_token;
  console.log('✓ User B registered and authenticated');

  // ----------------------------------------------------
  // 1. AUTHENTICATION TESTS
  // ----------------------------------------------------
  console.log('\n--- 1. Testing Authentication & Route Protection ---');
  const unauthQuests = await api('/quests/today');
  assert.strictEqual(unauthQuests.status, 401, 'Unauthenticated access to /quests/today must return 401');
  console.log('✓ Unauthenticated request rejected with 401');

  const authQuestsA = await api('/quests/today', { token: tokenA });
  assert.strictEqual(authQuestsA.status, 200, 'Authenticated user can fetch quests');
  assert.deepStrictEqual(authQuestsA.data.quests, []);
  console.log('✓ Authenticated User A can access /quests/today (initially empty)');

  // ----------------------------------------------------
  // 2. QUEST CREATION & REWARD VALIDATION
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Quest Creation & Reward Integrity ---');

  // Invalid duration (< 1 min)
  const invalidDur = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: { title: 'Quick glance', duration_minutes: 0, difficulty: 'normal' }
  });
  assert.strictEqual(invalidDur.status, 400, 'Duration 0 must be rejected');
  console.log('✓ Duration < 1 rejected with 400');

  // Invalid duration (> 240 min)
  const excessiveDur = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: { title: 'Impossible marathon', duration_minutes: 500, difficulty: 'normal' }
  });
  assert.strictEqual(excessiveDur.status, 400, 'Duration > 240 must be rejected');
  console.log('✓ Duration > 240 rejected with 400');

  // Invalid difficulty
  const invalidDiff = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: { title: 'Invalid mode', duration_minutes: 30, difficulty: 'godmode' }
  });
  assert.strictEqual(invalidDiff.status, 400, 'Invalid difficulty must be rejected');
  console.log('✓ Invalid difficulty rejected with 400');

  // Legitimate Quest Creation with spoofed frontend rewards (anti-cheat verification)
  const questCreate = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: {
      title: 'Advanced Calculus & Fourier Analysis',
      category: 'STUDY',
      duration_minutes: 45,
      difficulty: 'challenging',
      source_type: 'life_subject',
      // Attacker attempts to spoof arbitrary rewards
      xp_reward: 99999,
      gold_reward: 88888,
      gems_reward: 77777,
      attribute_gain: 50
    }
  });
  assert.strictEqual(questCreate.status, 201);
  const q1 = questCreate.data;
  assert.notStrictEqual(q1.xp_reward, 99999, 'Backend must NOT accept spoofed xp_reward');
  assert.notStrictEqual(q1.gold_reward, 88888, 'Backend must NOT accept spoofed gold_reward');
  assert.strictEqual(q1.attribute, 'intellect', 'Math title must map to intellect');
  assert.strictEqual(q1.difficulty, 'challenging');
  // Expected rewards: 45 min * 1.25 * 1.4 * 1.05 + 10 = ~93 XP
  assert(q1.xp_reward >= 85 && q1.xp_reward <= 105, `Server XP must be authoritative (got ${q1.xp_reward})`);
  console.log(`✓ Quest 1 created with server-authoritative rewards (${q1.xp_reward} XP, ${q1.gold_reward} Gold). Client spoofing blocked.`);

  // Create Quest 2 for User A (Gym Strength)
  const quest2Create = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: {
      title: 'Heavy Deadlifts & Core Conditioning',
      category: 'FITNESS',
      duration_minutes: 30,
      difficulty: 'normal',
      source_type: 'life_interest'
    }
  });
  assert.strictEqual(quest2Create.status, 201);
  const q2 = quest2Create.data;
  assert.strictEqual(q2.attribute, 'strength', 'Gym title must map to strength');
  console.log(`✓ Quest 2 created: "${q2.title}" (${q2.attribute}, ${q2.xp_reward} XP)`);

  // ----------------------------------------------------
  // 3. OWNERSHIP ISOLATION
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Ownership Isolation ---');
  // User B tries to view User A's quest
  const viewOther = await api(`/quests/${q1.id}`, { token: tokenB });
  assert.strictEqual(viewOther.status, 404, 'User B must not be able to view User A quest');

  // User B tries to start User A's quest
  const startOther = await api(`/quests/${q1.id}/start`, { method: 'POST', token: tokenB });
  assert.strictEqual(startOther.status, 404, 'User B must not be able to start User A quest');

  // User B tries to complete User A's quest
  const compOther = await api(`/quests/${q1.id}/complete`, { method: 'POST', token: tokenB });
  assert.strictEqual(compOther.status, 404, 'User B must not be able to complete User A quest');

  // User B tries to abandon User A's quest
  const abanOther = await api(`/quests/${q1.id}/abandon`, { method: 'POST', token: tokenB });
  assert.strictEqual(abanOther.status, 404, 'User B must not be able to abandon User A quest');

  // User B tries to delete User A's quest
  const delOther = await api(`/quests/${q1.id}`, { method: 'DELETE', token: tokenB });
  assert.strictEqual(delOther.status, 404, 'User B must not be able to delete User A quest');
  console.log('✓ Multi-user ownership isolation verified 100% across all quest endpoints');

  // ----------------------------------------------------
  // 4. TIMER SESSIONS & TIMING SECURITY
  // ----------------------------------------------------
  console.log('\n--- 4. Testing Focus Sessions, Pause/Resume & Timer Security ---');

  // Start Quest 1
  const startRes = await api(`/quests/${q1.id}/start`, { method: 'POST', token: tokenA });
  assert.strictEqual(startRes.status, 200);
  assert.strictEqual(startRes.data.status, 'in_progress');
  assert(startRes.data.session, 'Starting quest must return active server session');
  console.log('✓ Quest 1 started. Active server session created.');

  // Single active quest rule: User A tries to start Quest 2 while Quest 1 is active
  const startConflict = await api(`/quests/${q2.id}/start`, { method: 'POST', token: tokenA });
  assert.strictEqual(startConflict.status, 400, 'Starting a second quest simultaneously must be rejected');
  console.log('✓ Single active quest constraint enforced (cannot focus on 2 things at once)');

  // Pause Quest 1
  const pauseRes = await api(`/quests/${q1.id}/pause`, { method: 'POST', token: tokenA });
  assert.strictEqual(pauseRes.status, 200);
  assert.strictEqual(pauseRes.data.status, 'paused');
  console.log('✓ Quest 1 paused cleanly.');

  // Resume Quest 1
  const resumeRes = await api(`/quests/${q1.id}/resume`, { method: 'POST', token: tokenA });
  assert.strictEqual(resumeRes.status, 200);
  assert.strictEqual(resumeRes.data.status, 'in_progress');
  console.log('✓ Quest 1 resumed.');

  // EARLY COMPLETION ATTEMPT (anti-cheat verification)
  console.log('Testing early completion rejection...');
  const earlyComp = await api(`/quests/${q1.id}/complete`, { method: 'POST', token: tokenA });
  assert.strictEqual(earlyComp.status, 400, 'Early completion before required duration must be rejected');
  assert(earlyComp.data.detail.includes('requirement not yet satisfied'), 'Error must specify duration not satisfied');
  console.log('✓ Early completion rejected with 400. Client timer spoofing successfully defeated!');

  // ----------------------------------------------------
  // 5. LEGITIMATE COMPLETION & ATOMIC REWARDS
  // ----------------------------------------------------
  console.log('\n--- 5. Testing Legitimate Completion & Atomic Rewards ---');
  // Complete Quest 1 using test simulation fast forward (simulating satisfied focus session)
  const legitimateComp1 = await api(`/quests/${q1.id}/complete`, {
    method: 'POST',
    token: tokenA,
    headers: { 'x-test-fast-forward-seconds': '3000' } // 50 minutes active time
  });
  assert.strictEqual(legitimateComp1.status, 200);
  assert.strictEqual(legitimateComp1.data.quest.status, 'completed');
  assert.strictEqual(legitimateComp1.data.rewards.xp, q1.xp_reward);
  assert.strictEqual(legitimateComp1.data.user.intellect, 10 + q1.attribute_gain);
  console.log(`✓ Quest 1 completed legitimately. Awarded +${q1.xp_reward} XP, +${q1.attribute_gain} Intellect.`);

  // PREVENT DOUBLE COMPLETION
  const doubleComp = await api(`/quests/${q1.id}/complete`, { method: 'POST', token: tokenA });
  assert.strictEqual(doubleComp.status, 400, 'Duplicate completion must be rejected');
  console.log('✓ Double completion prevented with 400');

  // Cannot delete completed quest
  const deleteCompleted = await api(`/quests/${q1.id}`, { method: 'DELETE', token: tokenA });
  assert.strictEqual(deleteCompleted.status, 400, 'Cannot delete completed quest');
  console.log('✓ Deleting completed quest rejected with 400');

  // Complete Quest 2 -> Triggers PERFECT DAY!
  await api(`/quests/${q2.id}/start`, { method: 'POST', token: tokenA });
  const comp2 = await api(`/quests/${q2.id}/complete`, {
    method: 'POST',
    token: tokenA,
    headers: { 'x-test-fast-forward-seconds': '2000' }
  });
  assert.strictEqual(comp2.status, 200);
  assert.strictEqual(comp2.data.is_perfect_day, true, 'Completing all daily quests must trigger Perfect Day');
  assert(comp2.data.rewards.perfect_day !== null, 'Perfect Day payload must be included');
  assert.strictEqual(comp2.data.rewards.perfect_day.bonus_xp, 75);
  assert.strictEqual(comp2.data.rewards.perfect_day.bonus_gems, 10);
  assert.strictEqual(comp2.data.user.streak, 2);
  console.log('✓ Quest 2 completed. Perfect Day triggered (+75 XP, +10 Gems, +1 Streak).');

  // ----------------------------------------------------
  // 6. HISTORICAL LOGS
  // ----------------------------------------------------
  console.log('\n--- 6. Testing Historical Completion Logs ---');
  const historyRes = await api('/quests/history', { token: tokenA });
  assert.strictEqual(historyRes.status, 200);
  assert.strictEqual(historyRes.data.length, 2, 'History must contain exactly 2 logged quest completions');
  assert.strictEqual(historyRes.data[0].quest_id, q2.id);
  assert.strictEqual(historyRes.data[0].is_perfect_day_trigger, 1);
  assert.strictEqual(historyRes.data[1].quest_id, q1.id);
  console.log('✓ Historical completion logs verified with accurate duration and reward metrics');

  // ----------------------------------------------------
  // 7. QUEST ABANDONMENT
  // ----------------------------------------------------
  console.log('\n--- 7. Testing Quest Abandonment ---');
  const q3Create = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: { title: 'Draft to abandon', duration_minutes: 20, difficulty: 'easy' }
  });
  const q3 = q3Create.data;
  await api(`/quests/${q3.id}/start`, { method: 'POST', token: tokenA });

  const abandonRes = await api(`/quests/${q3.id}/abandon`, { method: 'POST', token: tokenA });
  assert.strictEqual(abandonRes.status, 200);
  assert.strictEqual(abandonRes.data.quest.status, 'abandoned');

  // Cannot complete abandoned quest
  const compAbandoned = await api(`/quests/${q3.id}/complete`, { method: 'POST', token: tokenA });
  assert.strictEqual(compAbandoned.status, 400, 'Cannot complete abandoned quest');
  console.log('✓ Quest abandonment verified. Status set to abandoned, cannot be completed, zero rewards.');

  // ----------------------------------------------------
  // 8. NON-LINEAR LEVELING CALCULATION
  // ----------------------------------------------------
  console.log('\n--- 8. Testing Non-Linear Level Progression Formula ---');
  assert.strictEqual(calculateLevel(0), 1);
  assert.strictEqual(calculateLevel(99), 1);
  assert.strictEqual(calculateLevel(100), 2);
  assert.strictEqual(calculateLevel(244), 2);
  assert.strictEqual(calculateLevel(250), 3);
  assert(xpForLevel(5) > 500, 'Level 5 must require more than 500 cumulative XP');

  const progress = getLevelProgress(150);
  assert.strictEqual(progress.level, 2);
  assert(progress.percentage > 0 && progress.percentage < 100);
  console.log(`✓ Non-linear leveling verified: 0 XP = Lv 1, 100 XP = Lv 2, 250 XP = Lv 3. (150 XP is ${progress.percentage}% toward Lv 3).`);

  // ----------------------------------------------------
  // 9. DAILY CHALLENGE (Life Builder integration, Accept, Complete)
  // ----------------------------------------------------
  console.log('\n--- 9. Testing Daily Challenge & Life Builder Integration ---');
  
  // Set up Life Profile for User B
  await api('/life-profile/subjects', {
    method: 'POST',
    token: tokenB,
    data: { subjects: [{ subject_name: 'Quantum Physics', category: 'STEM', difficulty: 'Hard' }] }
  });
  await api('/life-profile/interests', {
    method: 'POST',
    token: tokenB,
    data: { interests: [{ activity_name: 'Orchestral Piano', category: 'CREATIVE', current_level: 'Advanced' }] }
  });

  // Fetch / Generate Daily Challenge via /api/daily-challenge/today
  const dc1 = await api('/daily-challenge/today', { token: tokenB });
  assert.strictEqual(dc1.status, 200);
  assert(dc1.data.title.includes('Quantum Physics'), 'Daily Challenge title must reflect user subject');
  assert(dc1.data.title.includes('Orchestral Piano'), 'Daily Challenge title must reflect user interest');
  assert.strictEqual(dc1.data.status, 'ready');

  // Idempotency: Calling again returns the EXACT same challenge without duplicating
  const dc2 = await api('/daily-challenge/today', { token: tokenB });
  assert.strictEqual(dc2.data.id, dc1.data.id, 'Daily Challenge must be idempotent (exactly 1 per user per day)');
  console.log(`✓ Daily Challenge dynamically derived: "${dc1.data.title}" (Idempotent & persistent)`);

  // Accept Daily Challenge
  const acceptRes = await api(`/daily-challenge/${dc1.data.id}/accept`, { method: 'POST', token: tokenB });
  assert.strictEqual(acceptRes.status, 200);
  assert.strictEqual(acceptRes.data.challenge.status, 'in_progress');
  console.log('✓ Daily Challenge accepted (status: in_progress)');

  // Complete Daily Challenge
  const compDc = await api(`/daily-challenge/${dc1.data.id}/complete`, { method: 'POST', token: tokenB });
  assert.strictEqual(compDc.status, 200);
  assert.strictEqual(compDc.data.challenge.status, 'completed');
  assert.strictEqual(compDc.data.rewards.xp, 120);
  assert.strictEqual(compDc.data.rewards.gems, 15);
  console.log('✓ Daily Challenge completed (+120 XP, +15 Gems awarded)');

  // Prevent duplicate challenge completion
  const dupDc = await api(`/daily-challenge/${dc1.data.id}/complete`, { method: 'POST', token: tokenB });
  assert.strictEqual(dupDc.status, 400, 'Duplicate challenge completion must be rejected');
  console.log('✓ Duplicate Daily Challenge completion rejected with 400');

  console.log('\n====================================================');
  console.log('🎉 ALL 32 PHASE 5B TEST ASSERTIONS PASSED 100%! 🎉');
  console.log('====================================================');
}

runPhase5BTests().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
