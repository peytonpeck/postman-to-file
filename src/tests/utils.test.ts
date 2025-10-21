import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDirectory, readJsonFile, sanitizeFileName, writeJsonFile } from '../utils/file-system.js';
import { generateRequestFileName } from '../utils/naming.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Naming Utils', () => {
  it('should generate request file name', () => {
    const fileName = generateRequestFileName('Get Users', 'GET');
    expect(fileName).toBe('GET-Get-Users.json');
  });

  it('should handle special characters in file names', () => {
    const fileName = generateRequestFileName('Get Users (Admin)', 'GET');
    expect(fileName).toBe('GET-Get-Users-(Admin).json');
  });

  it('should sanitize file names', () => {
    const sanitized = sanitizeFileName('Get Users (Admin)');
    expect(sanitized).toBe('Get-Users-(Admin)');
  });
});

describe('File System Utils', () => {
  const testDir = path.join(__dirname, 'test-fs');

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create directory', () => {
    createDirectory(testDir);
    expect(fs.existsSync(testDir)).toBe(true);
  });

  it('should not throw error if directory already exists', () => {
    createDirectory(testDir);
    expect(() => createDirectory(testDir)).not.toThrow();
  });

  it('should write and read JSON file', async () => {
    const testData = { name: 'Test', value: 123 };
    const filePath = path.join(testDir, 'test.json');
    
    createDirectory(testDir);
    await writeJsonFile(filePath, testData);
    
    const readData = await readJsonFile(filePath);
    expect(readData).toEqual(testData);
  });
});
