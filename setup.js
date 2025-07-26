#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function setup() {
  console.log('🎵 Spotify Personality App Backend Setup\n');

  const envPath = path.join(__dirname, '.env.local');

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Backup will be created.');
    fs.copyFileSync(envPath, `${envPath}.backup`);
  }

  console.log('Please provide the following credentials:\n');

  const spotifyClientId = await question('Spotify Client ID: ');
  const spotifyClientSecret = await question('Spotify Client Secret: ');
  const openaiApiKey = await question('OpenAI API Key: ');
  const nextAuthSecret =
    (await question('NextAuth Secret (or press enter for random): ')) ||
    generateRandomSecret();

  const envContent = `# Spotify API Configuration
SPOTIFY_CLIENT_ID=${spotifyClientId}
SPOTIFY_CLIENT_SECRET=${spotifyClientSecret}

# OpenAI API Configuration
OPENAI_API_KEY=${openaiApiKey}

# Next.js Configuration
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Environment configuration saved to .env.local');
  console.log('\n🚀 Setup complete! You can now run:');
  console.log('   npm run dev');
  console.log('\n🔍 Test your setup by visiting:');
  console.log('   http://localhost:3000/api/health');

  rl.close();
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

setup().catch(console.error);
