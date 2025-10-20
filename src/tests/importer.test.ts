// Test file - Jest imports will be added when Jest is configured
import fs from 'fs';
import path from 'path';
import { PostmanImporter } from '../core/importer';
import { PostmanCollection } from '../types/PostmanCollection';

describe('PostmanImporter', () => {
  const testDir = path.join(__dirname, 'test-output');
  const mockCollection: PostmanCollection = {
    info: {
      name: 'Test Collection',
      description: 'A test collection'
    },
    item: [
      {
        name: 'Get Users',
        request: {
          method: 'GET',
          url: 'https://api.example.com/users'
        }
      }
    ]
  };

  beforeEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should create directory structure', async () => {
    const importer = new PostmanImporter(mockCollection, testDir);
    await importer.import();

    expect(fs.existsSync(testDir)).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'collection.json'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'requests'))).toBe(true);
    expect(fs.existsSync(path.join(testDir, 'README.md'))).toBe(true);
  });

  it('should create request files', async () => {
    const importer = new PostmanImporter(mockCollection, testDir);
    await importer.import();

    const requestFile = path.join(testDir, 'requests', 'GET-Get-Users.json');
    expect(fs.existsSync(requestFile)).toBe(true);

    const requestContent = JSON.parse(fs.readFileSync(requestFile, 'utf8'));
    expect(requestContent.name).toBe('Get Users');
    expect(requestContent.request.method).toBe('GET');
  });

  it('should handle collection variables', async () => {
    const collectionWithVars: PostmanCollection = {
      ...mockCollection,
      variable: [
        { key: 'baseUrl', value: 'https://api.example.com' }
      ]
    };

    const importer = new PostmanImporter(collectionWithVars, testDir);
    await importer.import();

    const variablesFile = path.join(testDir, 'variables.json');
    expect(fs.existsSync(variablesFile)).toBe(true);

    const variables = JSON.parse(fs.readFileSync(variablesFile, 'utf8'));
    expect(variables).toHaveLength(1);
    expect(variables[0].key).toBe('baseUrl');
  });

  it('should create README with collection info', async () => {
    const importer = new PostmanImporter(mockCollection, testDir);
    await importer.import();

    const readmePath = path.join(testDir, 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);

    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    expect(readmeContent).toContain('Test Collection');
    expect(readmeContent).toContain('Variable Syntax');
  });
});
