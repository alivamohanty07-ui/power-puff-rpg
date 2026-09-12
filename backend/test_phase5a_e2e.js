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

async function runE2ETest() {
  console.log('--- STARTING PHASE 5A END-TO-END INTEGRATION TEST ---');
  const testEmail = `phase5a_${Date.now()}@example.com`;
  const testUser = `hero_${Date.now()}`;
  const testPassword = 'Password123!';

  // 1. Signup
  console.log('1. Testing User Signup...');
  const signupRes = await api('/auth/register', {
    method: 'POST',
    data: {
      name: testUser,
      email: testEmail,
      password: testPassword,
      confirm_password: testPassword
    }
  });
  assert.strictEqual(signupRes.status, 201);
  const token = signupRes.data.access_token;
  console.log('✓ User signed up successfully.');

  // 2. House Induction
  console.log('2. Testing House Induction...');
  const houseRes = await api('/auth/house', {
    method: 'PATCH',
    token,
    data: {
      personality_house: 'blossom',
      house_scores: { blossom: 10, bubbles: 4, buttercup: 3 }
    }
  });
  assert.strictEqual(houseRes.status, 200);
  console.log('✓ House Blossom selected.');

  // 3. Avatar Save
  console.log('3. Testing Avatar Save...');
  const avatarRes = await api('/auth/avatar', {
    method: 'PATCH',
    token,
    data: {
      name: 'Princess Bubbles',
      avatar_data: {
        base: 'female',
        skinTone: 'porcelain',
        hairstyle: 'twin-tails',
        hairColor: 'pastel-rose',
        outfit: 'battle-kimono',
        hairAccessory: 'silk-bow',
        headItem: 'golden-tiara',
        handItem: 'starlight-wand'
      }
    }
  });
  assert.strictEqual(avatarRes.status, 200);
  console.log('✓ Avatar saved.');

  // 4. Life Builder Profile
  console.log('4. Testing Life Builder Profile Setup...');
  await api('/life-profile/path', {
    method: 'POST',
    token,
    data: { path_type: 'stem_innovator', custom_path: 'AI & Quantum Apprentice' }
  });

  await api('/life-profile/education', {
    method: 'POST',
    token,
    data: {
      status: 'university',
      field: 'Computer Science',
      institution_or_company: 'Hyperion Academy',
      year_or_role: 'Year 3'
    }
  });

  await api('/life-profile/subjects', {
    method: 'POST',
    token,
    data: {
      subjects: [
        { subject_name: 'Advanced Calculus', category: 'STEM', difficulty: 'Hard', weekly_goal_hours: 6 },
        { subject_name: 'Algorithms & Data Structures', category: 'STEM', difficulty: 'Challenging', weekly_goal_hours: 8 }
      ]
    }
  });

  await api('/life-profile/interests', {
    method: 'POST',
    token,
    data: {
      interests: [
        { activity_name: 'Indie Game Development', category: 'CREATIVE', current_level: 'Intermediate', weekly_time_goal: '4 hrs/wk' },
        { activity_name: 'Calisthenics & Cardio', category: 'PHYSICAL', current_level: 'Advanced', weekly_time_goal: '5 hrs/wk' }
      ]
    }
  });

  await api('/life-profile/schedule', {
    method: 'POST',
    token,
    data: {
      blocks: [
        { activity_name: 'Morning Deep Math', start_time: '08:00', end_time: '09:30', days_of_week: 'Mon,Tue,Wed,Thu,Fri', focus_type: 'intellect' }
      ]
    }
  });
  console.log('✓ Life Profile fully populated.');

  // 5. Fetch Daily Challenge (tailored to player\'s life subjects/interests)
  console.log('5. Testing Daily Challenge Generation...');
  const dcRes = await api('/quests/daily-challenge', { token });
  assert.strictEqual(dcRes.status, 200);
  assert(dcRes.data.title, 'Daily challenge must have a title');
  assert(dcRes.data.tasks.length > 0, 'Daily challenge must have tasks');
  console.log(`✓ Daily Challenge received: "${dcRes.data.title}" with ${dcRes.data.tasks.length} tasks.`);

  // 6. Create Quest 1 (Calculus Practice)
  console.log('6. Testing Quest 1 Creation (Calculus)...');
  const q1Res = await api('/quests', {
    method: 'POST',
    token,
    data: {
      title: 'Advanced Calculus - Multivariable Derivatives',
      category: 'STUDY',
      duration_minutes: 45,
      difficulty: 'normal'
    }
  });
  assert.strictEqual(q1Res.status, 201);
  const q1 = q1Res.data;
  assert.strictEqual(q1.attribute, 'intellect');
  assert.strictEqual(q1.xp_reward, 59);
  assert.strictEqual(q1.gold_reward, 23);
  console.log(`✓ Quest 1 created: "${q1.title}" (${q1.xp_reward} XP, ${q1.gold_reward} Gold).`);

  // 7. Create Quest 2 (Algorithms Coding)
  console.log('7. Testing Quest 2 Creation (Algorithms)...');
  const q2Res = await api('/quests', {
    method: 'POST',
    token,
    data: {
      title: 'Algorithms - Dynamic Programming Grid Traversals',
      category: 'WORK',
      duration_minutes: 60,
      difficulty: 'challenging'
    }
  });
  assert.strictEqual(q2Res.status, 201);
  const q2 = q2Res.data;
  assert.strictEqual(q2.xp_reward, 126);
  console.log(`✓ Quest 2 created: "${q2.title}" (${q2.xp_reward} XP).`);

  // 8. Quest Lifecycle: Start & Pause
  console.log('8. Testing Quest Lifecycle: Start & Pause...');
  await api(`/quests/${q1.id}/start`, { method: 'POST', token });
  await api(`/quests/${q1.id}/pause`, { method: 'POST', token, data: { elapsed_seconds: 1200 } });
  console.log('✓ Quest 1 started and paused at 1200s.');

  // 9. Complete Quest 1
  console.log('9. Testing Quest 1 Completion...');
  const comp1Res = await api(`/quests/${q1.id}/complete`, { 
    method: 'POST', 
    token,
    headers: { 'x-test-fast-forward-seconds': '3600' }
  });
  assert.strictEqual(comp1Res.status, 200);
  assert.strictEqual(comp1Res.data.quest.status, 'completed');
  assert.strictEqual(comp1Res.data.rewards.xp, 59);
  console.log('✓ Quest 1 completed. Stats updated.');

  // 10. Complete Quest 2 -> Triggers Perfect Day!
  console.log('10. Testing Quest 2 Completion & Perfect Day Trigger...');
  await api(`/quests/${q2.id}/start`, { method: 'POST', token });
  const comp2Res = await api(`/quests/${q2.id}/complete`, { 
    method: 'POST', 
    token,
    headers: { 'x-test-fast-forward-seconds': '4500' }
  });
  assert.strictEqual(comp2Res.status, 200);
  assert(comp2Res.data.is_perfect_day === true, 'Completing all quests should trigger Perfect Day');
  console.log('✓ Quest 2 completed. Perfect Day bonus activated (+75 XP, +10 Gems)!');

  // 11. Complete Daily Challenge
  console.log('11. Testing Daily Challenge Completion...');
  const dcCompRes = await api(`/quests/daily-challenge/${dcRes.data.id}/complete`, { method: 'POST', token });
  assert.strictEqual(dcCompRes.status, 200);
  assert.strictEqual(dcCompRes.data.challenge.status, 'completed');
  console.log('✓ Daily Challenge completed and bounty awarded.');

  // 12. Verify Today\'s Board Summary
  console.log('12. Verifying Today\'s Quests Board Summary...');
  const todayRes = await api('/quests/today', { token });
  const summary = todayRes.data.summary;
  assert.strictEqual(summary.total_quests, 2);
  assert.strictEqual(summary.completed_quests, 2);
  assert.strictEqual(summary.is_perfect_day, true);
  console.log(`✓ Board summary verified: ${summary.completed_quests}/${summary.total_quests} completed. Perfect Day = ${summary.is_perfect_day}.`);

  console.log('\n====================================================');
  console.log('🎉 ALL PHASE 5A E2E INTEGRATION TESTS PASSED 100%! 🎉');
  console.log('====================================================');
}

runE2ETest().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
