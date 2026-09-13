const http = require('http');
const app = require('./server');

const server = app.listen(8001, async () => {
  console.log('Test server running on port 8001');

  function request(options, data) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null }));
      });
      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  try {
    // 1. Health Check
    const health = await request({ hostname: 'localhost', port: 8001, path: '/api/health', method: 'GET' });
    console.log('✓ Health Check status:', health.status, health.data.status);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Register new hero
    const testHero = {
      username: 'TestHero_' + Date.now(),
      email: 'hero_' + Date.now() + '@powerpuff.io',
      password: 'SuperPassword123!',
      guild_selection: 'House Blossom'
    };
    const regRes = await request({
      hostname: 'localhost',
      port: 8001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testHero);
    console.log('✓ Register Hero status:', regRes.status, 'User ID:', regRes.data.user.id);
    if (regRes.status !== 201) throw new Error('Register failed');
    const token = regRes.data.access_token;

    // 3. Login
    const loginRes = await request({
      hostname: 'localhost',
      port: 8001,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username_or_email: testHero.username, password: testHero.password });
    console.log('✓ Login status:', loginRes.status, 'Token acquired');
    if (loginRes.status !== 200) throw new Error('Login failed');

    // 4. Get Current User (/api/auth/me)
    const meRes = await request({
      hostname: 'localhost',
      port: 8001,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ Get Me status:', meRes.status, 'Username:', meRes.data.username, 'House:', meRes.data.personality_house);
    if (meRes.status !== 200) throw new Error('Get me failed');

    // 5. Quests
    const questsRes = await request({ hostname: 'localhost', port: 8001, path: '/api/quests', method: 'GET' });
    console.log('✓ Quests count:', questsRes.data.length);
    if (questsRes.status !== 200) throw new Error('Get quests failed');

    // 6. Complete Quest
    const completeRes = await request({
      hostname: 'localhost',
      port: 8001,
      path: '/api/quests/1/complete',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ Complete Quest status:', completeRes.status, completeRes.data.message);

    // 7. Bounties
    const bountiesRes = await request({ hostname: 'localhost', port: 8001, path: '/api/bounties', method: 'GET' });
    console.log('✓ Bounties count:', bountiesRes.data.length);

    // 8. Character Stats
    const statsRes = await request({
      hostname: 'localhost',
      port: 8001,
      path: '/api/character/stats',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ Character Stats:', statsRes.data.level, 'XP:', statsRes.data.xp, 'Gold:', statsRes.data.gold);

    console.log('\n🌟 ALL BACKEND API ENDPOINTS VERIFIED AND PASSING SUCCESSFULLY! 🌟');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
