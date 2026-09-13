const assert = require('assert');

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

async function runSecurityTests() {
  console.log('====================================================');
  console.log('🛡️  DAILY CHALLENGE ANTI-CHEATING SECURITY TEST SUITE');
  console.log('====================================================\n');

  const ts = Date.now();
  const userAEmail = `cheattest_a_${ts}@academy.rpg`;
  const userBEmail = `cheattest_b_${ts}@academy.rpg`;
  const password = 'SecureTestPassword2026!';

  // 1. Setup User A
  console.log('1. Setting up User A with Life Profile...');
  const regA = await api('/auth/register', {
    method: 'POST',
    data: { name: `DefenderA_${ts}`, email: userAEmail, password, confirm_password: password }
  });
  assert.strictEqual(regA.status, 201, 'User A registration must succeed');
  const tokenA = regA.data.access_token;
  const userAInitial = regA.data.user;

  // Setup Life Profile for User A
  const lpRes = await api('/life-profile', {
    method: 'PUT',
    token: tokenA,
    data: {
      institution_name: 'Hero Academy',
      education_level: 'master',
      field_of_study: 'Arcane Arcana',
      subjects: ['Quantum Spellcasting', 'Rune Geometry'],
      interests: [
        { activity_name: 'Dragon Slaying', category: 'Physical Mastery', frequency: 'daily', approximate_duration: '1_hour' }
      ]
    }
  });
  assert.strictEqual(lpRes.status, 200, 'Life profile setup must succeed');
  console.log('✓ User A profile created with subjects & interests');

  // 2. Setup User B (Intruder)
  console.log('\n2. Setting up User B (Intruder)...');
  const regB = await api('/auth/register', {
    method: 'POST',
    data: { name: `IntruderB_${ts}`, email: userBEmail, password, confirm_password: password }
  });
  assert.strictEqual(regB.status, 201, 'User B registration must succeed');
  const tokenB = regB.data.access_token;
  console.log('✓ User B registered');

  // 3. Fetch & Accept Daily Challenge for User A
  console.log('\n3. Generating and accepting Daily Challenge for User A...');
  const dcRes = await api('/quests/daily-challenge', { token: tokenA });
  assert.strictEqual(dcRes.status, 200, 'Fetch daily challenge must succeed');
  const challenge = dcRes.data;
  assert(challenge && challenge.id, 'Challenge must have an ID');
  assert(Array.isArray(challenge.tasks), 'Challenge must have tasks array');
  assert(challenge.tasks.length >= 2, 'Challenge must contain at least 2 tasks');
  console.log(`✓ Daily Challenge generated: "${challenge.title}" with ${challenge.tasks.length} tasks`);

  const task1 = challenge.tasks[0];
  const task2 = challenge.tasks[1];
  console.log(`  - Task 1: [ID: ${task1.id}] ${task1.title} (${task1.target_minutes}m, ${task1.attribute})`);
  console.log(`  - Task 2: [ID: ${task2.id}] ${task2.title} (${task2.target_minutes}m, ${task2.attribute})`);

  // Accept Challenge
  const acceptRes = await api(`/quests/daily-challenge/${challenge.id}/accept`, {
    method: 'POST',
    token: tokenA
  });
  assert.strictEqual(acceptRes.status, 200, 'Accepting daily challenge must succeed');
  console.log('✓ Daily Challenge accepted (status: in_progress)');

  // ----------------------------------------------------------------
  // SECURITY TEST 1: INCOMPLETE CHALLENGE TEST (0 TASKS COMPLETED)
  // ----------------------------------------------------------------
  console.log('\n--- SECURITY TEST 1: Incomplete Challenge Test (0 Tasks Completed) ---');
  const cheatAttempt1 = await api(`/quests/daily-challenge/${challenge.id}/complete`, {
    method: 'POST',
    token: tokenA
  });

  assert.strictEqual(cheatAttempt1.status, 400, 'Attempting completion with 0 tasks done must return HTTP 400');
  assert.strictEqual(
    cheatAttempt1.data.detail,
    'Your trial is not yet complete. Conquer every required quest first.',
    'Must return exact anti-cheating error message'
  );
  assert(Array.isArray(cheatAttempt1.data.uncompleted_tasks), 'Must return uncompleted_tasks array');
  assert.strictEqual(cheatAttempt1.data.uncompleted_tasks.length, challenge.tasks.length, 'All tasks must be listed as uncompleted');

  // Verify User A stats did NOT increase
  const userACheck1 = await api('/auth/me', { token: tokenA });
  assert.strictEqual(userACheck1.data.user.xp, userAInitial.xp, 'XP must NOT increase on rejected completion');
  assert.strictEqual(userACheck1.data.user.gems, userAInitial.gems, 'Gems must NOT increase on rejected completion');
  console.log('✓ PASS: Server authoritatively rejected 0-task completion with HTTP 400 and awarded 0 rewards');

  // ----------------------------------------------------------------
  // SECURITY TEST 2: PARTIAL COMPLETION TEST (TASK 1 DONE, TASK 2 INCOMPLETE)
  // ----------------------------------------------------------------
  console.log('\n--- SECURITY TEST 2: Partial Completion Test (Task 1 Complete, Task 2 Incomplete) ---');
  
  // Create and legitimately complete Quest 1 for Task 1
  const q1Res = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: {
      title: task1.title,
      category: 'KNOWLEDGE',
      attribute: task1.attribute,
      difficulty: 'normal',
      duration_minutes: task1.target_minutes,
      challenge_id: challenge.id,
      challenge_task_id: task1.id
    }
  });
  assert.strictEqual(q1Res.status, 201, 'Quest 1 creation must succeed');
  const quest1 = q1Res.data;

  // Start Quest 1
  const start1 = await api(`/quests/${quest1.id}/start`, { method: 'POST', token: tokenA });
  assert.strictEqual(start1.status, 200, 'Starting quest 1 must succeed');

  // Complete Quest 1 with verified server timer accommodation
  const comp1 = await api(`/quests/${quest1.id}/complete`, {
    method: 'POST',
    token: tokenA,
    headers: { 'x-test-fast-forward-seconds': String(task1.target_minutes * 60 + 10) }
  });
  assert.strictEqual(comp1.status, 200, 'Quest 1 legitimate completion must succeed');
  console.log(`✓ Quest 1 completed legitimately (${task1.target_minutes}m server duration logged)`);

  // Verify challenge task 1 is recognized as complete, but challenge overall is NOT completed
  const dcCheckMid = await api('/quests/daily-challenge', { token: tokenA });
  const midTask1 = dcCheckMid.data.tasks.find(t => String(t.id) === String(task1.id));
  const midTask2 = dcCheckMid.data.tasks.find(t => String(t.id) === String(task2.id));
  assert.strictEqual(midTask1.is_completed, true, 'Task 1 must now be marked is_completed: true');
  assert.strictEqual(midTask2.is_completed, false, 'Task 2 must still be is_completed: false');
  assert.strictEqual(dcCheckMid.data.all_tasks_completed, false, 'all_tasks_completed must be false');

  // Attempt to complete the Daily Challenge with only Task 1 completed
  const cheatAttempt2 = await api(`/quests/daily-challenge/${challenge.id}/complete`, {
    method: 'POST',
    token: tokenA
  });

  assert.strictEqual(cheatAttempt2.status, 400, 'Attempting completion with partial tasks must return HTTP 400');
  assert.strictEqual(
    cheatAttempt2.data.detail,
    'Your trial is not yet complete. Conquer every required quest first.',
    'Must return exact anti-cheating error message'
  );
  assert(Array.isArray(cheatAttempt2.data.uncompleted_tasks), 'Must return uncompleted_tasks');
  assert.strictEqual(cheatAttempt2.data.uncompleted_tasks.length, 1, 'Exactly 1 task must remain uncompleted');
  assert.strictEqual(String(cheatAttempt2.data.uncompleted_tasks[0].id), String(task2.id), 'Task 2 must be the uncompleted task');

  // Verify user rewards are strictly 0 for challenge
  const userACheck2 = await api('/auth/me', { token: tokenA });
  assert.strictEqual(userACheck2.data.user.gems, userAInitial.gems, 'Gems must remain unchanged (challenge gems not awarded)');
  console.log('✓ PASS: Server authoritatively rejected partial completion with HTTP 400 and awarded 0 challenge rewards');

  // ----------------------------------------------------------------
  // SECURITY TEST 3: CROSS-USER SECURITY TEST (USER B TRIES USER A CHALLENGE)
  // ----------------------------------------------------------------
  console.log('\n--- SECURITY TEST 3: Cross-User Security Test (IDOR Prevention) ---');
  const crossUserAttempt = await api(`/quests/daily-challenge/${challenge.id}/complete`, {
    method: 'POST',
    token: tokenB
  });

  assert.strictEqual(crossUserAttempt.status, 404, 'Intruder attempting to complete another user challenge must return 404');
  assert.strictEqual(crossUserAttempt.data.detail, 'Daily challenge not found.', 'Must return 404 not found');
  console.log('✓ PASS: User B forbidden from completing User A challenge (HTTP 404)');

  // ----------------------------------------------------------------
  // SECURITY TEST 4: LEGITIMATE FULL COMPLETION
  // ----------------------------------------------------------------
  console.log('\n--- SECURITY TEST 4: Legitimate Full Completion (All Tasks Satisfied) ---');
  
  // Create and legitimately complete Quest 2 for Task 2
  const q2Res = await api('/quests', {
    method: 'POST',
    token: tokenA,
    data: {
      title: task2.title,
      category: 'FITNESS',
      attribute: task2.attribute,
      difficulty: 'normal',
      duration_minutes: task2.target_minutes,
      challenge_id: challenge.id,
      challenge_task_id: task2.id
    }
  });
  assert.strictEqual(q2Res.status, 201, 'Quest 2 creation must succeed');
  const quest2 = q2Res.data;

  // Start Quest 2
  await api(`/quests/${quest2.id}/start`, { method: 'POST', token: tokenA });

  // Complete Quest 2 with verified server timer accommodation
  const comp2 = await api(`/quests/${quest2.id}/complete`, {
    method: 'POST',
    token: tokenA,
    headers: { 'x-test-fast-forward-seconds': String(task2.target_minutes * 60 + 10) }
  });
  assert.strictEqual(comp2.status, 200, 'Quest 2 legitimate completion must succeed');
  console.log(`✓ Quest 2 completed legitimately (${task2.target_minutes}m server duration logged)`);

  // Record stats right before completing daily challenge
  const userABeforeChallenge = (await api('/auth/me', { token: tokenA })).data.user;

  // Now call completeDailyChallenge
  const legitimateComplete = await api(`/quests/daily-challenge/${challenge.id}/complete`, {
    method: 'POST',
    token: tokenA
  });

  assert.strictEqual(legitimateComplete.status, 200, 'Legitimate complete must return HTTP 200');
  assert.strictEqual(legitimateComplete.data.success, true);
  assert.strictEqual(legitimateComplete.data.challenge.status, 'completed', 'Challenge status must be completed');
  assert.strictEqual(legitimateComplete.data.challenge.all_tasks_completed, true, 'all_tasks_completed must be true');

  // Verify Authoritative Rewards
  const rewards = legitimateComplete.data.rewards;
  assert.strictEqual(rewards.xp, 120, 'Awarded XP must be 120');
  assert.strictEqual(rewards.gold, 60, 'Awarded Gold must be 60');
  assert.strictEqual(rewards.gems, 15, 'Awarded Gems must be 15');
  assert.strictEqual(rewards.attribute_gain, 5, 'Awarded Attribute Gain must be 5');

  // Verify User Stats in Database
  const userAAfterChallenge = (await api('/auth/me', { token: tokenA })).data.user;
  assert.strictEqual(userAAfterChallenge.xp, userABeforeChallenge.xp + 120, 'User XP must increase by exactly 120');
  assert.strictEqual(userAAfterChallenge.gold, userABeforeChallenge.gold + 60, 'User Gold must increase by exactly 60');
  assert.strictEqual(userAAfterChallenge.gems, userABeforeChallenge.gems + 15, 'User Gems must increase by exactly 15');
  console.log('✓ PASS: Legitimate completion succeeded with HTTP 200 and awarded authoritative rewards (+120 XP, +60 Gold, +15 Gems, +5 Attr)');

  // ----------------------------------------------------------------
  // SECURITY TEST 5: DUPLICATE COMPLETION PREVENTION
  // ----------------------------------------------------------------
  console.log('\n--- SECURITY TEST 5: Duplicate Completion Prevention ---');
  const duplicateAttempt = await api(`/quests/daily-challenge/${challenge.id}/complete`, {
    method: 'POST',
    token: tokenA
  });

  assert.strictEqual(duplicateAttempt.status, 400, 'Duplicate completion attempt must return HTTP 400');
  assert.strictEqual(
    duplicateAttempt.data.detail,
    'Daily challenge is already completed. Duplicate rewards prevented.',
    'Must return duplicate protection error message'
  );

  // Verify stats did not increase
  const userAFinal = (await api('/auth/me', { token: tokenA })).data.user;
  assert.strictEqual(userAFinal.xp, userAAfterChallenge.xp, 'XP must NOT increase on duplicate attempt');
  assert.strictEqual(userAFinal.gems, userAAfterChallenge.gems, 'Gems must NOT increase on duplicate attempt');
  console.log('✓ PASS: Duplicate completion prevented with HTTP 400 and zero duplicate rewards awarded');

  console.log('\n====================================================');
  console.log('🎉 ALL DAILY CHALLENGE SECURITY TESTS PASSED 100%!');
  console.log('====================================================');
}

runSecurityTests().catch(err => {
  console.error('\n❌ SECURITY TEST FAILURE:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
