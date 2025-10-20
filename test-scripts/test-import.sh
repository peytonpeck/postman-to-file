#!/bin/bash

# Test Import Functionality
echo "🧪 Testing Import Functionality"
echo "================================"

# Change to the project root directory
cd "$(dirname "$0")/.."

# Clean up any existing test outputs
rm -rf test-output-* 2>/dev/null

echo "📥 Testing simple collection import..."
node dist/cli.js import test-scripts/test-data/simple-collection.json test-output-simple

if [ $? -eq 0 ]; then
    echo "✅ Simple collection import successful"
    
    # Check if expected files exist
    if [ -f "test-output-simple/collection.json" ] && [ -f "test-output-simple/variables.json" ] && [ -d "test-output-simple/requests" ]; then
        echo "✅ Expected files created"
        
        # List the structure
        echo "📁 Generated structure:"
        find test-output-simple -type f | head -10
    else
        echo "❌ Missing expected files"
        exit 1
    fi
else
    echo "❌ Simple collection import failed"
    exit 1
fi

echo ""
echo "📥 Testing complex collection import..."
node dist/cli.js import test-scripts/test-data/complex-collection.json test-output-complex

if [ $? -eq 0 ]; then
    echo "✅ Complex collection import successful"
    
    # Check if folders were created with proper numbering
    if [ -d "test-output-complex/requests/001-Authentication" ] && [ -d "test-output-complex/requests/003-User-Management" ]; then
        echo "✅ Folders created with proper numbering"
        
        # List the structure
        echo "📁 Generated structure:"
        find test-output-complex -type d | sort
        echo ""
        find test-output-complex -name "*.json" | sort
    else
        echo "❌ Folder structure not created correctly"
        exit 1
    fi
else
    echo "❌ Complex collection import failed"
    exit 1
fi

echo ""
echo "🎉 All import tests passed!"
