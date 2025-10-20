import fs from 'fs';
import path from 'path';
import { PostmanCollection } from '../types/PostmanCollection.js';
import { PostmanFolder } from '../types/PostmanFolder.js';
import { PostmanRequestItem } from '../types/PostmanRequestItem.js';
import { readDirectory, readJsonFile } from '../utils/file-system.js';
import { extractIndexFromFileName, extractIndexFromFolderName, parseSafeIndexString } from '../utils/naming.js';

/**
 * Converts a structured file system back to a Postman collection JSON
 */
export class PostmanExporter {
  private inputDir: string;

  constructor(inputDir: string) {
    this.inputDir = inputDir;
  }

  /**
   * Main export method - converts file structure to Postman collection
   */
  async export(): Promise<PostmanCollection> {
    try {
      // Read collection metadata
      const collection = await this.readCollectionMetadata();
      
      // Read collection variables
      const variables = await this.readCollectionVariables();
      if (variables) {
        collection.variable = variables;
      }
      
      // Read environments
      const environments = await this.readEnvironments();
      // Note: Environments are typically separate files in Postman
      // This would need to be handled separately
      
      // Process requests and folders
      const items = await this.processRequestsDirectory('requests');
      collection.item = items;
      
      return collection;
      
    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async readCollectionMetadata(): Promise<PostmanCollection> {
    const collectionPath = path.join(this.inputDir, 'collection.json');
    const metadata = await readJsonFile(collectionPath);
    
    return {
      info: metadata.info,
      item: [], // Will be populated later
      event: metadata.event,
      auth: metadata.auth,
      protocolProfileBehavior: metadata.protocolProfileBehavior
    };
  }

  private async readCollectionVariables(): Promise<any[] | null> {
    const variablesPath = path.join(this.inputDir, 'variables.json');
    try {
      return await readJsonFile(variablesPath);
    } catch {
      return null; // Variables file doesn't exist
    }
  }

  private async readEnvironments(): Promise<any[]> {
    const envDir = path.join(this.inputDir, 'environments');
    try {
      const envFiles = await readDirectory(envDir);
      const environments: any[] = [];
      
      for (const file of envFiles) {
        if (file.endsWith('.json')) {
          const envPath = path.join(envDir, file);
          const env = await readJsonFile(envPath);
          environments.push(env);
        }
      }
      
      return environments;
    } catch {
      return []; // Environments directory doesn't exist
    }
  }

  private async processRequestsDirectory(dirPath: string): Promise<(PostmanRequestItem | PostmanFolder)[]> {
    const fullPath = path.join(this.inputDir, dirPath);
    const items = await readDirectory(fullPath);
    const result: { item: PostmanRequestItem | PostmanFolder; index: number }[] = [];
    
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const stat = await fs.promises.stat(itemPath);
      
      if (stat.isDirectory()) {
        // This is a folder
        const folder = await this.processFolder(itemPath, item);
        const index = extractIndexFromFolderName(item);
        result.push({ item: folder, index });
      } else if (item.endsWith('.json') && !item.includes('.event.') && !item.includes('.response-example.') && !item.includes('.variables.')) {
        // This is a main request file (not script, response, or variables)
        const request = await this.processRequest(itemPath);
        const index = extractIndexFromFileName(item);
        result.push({ item: request, index });
      }
    }
    
    // Sort by index and return just the items
    return result
      .sort((a, b) => a.index - b.index)
      .map(entry => entry.item);
  }

  private async processFolder(folderPath: string, folderName: string): Promise<PostmanFolder> {
    const metadataPath = path.join(folderPath, 'metadata.json');
    const metadata = await readJsonFile(metadataPath);
    
    // Process items in this folder (use the folder path directly)
    const items = await this.processFolderItems(folderPath);
    
    return {
      id: metadata.id,
      name: metadata.name,
      description: metadata.description,
      item: items,
      event: metadata.event,
      auth: metadata.auth,
      variable: metadata.variable,
      protocolProfileBehavior: metadata.protocolProfileBehavior
    };
  }

  private async processFolderItems(folderPath: string): Promise<(PostmanRequestItem | PostmanFolder)[]> {
    const items = await readDirectory(folderPath);
    const result: { item: PostmanRequestItem | PostmanFolder; index: number }[] = [];
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stat = await fs.promises.stat(itemPath);
      
      if (stat.isDirectory()) {
        // This is a nested folder
        const folder = await this.processFolder(itemPath, item);
        const index = extractIndexFromFolderName(item);
        result.push({ item: folder, index });
      } else if (item.endsWith('.json') && !item.includes('.event.') && !item.includes('.response-example.') && !item.includes('.variables.') && item !== 'metadata.json') {
        // This is a main request file (not script, response, variables, or metadata)
        const request = await this.processRequest(itemPath);
        const index = extractIndexFromFileName(item);
        result.push({ item: request, index });
      }
    }
    
    // Sort by index and return just the items
    return result
      .sort((a, b) => a.index - b.index)
      .map(entry => entry.item);
  }

  private async processRequest(requestPath: string): Promise<PostmanRequestItem> {
    const request = await readJsonFile(requestPath);
    
    // Try to read associated files
    const basePath = requestPath.replace('.json', '');
    
    try {
      const eventPath = `${basePath}.event.json`;
      const events = await readJsonFile(eventPath);
      request.event = events;
    } catch {
      // Event file doesn't exist
    }
    
    try {
      const responsePath = `${basePath}.response-example.json`;
      const responses = await readJsonFile(responsePath);
      request.response = responses;
    } catch {
      // Response file doesn't exist
    }
    
    try {
      const variablesPath = `${basePath}.variables.json`;
      const variables = await readJsonFile(variablesPath);
      request.variable = variables;
    } catch {
      // Variables file doesn't exist
    }
    
    return request;
  }
}
