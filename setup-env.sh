#!/bin/bash
# Setup script for SophiAI environment variables

echo "🔧 SophiAI Environment Setup"
echo "============================"
echo ""

# Check if API key already exists
if [ -f ".env.local" ]; then
    if grep -q "GEMINI_API_KEY" .env.local && ! grep -q "YOUR_API_KEY_HERE" .env.local; then
        existing_key=$(grep "GEMINI_API_KEY" .env.local | cut -d'=' -f2 | tr -d ' ')
        if [ ! -z "$existing_key" ]; then
            echo "✅ API key already configured in .env.local"
            echo "Key length: ${#existing_key} characters"
            echo ""
            read -p "Do you want to update it? (y/n): " update_choice
            if [ "$update_choice" != "y" ] && [ "$update_choice" != "Y" ]; then
                echo "Keeping existing API key."
                exit 0
            fi
        fi
    fi
fi

echo ""
echo "📝 Setting up API key..."
echo ""
echo "1. I've opened https://aistudio.google.com/app/apikey in your browser"
echo "2. Sign in with your Google account"
echo "3. Click 'Create API Key' or copy an existing key"
echo "4. Paste it below"
echo ""

read -p "Enter your Gemini API key: " api_key

# Clean the input (remove quotes, whitespace)
api_key=$(echo "$api_key" | sed "s/^['\"]//; s/['\"]$//" | tr -d ' ')

if [ -z "$api_key" ] || [ "$api_key" = "YOUR_API_KEY_HERE" ]; then
    echo "❌ Invalid API key. Exiting."
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Gemini API Key
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=$api_key
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo "✅ API key saved (${#api_key} characters)"
echo ""
echo "🔄 Now restart your dev server:"
echo "   1. Stop the current server (Ctrl+C if running)"
echo "   2. Run: npm run dev"
echo ""
