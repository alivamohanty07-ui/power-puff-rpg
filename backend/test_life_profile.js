const assert = require('assert');
const http = require('http');
const app = require('./src/app');

const PORT = 8003;
const BASE_URL = `http://localhost:${PORT}`;

let server;

function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(PORT, () => {
      resolve();
    });
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
  console.log('--- STARTING POWER PUFF RPG LIFE PROFILE TEST SUITE ---');
  await startServer();

  try {
    const timestamp = Date.now();
    const userAEmail = `hero_life_a_${timestamp}@academy.rpg`;
    const userBEmail = `hero_life_b_${timestamp}@academy.rpg`;
    const testPassword = 'SecretPassword123!';

    // 1. Register User A
    const regResA = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `HeroLifeA_${timestamp}`,
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

    // 2. Unauthenticated access rejected with 401
    const unauthRes = await fetch(`${BASE_URL}/api/life-profile`);
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated life profile access must return 401');
    console.log('✓ Unauthenticated request rejected (401)');

    // 3. Initial Life Profile is empty
    const initRes = await fetch(`${BASE_URL}/api/life-profile`, { headers: headersA });
    assert.strictEqual(initRes.status, 200);
    const initData = await initRes.json();
    assert.strictEqual(initData.completed_step, 0);
    assert.strictEqual(initData.is_completed, false);
    assert.deepStrictEqual(initData.subjects, []);
    console.log('✓ Initial Life Profile empty (completed_step: 0)');

    // 4. Chapter 1: Save Path
    const pathRes = await fetch(`${BASE_URL}/api/life-profile/path`, {
      method: 'PUT',
      headers: headersA,
      body: JSON.stringify({ path_type: 'college_student' })
    });
    assert.strictEqual(pathRes.status, 200);
    const pathData = await pathRes.json();
    assert.strictEqual(pathData.profile.path.path_type, 'college_student');
    assert.strictEqual(pathData.profile.completed_step, 1);
    console.log('✓ Chapter 1 (Path) saved successfully: college_student');

    // 5. Chapter 2: Save Education & Subjects
    const eduRes = await fetch(`${BASE_URL}/api/life-profile/education`, {
      method: 'PUT',
      headers: headersA,
      body: JSON.stringify({
        education_data: {
          program: 'B.Tech',
          major: 'Computer Science',
          year: '3rd Year'
        },
        subjects: ['Data Structures', 'Operating Systems']
      })
    });
    assert.strictEqual(eduRes.status, 200);
    const eduData = await eduRes.json();
    assert.strictEqual(eduData.profile.education.program, 'B.Tech');
    assert.strictEqual(eduData.profile.subjects.length, 2);
    assert.strictEqual(eduData.profile.completed_step, 2);
    console.log('✓ Chapter 2 (Education & Subjects) saved successfully');

    // 6. Subjects CRUD
    const addSubRes = await fetch(`${BASE_URL}/api/life-profile/subjects`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({ subject_name: 'Computer Networks' })
    });
    assert.strictEqual(addSubRes.status, 201);
    const newSubject = await addSubRes.json();
    assert.strictEqual(newSubject.subject_name, 'Computer Networks');

    const updateSubRes = await fetch(`${BASE_URL}/api/life-profile/subjects/${newSubject.id}`, {
      method: 'PUT',
      headers: headersA,
      body: JSON.stringify({ subject_name: 'Advanced Networks' })
    });
    assert.strictEqual(updateSubRes.status, 200);
    const updatedSubject = await updateSubRes.json();
    assert.strictEqual(updatedSubject.subject_name, 'Advanced Networks');

    const delSubRes = await fetch(`${BASE_URL}/api/life-profile/subjects/${newSubject.id}`, {
      method: 'DELETE',
      headers: headersA
    });
    assert.strictEqual(delSubRes.status, 200);
    console.log('✓ Subjects CRUD endpoints verified');

    // 7. Chapter 3: Interests CRUD
    const addInterestRes = await fetch(`${BASE_URL}/api/life-profile/interests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        activity_name: 'Coding',
        category: 'TECHNOLOGY',
        frequency: 'daily',
        approximate_duration: '2_plus_hours'
      })
    });
    assert.strictEqual(addInterestRes.status, 201);
    const newInterest = await addInterestRes.json();
    assert.strictEqual(newInterest.activity_name, 'Coding');
    assert.strictEqual(newInterest.category, 'TECHNOLOGY');

    const addInterest2Res = await fetch(`${BASE_URL}/api/life-profile/interests`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        activity_name: 'Gym',
        category: 'FITNESS & SPORTS',
        frequency: 'several_times_a_week',
        approximate_duration: '1_hour'
      })
    });
    assert.strictEqual(addInterest2Res.status, 201);

    const getInterestsRes = await fetch(`${BASE_URL}/api/life-profile/interests`, { headers: headersA });
    assert.strictEqual(getInterestsRes.status, 200);
    const interestsList = await getInterestsRes.json();
    assert.strictEqual(interestsList.length, 2);
    console.log('✓ Chapter 3 (Interests) CRUD verified');

    // 8. Chapter 4: Schedule CRUD
    const addScheduleRes = await fetch(`${BASE_URL}/api/life-profile/schedule`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        activity_name: 'Morning Focus & Meditation',
        category: 'personal_time',
        start_time: '07:00',
        end_time: '08:00',
        sort_order: 1
      })
    });
    assert.strictEqual(addScheduleRes.status, 201);
    const newSchedule = await addScheduleRes.json();
    assert.strictEqual(newSchedule.activity_name, 'Morning Focus & Meditation');

    const addSchedule2Res = await fetch(`${BASE_URL}/api/life-profile/schedule`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        activity_name: 'University Classes',
        category: 'college',
        start_time: '09:00',
        end_time: '15:00',
        sort_order: 2
      })
    });
    assert.strictEqual(addSchedule2Res.status, 201);
    console.log('✓ Chapter 4 (Schedule) CRUD verified');

    // 9. Complete Life Profile
    const completeRes = await fetch(`${BASE_URL}/api/life-profile/complete`, {
      method: 'POST',
      headers: headersA
    });
    assert.strictEqual(completeRes.status, 200);
    const completeData = await completeRes.json();
    assert.strictEqual(completeData.profile.is_completed, true);
    assert.strictEqual(completeData.profile.completed_step, 4);
    console.log('✓ Complete Life Profile ceremony finished (is_completed: true)');

    // 10. Multi-User Isolation
    const regResB = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `HeroLifeB_${timestamp}`,
        email: userBEmail,
        password: testPassword
      })
    });
    assert.strictEqual(regResB.status, 201);
    const regDataB = await regResB.json();
    const headersB = {
      'Authorization': `Bearer ${regDataB.access_token}`,
      'Content-Type': 'application/json'
    };

    // User B profile is untouched
    const bProfileRes = await fetch(`${BASE_URL}/api/life-profile`, { headers: headersB });
    const bProfile = await bProfileRes.json();
    assert.strictEqual(bProfile.completed_step, 0);
    assert.strictEqual(bProfile.is_completed, false);
    assert.deepStrictEqual(bProfile.subjects, []);
    assert.deepStrictEqual(bProfile.interests, []);
    assert.deepStrictEqual(bProfile.schedule, []);

    // User B cannot delete User A's interest
    const delOtherInterestRes = await fetch(`${BASE_URL}/api/life-profile/interests/${newInterest.id}`, {
      method: 'DELETE',
      headers: headersB
    });
    assert.strictEqual(delOtherInterestRes.status, 404, 'User B must not be able to delete User A interest');

    console.log('✓ Multi-user isolation verified (User B isolated from User A data)');

    // 11. Profile recovery / Reload check
    const reloadRes = await fetch(`${BASE_URL}/api/life-profile`, { headers: headersA });
    const reloadData = await reloadRes.json();
    assert.strictEqual(reloadData.is_completed, true);
    assert.strictEqual(reloadData.path.path_type, 'college_student');
    assert.strictEqual(reloadData.subjects.length, 2);
    assert.strictEqual(reloadData.interests.length, 2);
    assert.strictEqual(reloadData.schedule.length, 2);
    console.log('✓ Progressive recovery / reload verification passed');

    console.log('\n====================================================');
    console.log('🎉 ALL LIFE PROFILE TESTS PASSED CLEANLY!');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ LIFE PROFILE TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    await stopServer();
  }
}

runTests();
