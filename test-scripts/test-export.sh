#!/bin/bash

# Test Export Functionality
echo "🧪 Testing Export Functionality"
echo "================================"

# Change to the project root directory
cd "$(dirname "$0")/.."

# Clean up any existing test outputs
rm -f test-exported-*.json 2>/dev/null

echo "📤 Testing simple collection export..."
node dist/cli.js export test-output-simple test-exported-simple.json

if [ $? -eq 0 ]; then
    echo "✅ Simple collection export successful"
    
    # Check if the exported file exists and has expected content
    if [ -f "test-exported-simple.json" ]; then
        echo "✅ Export file created"
        
        # Check if the JSON is valid and has expected structure
        if command -v jq >/dev/null 2>&1; then
            if jq -e '.info.name' test-exported-simple.json > /dev/null 2>&1; then
                echo "✅ Exported JSON is valid"
                
                # Show the collection name
                COLLECTION_NAME=$(jq -r '.info.name' test-exported-simple.json)
                echo "📄 Collection name: $COLLECTION_NAME"
                
                # Count items
                ITEM_COUNT=$(jq '.item | length' test-exported-simple.json)
                echo "📊 Number of items: $ITEM_COUNT"
            else
                echo "❌ Exported JSON is invalid"
                exit 1
            fi
        else
            echo "⚠️  jq not available, skipping JSON validation"
            echo "📄 File created: test-exported-simple.json"
            echo "📊 File size: $(wc -c < test-exported-simple.json) bytes"
        fi
    else
        echo "❌ Export file not created"
        exit 1
    fi
else
    echo "❌ Simple collection export failed"
    exit 1
fi

echo ""
echo "📤 Testing complex collection export..."
node dist/cli.js export test-output-complex test-exported-complex.json

if [ $? -eq 0 ]; then
    echo "✅ Complex collection export successful"
    
    # Check if the exported file exists and has expected content
    if [ -f "test-exported-complex.json" ]; then
        echo "✅ Export file created"
        
        # Check if the JSON is valid and has expected structure
        if command -v jq >/dev/null 2>&1; then
            if jq -e '.info.name' test-exported-complex.json > /dev/null 2>&1; then
                echo "✅ Exported JSON is valid"
                
                # Show the collection name
                COLLECTION_NAME=$(jq -r '.info.name' test-exported-complex.json)
                echo "📄 Collection name: $COLLECTION_NAME"
                
                # Count items
                ITEM_COUNT=$(jq '.item | length' test-exported-complex.json)
                echo "📊 Number of items: $ITEM_COUNT"
                
                # Check if folders are preserved
                FOLDER_COUNT=$(jq '[.item[] | select(has("item"))] | length' test-exported-complex.json)
                echo "📁 Number of folders: $FOLDER_COUNT"
            else
                echo "❌ Exported JSON is invalid"
                exit 1
            fi
        else
            echo "⚠️  jq not available, skipping JSON validation"
            echo "📄 File created: test-exported-complex.json"
            echo "📊 File size: $(wc -c < test-exported-complex.json) bytes"
        fi
    else
        echo "❌ Export file not created"
        exit 1
    fi
else
    echo "❌ Complex collection export failed"
    exit 1
fi

echo ""
echo "🎉 All export tests passed!"
