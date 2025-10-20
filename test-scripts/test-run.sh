#!/bin/bash

# Test Run Functionality
echo "🧪 Testing Run Functionality"
echo "============================="

# Change to the project root directory
cd "$(dirname "$0")/.."

# Clean up any existing test outputs
rm -f test-run-*.json 2>/dev/null

echo "🚀 Testing collection run without environment..."
node dist/cli.js run test-scripts/test-data/simple-collection.json

if [ $? -eq 0 ]; then
    echo "✅ Collection run successful"
else
    echo "❌ Collection run failed"
    exit 1
fi

echo ""
echo "🚀 Testing collection run with environment..."
node dist/cli.js run test-scripts/test-data/simple-collection.json test-scripts/test-data/test-environment.json

if [ $? -eq 0 ]; then
    echo "✅ Collection run with environment successful"
else
    echo "❌ Collection run with environment failed"
    exit 1
fi

echo ""
echo "🚀 Testing exported collection run..."
node dist/cli.js run test-exported-simple.json

if [ $? -eq 0 ]; then
    echo "✅ Exported collection run successful"
else
    echo "❌ Exported collection run failed"
    exit 1
fi

echo ""
echo "🎉 All run tests passed!"
