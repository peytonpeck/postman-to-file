# Test Scripts for postman-to-file

This directory contains automated test scripts to verify that all functionality of the postman-to-file tool works correctly.

## Test Data

The `test-data/` directory contains sample Postman collections and environment files used for testing:

- `simple-collection.json` - Basic collection with requests and tests
- `complex-collection.json` - Collection with folders, mixed content, and variables
- `test-environment.json` - Environment file with variables for testing

## Test Scripts

### Individual Test Scripts

- `test-import.sh` - Tests the import functionality

  - Imports simple and complex collections
  - Verifies file structure creation
  - Checks for proper numbering and organization

- `test-export.sh` - Tests the export functionality

  - Exports imported collections back to JSON
  - Validates JSON structure and content
  - Checks for proper folder preservation

- `test-run.sh` - Tests the Newman run functionality

  - Runs collections with and without environments
  - Tests exported collections
  - Verifies test execution

- `test-roundtrip.sh` - Tests complete round-trip functionality
  - Import → Export → Import → Export
  - Compares original and final outputs
  - Ensures data integrity through the process

### Master Test Script

- `test-all.sh` - Runs all tests in sequence
  - Builds the project
  - Runs all individual test scripts
  - Cleans up test outputs
  - Provides comprehensive test report

## Running Tests

### Run All Tests

```bash
./test-scripts/test-all.sh
```

### Run Individual Tests

```bash
# Test import functionality
./test-scripts/test-import.sh

# Test export functionality
./test-scripts/test-export.sh

# Test run functionality
./test-scripts/test-run.sh

# Test round-trip functionality
./test-scripts/test-roundtrip.sh
```

## Test Outputs

The test scripts create temporary directories and files during testing:

- `test-output-*` - Imported collection directories
- `test-exported-*.json` - Exported collection files
- `test-roundtrip-*` - Round-trip test outputs

These are automatically cleaned up by the `test-all.sh` script.

## Requirements

- Node.js and npm
- The postman-to-file project built (`npm run build`)
- `jq` (optional, for detailed JSON comparison)
- `bash` shell

## What the Tests Verify

1. **Import Functionality**

   - Collection parsing and validation
   - File structure creation
   - Proper numbering (001-, 002-, etc.)
   - Folder hierarchy preservation
   - Variable handling

2. **Export Functionality**

   - JSON generation
   - Structure preservation
   - Order maintenance
   - Metadata handling

3. **Run Functionality**

   - Newman integration
   - Environment variable support
   - Test execution
   - Error handling

4. **Round-trip Integrity**
   - Data preservation through import/export cycles
   - Structure consistency
   - Variable handling
   - Order preservation

## Troubleshooting

If tests fail:

1. Ensure the project is built: `npm run build`
2. Check that all dependencies are installed: `npm install`
3. Verify Newman is available: `npm list newman`
4. Check file permissions: `chmod +x test-scripts/*.sh`
5. Review individual test outputs for specific error messages
