const assert = require('assert');
const app = require('./src/app');

const PORT = 8001; // Use separate port for tests
let server;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('--- STARTING POWER PUFF RPG BACKEND AUTH TEST SUITE ---');

  server = app.listen(PORT);

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(healthRes.status, 200, 'Health check should return 200');
    const healthData = await healthRes.json();
    assert.strictEqual(healthData.status, 'healthy');
    console.log('✓ Health check passed:', healthData);

    // 2. Validation: Short password
    const shortPwdRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'HeroOne',
        email: 'short@academy.rpg',
        password: '123'
      })
    });
    assert.strictEqual(shortPwdRes.status, 400, 'Short password must be rejected');
    console.log('✓ Short password rejection (400) passed');

    // 3. Validation: Password mismatch
    const mismatchRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'HeroMismatch',
        email: 'mismatch@academy.rpg',
        password: 'SecretPassword123!',
        confirm_password: 'WrongPassword456!'
      })
    });
    assert.strictEqual(mismatchRes.status, 400, 'Password mismatch must be rejected');
    console.log('✓ Password mismatch rejection (400) passed');

    // 4. Successful Registration via POST /api/auth/register
    const testEmail = `test_hero_${Date.now()}@academy.rpg`;
    const testName = `Hero_${Date.now()}`;
    const testPassword = 'PowerPassword2026!';

    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
        confirm_password: testPassword
      })
    });
    const regText = await regRes.text();
    assert.strictEqual(regRes.status, 201, `Registration failed: ${regText}`);
    const regData = JSON.parse(regText);
    assert(regData.access_token, 'Response must contain access_token');
    assert.strictEqual(regData.token_type, 'bearer');
    assert(regData.user, 'Response must contain user');
    assert.strictEqual(regData.user.name, testName);
    assert.strictEqual(regData.user.email, testEmail);
    assert.strictEqual(regData.user.password, undefined, 'Password must NEVER be returned');
    assert.strictEqual(regData.user.password_hash, undefined, 'Password hash must NEVER be returned');
    assert.strictEqual(regData.user.hashed_password, undefined, 'Hashed password must NEVER be returned');
    assert.strictEqual(regData.user.has_completed_induction, false);
    assert.strictEqual(regData.user.level, 1);
    assert.strictEqual(regData.user.gold, 100);
    const token = regData.access_token;
    console.log(`✓ Registration passed. User ID: ${regData.user.id}, Hero: ${regData.user.name}`);

    // 5. Duplicate Email Registration Rejection
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'AnotherHero',
        email: testEmail,
        password: testPassword
      })
    });
    assert.strictEqual(dupRes.status, 400, 'Duplicate email must be rejected with 400');
    console.log('✓ Duplicate email registration rejection (400) passed');

    // 6. Registration via POST /api/auth/signup alias
    const signupAliasEmail = `signup_alias_${Date.now()}@academy.rpg`;
    const signupAliasName = `AliasHero_${Date.now()}`;
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: signupAliasName,
        email: signupAliasEmail,
        password: testPassword
      })
    });
    assert.strictEqual(signupRes.status, 201, 'Signup alias must succeed with 201');
    console.log('✓ /api/auth/signup alias passed');

    // 7. Login with Wrong Password
    const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'IncorrectPassword!'
      })
    });
    assert.strictEqual(badLoginRes.status, 401, 'Wrong password must return 401');
    console.log('✓ Bad password rejection (401) passed');

    // 8. Login with Non-existent Email
    const fakeLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ghost@doesnotexist.rpg',
        password: testPassword
      })
    });
    assert.strictEqual(fakeLoginRes.status, 401, 'Unknown account must return 401');
    console.log('✓ Unknown account rejection (401) passed');

    // 9. Successful Login with Email
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    assert.strictEqual(loginRes.status, 200, 'Login with email must succeed');
    const loginData = await loginRes.json();
    assert(loginData.access_token, 'Login must return access_token');
    assert.strictEqual(loginData.user.email, testEmail);
    console.log('✓ Login with email passed');

    // 10. Successful Login with Username / Hero Name
    const loginUserRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username_or_email: testName,
        password: testPassword
      })
    });
    assert.strictEqual(loginUserRes.status, 200, 'Login with username must succeed');
    console.log('✓ Login with hero name / username passed');

    // 11. Protected Endpoint: GET /api/auth/me with Bearer token
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
    assert.strictEqual(meRes.status, 200, 'GET /api/auth/me must return 200');
    const meData = await meRes.json();
    assert.strictEqual(meData.email, testEmail);
    assert.strictEqual(meData.has_completed_induction, false);
    console.log('✓ Protected GET /api/auth/me passed:', meData.name);

    // 12. Unauthenticated Access Rejected: GET /api/auth/me without token
    const unauthRes = await fetch(`${BASE_URL}/api/auth/me`);
    assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request must return 401');
    console.log('✓ Unauthenticated request rejection (401) passed');

    // 13. Invalid Token Rejected
    const badTokenRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid_fake_token_xyz' }
    });
    assert.strictEqual(badTokenRes.status, 401, 'Invalid token must return 401');
    console.log('✓ Invalid token rejection (401) passed');

    // 14. Phase 2: Check House Status Before Selection: GET /api/users/me/house
    const preHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, { headers: authHeaders });
    assert.strictEqual(preHouseRes.status, 200, 'GET /api/users/me/house must return 200');
    const preHouseData = await preHouseRes.json();
    assert.strictEqual(preHouseData.completed, false);
    assert.strictEqual(preHouseData.houseId, null);
    console.log('✓ Initial GET /api/users/me/house returned completed: false');

    // 15. Phase 2: Reject Invalid House Identifier (e.g. 'gryffindor')
    const invalidHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ houseId: 'gryffindor' })
    });
    assert.strictEqual(invalidHouseRes.status, 400, 'Invalid house ID must be rejected with 400');
    console.log('✓ Invalid house ID rejection (400) passed');

    // 16. Phase 2: Reject Unauthenticated House Selection
    const unauthHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ houseId: 'blossom' })
    });
    assert.strictEqual(unauthHouseRes.status, 401, 'Unauthenticated house save must return 401');
    console.log('✓ Unauthenticated house save rejection (401) passed');

    // 17. Phase 2: Save House Selection via POST /api/users/me/house
    const saveHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ houseId: 'blossom' })
    });
    assert.strictEqual(saveHouseRes.status, 200, 'POST /api/users/me/house must return 200');
    const saveHouseData = await saveHouseRes.json();
    assert.strictEqual(saveHouseData.houseId, 'blossom');
    assert.strictEqual(saveHouseData.houseName, 'House Blossom');
    assert.strictEqual(saveHouseData.hasCompletedInduction, true);
    assert(saveHouseData.selectedAt, 'Must include selectedAt timestamp');
    console.log('✓ POST /api/users/me/house passed (blossom saved, hasCompletedInduction: true)');

    // 18. Phase 2: Retrieve Saved House via GET /api/users/me/house
    const getHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, { headers: authHeaders });
    assert.strictEqual(getHouseRes.status, 200);
    const getHouseData = await getHouseRes.json();
    assert.strictEqual(getHouseData.completed, true);
    assert.strictEqual(getHouseData.houseId, 'blossom');
    assert.strictEqual(getHouseData.houseName, 'House Blossom');
    console.log('✓ GET /api/users/me/house retrieved saved house (House Blossom)');

    // 19. Phase 2: Multi-User Isolation (User B cannot see or overwrite User A's house)
    const bTimestamp = Date.now();
    const userBEmail = `hero_b_${bTimestamp}@academy.rpg`;
    const userBRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `HeroBeta_${bTimestamp}`,
        email: userBEmail,
        password: testPassword
      })
    });
    assert.strictEqual(userBRes.status, 201, 'User B registration must return 201');
    const userBData = await userBRes.json();
    const userBHeaders = { 'Authorization': `Bearer ${userBData.access_token}` };

    // User B initially has completed: false
    const userBHouseRes = await fetch(`${BASE_URL}/api/users/me/house`, { headers: userBHeaders });
    const userBHouseData = await userBHouseRes.json();
    assert.strictEqual(userBHouseData.completed, false);

    // Save User B house to 'bubbles'
    const saveUserBRes = await fetch(`${BASE_URL}/api/users/me/house`, {
      method: 'POST',
      headers: { ...userBHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ houseId: 'bubbles' })
    });
    const saveUserBData = await saveUserBRes.json();
    assert.strictEqual(saveUserBData.houseId, 'bubbles');

    // Verify User A is STILL 'blossom'
    const checkUserARes = await fetch(`${BASE_URL}/api/users/me/house`, { headers: authHeaders });
    const checkUserAData = await checkUserARes.json();
    assert.strictEqual(checkUserAData.houseId, 'blossom');
    console.log('✓ Multi-user house isolation passed (User A = Blossom, User B = Bubbles)');

    // 15. Avatar Customization Sync: PATCH /api/auth/avatar
    const avatarConfig = {
      base: 'female',
      name: 'Elysia Silver',
      skinTone: 'porcelain',
      hairstyle: 'twin-tails',
      hairColor: 'pastel-rose',
      outfit: 'academy-uniform'
    };
    const avatarRes = await fetch(`${BASE_URL}/api/auth/avatar`, {
      method: 'PATCH',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avatar_data: avatarConfig,
        name: 'Elysia Silver'
      })
    });
    assert.strictEqual(avatarRes.status, 200, 'PATCH /api/auth/avatar must return 200');
    const avatarData = await avatarRes.json();
    assert.strictEqual(avatarData.name, 'Elysia Silver');
    assert(avatarData.avatar_config.includes('twin-tails'), 'Avatar config must be saved');
    console.log('✓ Avatar sync passed (name updated, avatar_config persisted)');

    // 16. Verify Profile Retains All Progress
    const verifyRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.name, 'Elysia Silver');
    assert.strictEqual(verifyData.personality_house, 'House Blossom');
    assert.strictEqual(verifyData.has_completed_induction, true);
    assert(verifyData.avatar_config.includes('twin-tails'));
    console.log('✓ Final profile retains House, Avatar, and Induction state');

    // 17. Logout: POST /api/auth/logout
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST' });
    assert.strictEqual(logoutRes.status, 200, 'Logout must return 200');
    console.log('✓ Logout endpoint passed');

    console.log('\n====================================================');
    console.log('🎉 ALL 17 POWER PUFF RPG BACKEND TESTS PASSED CLEANLY!');
    console.log('====================================================\n');
  } finally {
    if (server) server.close();
  }
}

runTests().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  if (server) server.close();
  process.exit(1);
});
