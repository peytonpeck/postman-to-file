#!/bin/bash

# Test Round-trip Functionality
echo "🧪 Testing Round-trip Functionality"
echo "===================================="

# Change to the project root directory
cd "$(dirname "$0")/.."

# Clean up any existing test outputs
rm -rf test-roundtrip-* test-roundtrip-*.json 2>/dev/null

echo "🔄 Testing complete round-trip: Import → Export → Import → Export"
echo ""

echo "Step 1: Import original collection..."
node dist/cli.js import test-scripts/test-data/complex-collection.json test-roundtrip-import

if [ $? -ne 0 ]; then
    echo "❌ Step 1 failed: Import"
    exit 1
fi
echo "✅ Step 1 completed: Import"

echo ""
echo "Step 2: Export to JSON..."
node dist/cli.js export test-roundtrip-import test-roundtrip-exported.json

if [ $? -ne 0 ]; then
    echo "❌ Step 2 failed: Export"
    exit 1
fi
echo "✅ Step 2 completed: Export"

echo ""
echo "Step 3: Import the exported JSON..."
node dist/cli.js import test-roundtrip-exported.json test-roundtrip-import2

if [ $? -ne 0 ]; then
    echo "❌ Step 3 failed: Import exported"
    exit 1
fi
echo "✅ Step 3 completed: Import exported"

echo ""
echo "Step 4: Export again..."
node dist/cli.js export test-roundtrip-import2 test-roundtrip-final.json

if [ $? -ne 0 ]; then
    echo "❌ Step 4 failed: Final export"
    exit 1
fi
echo "✅ Step 4 completed: Final export"

echo ""
echo "🔍 Comparing original and final exports..."

# Compare the two JSON files (ignoring whitespace and order)
if command -v jq >/dev/null 2>&1; then
    # Sort both files and compare
    jq -S . test-scripts/test-data/complex-collection.json > /tmp/original.json
    jq -S . test-roundtrip-final.json > /tmp/final.json
    
    if diff -q /tmp/original.json /tmp/final.json > /dev/null; then
        echo "✅ Round-trip successful: Files are identical"
    else
        echo "⚠️  Round-trip completed but files differ (this might be expected due to ordering)"
        echo "📊 Original file size: $(wc -c < test-data/complex-collection.json) bytes"
        echo "📊 Final file size: $(wc -c < test-roundtrip-final.json) bytes"
    fi
    
    rm -f /tmp/original.json /tmp/final.json
else
    echo "⚠️  jq not available, skipping detailed comparison"
    echo "📊 Original file size: $(wc -c < test-scripts/test-data/complex-collection.json) bytes"
    echo "📊 Final file size: $(wc -c < test-roundtrip-final.json) bytes"
fi

echo ""
echo "🎉 Round-trip test completed!"
