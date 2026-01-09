#!/bin/bash
# Helper script to add GitHub Secret (requires GitHub CLI or manual steps)

echo "🔐 Adding GitHub Secret for SophiAI"
echo "===================================="
echo ""

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    echo ""
    echo "Adding secret..."
    gh secret set GEMINI_API_KEY --body "AIzaSyCDaBAfP2zefxS4x5JkEu6UbS5Koq3N4HE" --repo llomj/SophiAI
    echo ""
    echo "✅ Secret added!"
    echo ""
    echo "Now trigger a new build:"
    echo "  gh workflow run deploy.yml --repo llomj/SophiAI"
    echo ""
    gh workflow run deploy.yml --repo llomj/SophiAI
else
    echo "⚠️  GitHub CLI not installed"
    echo ""
    echo "Please do this manually:"
    echo ""
    echo "1. Go to: https://github.com/llomj/SophiAI/settings/secrets/actions"
    echo "2. Click 'New repository secret'"
    echo "3. Name: GEMINI_API_KEY"
    echo "4. Value: AIzaSyCDaBAfP2zefxS4x5JkEu6UbS5Koq3N4HE"
    echo "5. Click 'Add secret'"
    echo ""
    echo "Then trigger a build:"
    echo "  https://github.com/llomj/SophiAI/actions"
    echo ""
    echo "Or install GitHub CLI first:"
    echo "  brew install gh  (on macOS)"
    echo "  gh auth login"
    echo ""
fi
