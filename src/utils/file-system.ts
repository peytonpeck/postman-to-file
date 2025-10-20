import fs from 'fs';
import path from 'path';

/**
 * Creates a directory if it doesn't exist
 */
export function createDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Creates a root directory, throwing error if it already exists
 */
export function createRootDirectory(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    throw new Error(`Directory already exists: ${dirPath}`);
  }
  
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Writes a JSON file with proper formatting
 */
export async function writeJsonFile(filePath: string, data: any): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const jsonContent = JSON.stringify(data, null, 2);
  await fs.promises.writeFile(filePath, jsonContent, 'utf8');
}

/**
 * Reads a JSON file
 */
export async function readJsonFile(filePath: string): Promise<any> {
  const content = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Reads a directory and returns file names
 */
export async function readDirectory(dirPath: string): Promise<string[]> {
  return await fs.promises.readdir(dirPath);
}

/**
 * Sanitizes a file name to be safe for the file system
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*]/g, '-')  // Replace invalid characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}

/**
 * Checks if a file exists
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Checks if a directory exists
 */
export function directoryExists(dirPath: string): boolean {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}
