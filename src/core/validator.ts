import fs from 'fs';
import { PostmanCollection } from '../types/PostmanCollection.js';
import { PostmanFolder } from '../types/PostmanFolder.js';
import { PostmanRequestItem } from '../types/PostmanRequestItem.js';

/**
 * Validates Postman collection JSON structure
 */
export class PostmanValidator {
  /**
   * Validates a Postman collection
   */
  static validateCollection(collection: any): PostmanCollection {
    if (!collection) {
      throw new Error('Collection is null or undefined');
    }
    
    if (!collection.info) {
      throw new Error('Collection missing required "info" field');
    }
    
    if (!collection.info.name) {
      throw new Error('Collection info missing required "name" field');
    }
    
    if (!Array.isArray(collection.item)) {
      throw new Error('Collection "item" field must be an array');
    }
    
    // Validate items
    for (const item of collection.item) {
      this.validateItem(item);
    }
    
    return collection as PostmanCollection;
  }
  
  /**
   * Validates a collection item (request or folder)
   */
  static validateItem(item: any): void {
    if (!item) {
      throw new Error('Item is null or undefined');
    }
    
    if (!item.name) {
      throw new Error('Item missing required "name" field');
    }
    
    if ('request' in item) {
      this.validateRequestItem(item);
    } else if ('item' in item) {
      this.validateFolder(item);
    } else {
      throw new Error('Item must be either a request or folder');
    }
  }
  
  /**
   * Validates a request item
   */
  static validateRequestItem(item: any): void {
    if (!item.request) {
      throw new Error('Request item missing required "request" field');
    }
    
    if (!item.request.method) {
      throw new Error('Request missing required "method" field');
    }
    
    if (!item.request.url) {
      throw new Error('Request missing required "url" field');
    }
  }
  
  /**
   * Validates a folder
   */
  static validateFolder(item: any): void {
    if (!Array.isArray(item.item)) {
      throw new Error('Folder "item" field must be an array');
    }
    
    // Validate nested items
    for (const nestedItem of item.item) {
      this.validateItem(nestedItem);
    }
  }
  
  /**
   * Validates file system structure
   */
  static validateFileSystemStructure(dirPath: string): void {
    // Check if collection.json exists
    const collectionPath = `${dirPath}/collection.json`;
    if (!fs.existsSync(collectionPath)) {
      throw new Error('Invalid file system structure: missing collection.json');
    }
    
    // Check if requests directory exists
    const requestsPath = `${dirPath}/requests`;
    if (!fs.existsSync(requestsPath)) {
      throw new Error('Invalid file system structure: missing requests directory');
    }
  }
}
