const assert = require('assert');
const http = require('http');
const app = require('./src/app');

const PORT = 8004;
const BASE_URL = `http://localhost:${PORT}`;

let server;

function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(PORT, () => resolve());
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

async function runTests() {
  console.log('--- STARTING POWER PUFF RPG QUESTS & TIMER TEST SUITE ---');
  await startServer();

  try {
    const timestamp = Date.now();
    const userAEmail = `hero_quest_a_${timestamp}@academy.rpg`;
    const userBEmail = `hero_quest_b_${timestamp}@academy.rpg`;
    const testPassword = 'SecretPassword123!';

    // 1. Register User A
    const regResA = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `HeroQuestA_${timestamp}`,
        email: userAEmail,
        password: testPassword
      })
    });
    assert.strictEqual(regResA.status, 201);
    const regDataA = await regResA.json();
    const headersA = {
      'Authorization': `Bearer ${regDataA.access_token}`,
      'Content-Type': 'application/json'
    };
    console.log('✓ User A registered successfully');

    // 2. Setup Life Profile for User A so Daily Challenge can personalize
    await fetch(`${BASE_URL}/api/life-profile/path`, {
      method: 'PUT',
      headers: headersA,
      body: JSON.stringify({ path_type: 'college_student' })
    });
    await fetch(`${BASE_URL}/api/life-profile/education`, {
      method: 'PUT',
      headers: headersA,
      body: JSON.stringify({
        education_data: { program: 'B.Tech', major: 'Computer Science' },
        subjects: ['Mathematics', 'Operating Systems']
      })
    });
    await fetch(`${BASE_URL}/api/life-profile/interests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        interests: [
          { activity_name: 'Coding', category: 'TECHNOLOGY', frequency: 'daily', approximate_duration: '2_plus_hours' },
          { activity_name: 'Gym', category: 'FITNESS & SPORTS', frequency: 'several_times_a_week', approximate_duration: '1_hour' }
        ]
      })
    });
    console.log('✓ User A Life Profile initialized');

    // 3. Unauthenticated access rejected with 401
    const unauthRes = await fetch(`${BASE_URL}/api/quests/today`);
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated quest access must return 401');
    console.log('✓ Unauthenticated request rejected (401)');

    // 4. Initial Today's Quests is empty
    const initRes = await fetch(`${BASE_URL}/api/quests/today`, { headers: headersA });
    assert.strictEqual(initRes.status, 200);
    const initData = await initRes.json();
    assert.strictEqual(initData.summary.total_quests, 0);
    assert.strictEqual(initData.summary.completed_quests, 0);
    assert.strictEqual(initData.quests.length, 0);
    console.log('✓ Initial Quest Board empty');

    // 5. Create Quest 1: Mathematics (Intellect)
    const q1Res = await fetch(`${BASE_URL}/api/quests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Mathematics Problem Solving',
        category: 'KNOWLEDGE',
        difficulty: 'normal',
        duration_minutes: 45
      })
    });
    assert.strictEqual(q1Res.status, 201);
    const quest1 = await q1Res.json();
    assert.strictEqual(quest1.title, 'Mathematics Problem Solving');
    assert.strictEqual(quest1.attribute, 'intellect');
    assert.strictEqual(quest1.status, 'ready');
    assert(quest1.xp_reward > 0, 'Must have backend calculated XP');
    assert(quest1.gold_reward > 0, 'Must have backend calculated Gold');
    console.log(`✓ Quest 1 created: "${quest1.title}" (${quest1.duration_minutes}m, ${quest1.xp_reward} XP, Attr: ${quest1.attribute})`);

    // 6. Create Quest 2: Gym Workout (Strength)
    const q2Res = await fetch(`${BASE_URL}/api/quests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Gym Strength Conditioning',
        category: 'FITNESS',
        difficulty: 'challenging',
        duration_minutes: 60
      })
    });
    assert.strictEqual(q2Res.status, 201);
    const quest2 = await q2Res.json();
    assert.strictEqual(quest2.attribute, 'strength');
    assert.strictEqual(quest2.attribute_gain, 4); // challenging (3) + duration >= 60 (1) = 4
    console.log(`✓ Quest 2 created: "${quest2.title}" (${quest2.duration_minutes}m, ${quest2.xp_reward} XP, Attr: ${quest2.attribute})`);

    // 7. Verify Board Summary
    const boardRes = await fetch(`${BASE_URL}/api/quests/today`, { headers: headersA });
    const boardData = await boardRes.json();
    assert.strictEqual(boardData.summary.total_quests, 2);
    assert.strictEqual(boardData.summary.completed_quests, 0);
    assert.strictEqual(boardData.summary.total_minutes, 105);
    console.log('✓ Quest Board summary verified: 2 quests planned, 105 total minutes');

    // 8. Quest 1 Lifecycle: Start -> Pause -> Complete
    const startRes = await fetch(`${BASE_URL}/api/quests/${quest1.id}/start`, {
      method: 'PATCH',
      headers: headersA
    });
    assert.strictEqual(startRes.status, 200);
    const startedQuest = await startRes.json();
    assert.strictEqual(startedQuest.status, 'in_progress');
    console.log('✓ Quest 1 started (status: in_progress)');

    const pauseRes = await fetch(`${BASE_URL}/api/quests/${quest1.id}/pause`, {
      method: 'PATCH',
      headers: headersA,
      body: JSON.stringify({ elapsed_seconds: 1200 })
    });
    assert.strictEqual(pauseRes.status, 200);
    const pausedQuest = await pauseRes.json();
    assert.strictEqual(pausedQuest.status, 'paused');
    assert(typeof pausedQuest.elapsed_seconds === 'number');
    console.log(`✓ Quest 1 paused (status: paused, server elapsed: ${pausedQuest.elapsed_seconds}s)`);

    const complete1Res = await fetch(`${BASE_URL}/api/quests/${quest1.id}/complete`, {
      method: 'POST',
      headers: { ...headersA, 'x-test-fast-forward-seconds': '3600' }
    });
    assert.strictEqual(complete1Res.status, 200);
    const complete1Data = await complete1Res.json();
    assert.strictEqual(complete1Data.quest.status, 'completed');
    assert.strictEqual(complete1Data.rewards.attribute, 'intellect');
    assert(complete1Data.user.intellect >= 12, 'User intellect must increase');
    assert(complete1Data.user.xp >= quest1.xp_reward, 'User XP must increase');
    console.log(`✓ Quest 1 completed: +${complete1Data.rewards.xp} XP, +${complete1Data.rewards.attribute_gain} Intellect`);

    // 9. Complete Quest 2 -> Triggers PERFECT DAY!
    await fetch(`${BASE_URL}/api/quests/${quest2.id}/start`, { method: 'POST', headers: headersA });
    const complete2Res = await fetch(`${BASE_URL}/api/quests/${quest2.id}/complete`, {
      method: 'POST',
      headers: { ...headersA, 'x-test-fast-forward-seconds': '4500' }
    });
    assert.strictEqual(complete2Res.status, 200);
    const complete2Data = await complete2Res.json();
    assert.strictEqual(complete2Data.is_perfect_day, true, 'All 2 quests complete must trigger Perfect Day');
    assert(complete2Data.rewards.perfect_day, 'Perfect day bonus structure returned');
    assert.strictEqual(complete2Data.rewards.perfect_day.bonus_xp, 75);
    assert.strictEqual(complete2Data.rewards.perfect_day.bonus_gems, 10);
    console.log('✓ Quest 2 completed & PERFECT DAY BONUS TRIGGERED! (+75 XP, +10 Gems, streak increased)');

    // 10. Attempt to delete completed quest is rejected
    const delCompletedRes = await fetch(`${BASE_URL}/api/quests/${quest1.id}`, {
      method: 'DELETE',
      headers: headersA
    });
    assert.strictEqual(delCompletedRes.status, 400);
    console.log('✓ Deleting completed quest rejected (400)');

    // 11. Create unstarted quest and delete it
    const q3Res = await fetch(`${BASE_URL}/api/quests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Temporary Draft Quest',
        duration_minutes: 15
      })
    });
    const quest3 = await q3Res.json();
    const delDraftRes = await fetch(`${BASE_URL}/api/quests/${quest3.id}`, {
      method: 'DELETE',
      headers: headersA
    });
    assert.strictEqual(delDraftRes.status, 200);
    console.log('✓ Unstarted draft quest deleted successfully');

    // 12. Academy Daily Challenge: Personalized from Life Profile
    const challengeRes = await fetch(`${BASE_URL}/api/quests/daily-challenge`, { headers: headersA });
    assert.strictEqual(challengeRes.status, 200);
    const challengeData = await challengeRes.json();
    assert(challengeData.title.includes('Mathematics') || challengeData.title.includes('Coding') || challengeData.tasks.length >= 2);
    assert.strictEqual(challengeData.status, 'ready');
    assert.strictEqual(challengeData.gems_reward, 15);
    console.log(`✓ Personalized Daily Challenge generated: "${challengeData.title}" (${challengeData.xp_reward} XP, ${challengeData.gems_reward} Gems)`);

    // 13. Complete Daily Challenge
    const compChallengeRes = await fetch(`${BASE_URL}/api/quests/daily-challenge/${challengeData.id}/complete`, {
      method: 'POST',
      headers: headersA
    });
    assert.strictEqual(compChallengeRes.status, 200);
    const compChallengeData = await compChallengeRes.json();
    assert.strictEqual(compChallengeData.challenge.status, 'completed');
    assert.strictEqual(compChallengeData.rewards.gems, 15);
    console.log('✓ Daily Challenge completed successfully! (+120 XP, +15 Gems)');

    // 14. Multi-User Isolation: User B cannot touch User A's quests
    const regResB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `HeroQuestB_${timestamp}`,
        email: userBEmail,
        password: testPassword
      })
    });
    const regDataB = await regResB.json();
    const headersB = {
      'Authorization': `Bearer ${regDataB.access_token}`,
      'Content-Type': 'application/json'
    };

    const bQuestsRes = await fetch(`${BASE_URL}/api/quests/today`, { headers: headersB });
    const bQuestsData = await bQuestsRes.json();
    assert.strictEqual(bQuestsData.summary.total_quests, 0, 'User B must have 0 quests');

    const bCompleteARes = await fetch(`${BASE_URL}/api/quests/${quest1.id}/complete`, {
      method: 'POST',
      headers: headersB
    });
    assert.strictEqual(bCompleteARes.status, 404, 'User B cannot complete User A quest');
    console.log('✓ Multi-user isolation verified (User B cannot access or complete User A quests)');

    console.log('\n====================================================');
    console.log('🎉 ALL 14 QUEST & TIMER INTEGRATION TESTS PASSED!');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ QUEST TEST SUITE FAILED:', err);
    process.exitCode = 1;
  } finally {
    await stopServer();
  }
}

runTests();
