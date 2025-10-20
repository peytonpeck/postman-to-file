import fs from 'fs';
import path from 'path';
import { PostmanCollection } from '../types/PostmanCollection.js';
import { PostmanEnvironment } from '../types/PostmanEnvironment.js';
import { PostmanFolder } from '../types/PostmanFolder.js';
import { PostmanRequestItem } from '../types/PostmanRequestItem.js';
import { createDirectory, createRootDirectory, sanitizeFileName, writeJsonFile } from '../utils/file-system.js';
import { generateFolderName, generateRequestFileName } from '../utils/naming.js';
import { READMEUtil } from '../utils/readme-util.js';

/**
 * Converts a Postman collection JSON to a structured file system
 */
export class PostmanImporter {
  private outputDir: string;
  private collection: PostmanCollection;

  constructor(collection: PostmanCollection, outputDir: string) {
    this.collection = collection;
    this.outputDir = outputDir;
  }

  /**
   * Main import method - converts collection to file structure
   */
  async import(): Promise<void> {
    try {
      // Create root directory
      createRootDirectory(this.outputDir);
      
      // Write collection metadata
      await this.writeCollectionMetadata();
      
      // Write collection variables
      await this.writeCollectionVariables();
      
      // Write environments
      await this.writeEnvironments();
      
      // Process items (requests and folders)
      await this.processItems(this.collection.item, 'requests');
      
      // Write documentation files
      const readmeUtil = new READMEUtil(this.collection, this.outputDir);
      await readmeUtil.writeReadme();
      await readmeUtil.writeAiContext();
      await readmeUtil.writeAiInstructions();
      
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async writeCollectionMetadata(): Promise<void> {
    const metadata = {
      info: this.collection.info,
      event: this.collection.event,
      auth: this.collection.auth,
      protocolProfileBehavior: this.collection.protocolProfileBehavior
    };
    
    await writeJsonFile(path.join(this.outputDir, 'collection.json'), metadata);
  }

  private async writeCollectionVariables(): Promise<void> {
    if (this.collection.variable && this.collection.variable.length > 0) {
      await writeJsonFile(path.join(this.outputDir, 'variables.json'), this.collection.variable);
    }
  }

  private async writeEnvironments(): Promise<void> {
    // Note: Environments are typically separate files in Postman
    // This would need to be handled separately or passed as additional input
    const envDir = path.join(this.outputDir, 'environments');
    createDirectory(envDir);
    
    // Placeholder for environment handling
    // TODO: Implement environment import logic
  }

  private async processItems(items: (PostmanRequestItem | PostmanFolder)[], basePath: string): Promise<void> {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item) continue;
      
      if ('request' in item) {
        // This is a PostmanRequestItem
        await this.processRequest(item, basePath, i + 1);
      } else {
        // This is a PostmanFolder
        await this.processFolder(item, basePath, i + 1);
      }
    }
  }

  private async processRequest(requestItem: PostmanRequestItem, basePath: string, index: number): Promise<void> {
    const requestDir = path.join(this.outputDir, basePath);
    createDirectory(requestDir);
    
    const fileName = generateRequestFileName(requestItem.name, requestItem.request.method, index);
    const filePath = path.join(requestDir, fileName);
    
    // Write main request file
    await writeJsonFile(filePath, requestItem);
    
    // Write script file if events exist
    if (requestItem.event && requestItem.event.length > 0) {
      await writeJsonFile(filePath.replace('.json', '.script.json'), requestItem.event);
    }
    
    // Write response examples if they exist
    if (requestItem.response && requestItem.response.length > 0) {
      await writeJsonFile(filePath.replace('.json', '.response-example.json'), requestItem.response);
    }
    
    // Write variables if they exist
    if (requestItem.variable && requestItem.variable.length > 0) {
      await writeJsonFile(filePath.replace('.json', '.variables.json'), requestItem.variable);
    }
  }

  private async processFolder(folder: PostmanFolder, basePath: string, index: number): Promise<void> {
    const folderName = generateFolderName(folder.name, index);
    const folderPath = path.join(basePath, folderName);
    const fullFolderPath = path.join(this.outputDir, folderPath);
    
    createDirectory(fullFolderPath);
    
    // Write folder metadata
    const metadata = {
      id: folder.id,
      name: folder.name,
      description: folder.description,
      auth: folder.auth,
      variable: folder.variable,
      event: folder.event,
      protocolProfileBehavior: folder.protocolProfileBehavior
    };
    
    await writeJsonFile(path.join(fullFolderPath, 'metadata.json'), metadata);
    
    // Process folder items
    await this.processItems(folder.item, folderPath);
  }

}
