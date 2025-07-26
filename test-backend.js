#!/usr/bin/env node

const fetch = require('node-fetch').default || require('node-fetch');

async function testBackend() {
  const baseUrl = 'http://localhost:3000';

  console.log('Testing Spotify Personality App Backend\n');

  console.log('1. Testing health endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const health = await response.json();

    console.log(`   Status: ${health.status}`);
    console.log(
      `   Spotify: ${health.services.spotify ? 'working' : 'failing'}`
    );
    console.log(`   OpenAI: ${health.services.openai ? 'working' : 'failing'}`);

    if (!health.services.spotify || !health.services.openai) {
      console.log('   Some services are not configured properly');
    }
  } catch (error) {
    console.log('   Health check failed:', error.message);
    console.log('   Make sure the server is running with: npm run dev');
    return;
  }

  console.log('\n2. Testing genres endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/genres`);
    const { genres } = await response.json();
    console.log(`   Found ${genres.length} available genres`);
    console.log(`   Sample genres: ${genres.slice(0, 5).join(', ')}`);
  } catch (error) {
    console.log('   Genres test failed:', error.message);
  }

  console.log('\n3. Testing personality analysis with mock data...');
  try {
    const mockAnswers = {
      'social-energy': 'Hosting a big party with lots of friends',
      'decision-making': 75,
      'adventure-level': 'Skydiving or bungee jumping',
      'work-style': 'Busy Open Office',
      'stress-response': 'Talking it out with friends or family',
      'creativity-level': 80,
    };

    const response = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: mockAnswers }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`   Analysis successful!`);
      console.log(`   Personality Type: ${result.personalityAnalysis.type}`);
      console.log(`   Songs Found: ${result.songs.length}`);
      console.log(
        `   Sample Song: ${result.songs[0]?.title} by ${result.songs[0]?.artist}`
      );
    } else {
      const error = await response.json();
      console.log(`   Analysis failed:`, error.error);
    }
  } catch (error) {
    console.log('   Analysis test failed:', error.message);
  }

  console.log('\n🎉 Backend testing complete!');
  console.log('\nIf all tests passed, your backend is ready to use.');
  console.log('Visit http://localhost:3000 to try the full application.');
}

testBackend().catch(console.error);
