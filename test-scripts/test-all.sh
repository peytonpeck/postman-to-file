#!/bin/bash

# Master Test Script - Runs All Tests
echo "Running All Tests for postman-to-file"
echo "=========================================="
echo ""

# Change to the project root directory
cd "$(dirname "$0")/.."

# Make sure the project is built
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi
echo "Build successful"
echo ""

# Run all test scripts
echo "Running Import Tests..."
bash test-scripts/test-import.sh

if [ $? -ne 0 ]; then
    echo "Import tests failed"
    exit 1
fi
echo ""

echo "Running Export Tests..."
bash test-scripts/test-export.sh

if [ $? -ne 0 ]; then
    echo "Export tests failed"
    exit 1
fi
echo ""


echo "🚀 Running Round-trip Tests..."
bash test-scripts/test-roundtrip.sh

if [ $? -ne 0 ]; then
    echo "Round-trip tests failed"
    exit 1
fi
echo ""

# Clean up test outputs
echo "🧹 Cleaning up test outputs..."
rm -rf test-output-* test-exported-*.json test-roundtrip-* 2>/dev/null

echo ""
echo "🎉 All tests passed successfully!"
echo "================================="
echo "✅ Import functionality working"
echo "✅ Export functionality working"
echo "✅ Round-trip functionality working"
echo ""
echo "🚀 postman-to-file is ready for use!"
