#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env.local');

console.log('\n🔧 SophiAI API Key Setup');
console.log('========================\n');

// Check if .env.local already exists with a valid key
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/GEMINI_API_KEY=(.+)/);
  if (match && match[1] && !match[1].includes('YOUR_API_KEY_HERE')) {
    const existingKey = match[1].trim();
    console.log(`✅ Found existing API key (${existingKey.length} characters)`);
    rl.question('\nDo you want to update it? (y/n): ', (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log('Keeping existing API key.');
        rl.close();
        return;
      }
      promptForKey();
    });
  } else {
    promptForKey();
  }
} else {
  promptForKey();
}

function promptForKey() {
  console.log('\n📝 Instructions:');
  console.log('1. A browser window should be open to: https://aistudio.google.com/app/apikey');
  console.log('2. Sign in with your Google account');
  console.log('3. Click "Create API Key" (or use an existing one)');
  console.log('4. Copy the API key and paste it below\n');
  
  rl.question('Enter your Gemini API key: ', (apiKey) => {
    // Clean the key
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 20) {
      console.log('\n❌ Invalid API key. Please try again.');
      rl.close();
      process.exit(1);
    }
    
    // Create .env.local file
    const content = `# Gemini API Key
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=${apiKey}
`;
    
    fs.writeFileSync(envPath, content);
    console.log(`\n✅ Success! API key saved to .env.local (${apiKey.length} characters)`);
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your dev server (stop with Ctrl+C, then run: npm run dev)');
    console.log('2. The chatbot should now work!\n');
    
    rl.close();
  });
}
