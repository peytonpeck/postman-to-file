// Test file - Jest imports will be added when Jest is configured
import fs from 'fs';
import path from 'path';
import { PostmanExporter } from '../core/exporter';

describe('PostmanExporter', () => {
  const testDir = path.join(__dirname, 'test-export');

  beforeEach(() => {
    // Create test directory structure
    fs.mkdirSync(testDir, { recursive: true });
    fs.mkdirSync(path.join(testDir, 'requests'), { recursive: true });
    fs.mkdirSync(path.join(testDir, 'environments'), { recursive: true });

    // Create collection.json
    const collectionData = {
      info: {
        name: 'Test Collection',
        description: 'A test collection'
      },
      event: [],
      auth: null,
      protocolProfileBehavior: null
    };
    fs.writeFileSync(
      path.join(testDir, 'collection.json'),
      JSON.stringify(collectionData, null, 2)
    );

    // Create a request file
    const requestData = {
      name: 'Get Users',
      request: {
        method: 'GET',
        url: 'https://api.example.com/users'
      }
    };
    fs.writeFileSync(
      path.join(testDir, 'requests', 'GET-Get-Users.json'),
      JSON.stringify(requestData, null, 2)
    );
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('should export collection from file structure', async () => {
    const exporter = new PostmanExporter(testDir);
    const collection = await exporter.export();

    expect(collection.info.name).toBe('Test Collection');
    expect(collection.item).toHaveLength(1);
    expect(collection.item[0].name).toBe('Get Users');
  });

  it('should handle collection variables', async () => {
    // Create variables.json
    const variables = [
      { key: 'baseUrl', value: 'https://api.example.com' }
    ];
    fs.writeFileSync(
      path.join(testDir, 'variables.json'),
      JSON.stringify(variables, null, 2)
    );

    const exporter = new PostmanExporter(testDir);
    const collection = await exporter.export();

    expect(collection.variable).toHaveLength(1);
    expect(collection.variable![0].key).toBe('baseUrl');
  });

  it('should handle request with scripts', async () => {
    // Create script file
    const scripts = [
      {
        listen: 'test',
        script: {
          exec: ['pm.test("Status code is 200", function () {', '    pm.response.to.have.status(200);', '});']
        }
      }
    ];
    fs.writeFileSync(
      path.join(testDir, 'requests', 'GET-Get-Users.script.json'),
      JSON.stringify(scripts, null, 2)
    );

    const exporter = new PostmanExporter(testDir);
    const collection = await exporter.export();

    const request = collection.item[0] as any;
    expect(request.event).toHaveLength(1);
    expect(request.event[0].listen).toBe('test');
  });

  it('should handle request with response examples', async () => {
    // Create response example file
    const responses = [
      {
        name: 'Success',
        status: 'OK',
        code: 200,
        body: '{"users": []}'
      }
    ];
    fs.writeFileSync(
      path.join(testDir, 'requests', 'GET-Get-Users.response-example.json'),
      JSON.stringify(responses, null, 2)
    );

    const exporter = new PostmanExporter(testDir);
    const collection = await exporter.export();

    const request = collection.item[0] as any;
    expect(request.response).toHaveLength(1);
    expect(request.response[0].name).toBe('Success');
  });
});
