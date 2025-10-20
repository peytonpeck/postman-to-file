import { sanitizeFileName } from './file-system.js';

/**
 * Generates a file name for a request based on its name, method, and index
 */
export function generateRequestFileName(name: string, method: string, index: number = 0): string {
  const sanitizedName = sanitizeFileName(name);
  const methodPrefix = method.toUpperCase();
  const indexStr = index > 0 ? `${getSafeIndexString(index)}-` : '';
  return `${indexStr}${methodPrefix}-${sanitizedName}.json`;
}

/**
 * Generates a unique file name for duplicate requests with index
 */
export function generateUniqueFileName(baseName: string, method: string, index: number, existingNames: Set<string>): string {
  let counter = 1;
  let fileName = generateRequestFileName(baseName, method, index);
  
  while (existingNames.has(fileName)) {
    const sanitizedName = sanitizeFileName(baseName);
    const methodPrefix = method.toUpperCase();
    const indexStr = `${String(index).padStart(3, '0')}-`;
    fileName = `${indexStr}${methodPrefix}-${sanitizedName}(${counter}).json`;
    counter++;
  }
  
  return fileName;
}

/**
 * Extracts the index from a request file name
 */
export function extractIndexFromFileName(fileName: string): number {
  const match = fileName.match(/^(\d{3}[a-z]?)-/);
  return match && match[1] ? parseSafeIndexString(match[1]) : 0;
}

/**
 * Extracts the base name from a request file name (removes index, method, and extension)
 */
export function extractBaseNameFromFileName(fileName: string): string {
  // Remove .json extension
  const withoutExtension = fileName.replace(/\.json$/, '');
  
  // Remove index prefix (e.g., "001-", "999a-", "999b-")
  const withoutIndex = withoutExtension.replace(/^\d{3}[a-z]?-/, '');
  
  // Remove method prefix (e.g., "GET-", "POST-")
  const withoutMethod = withoutIndex.replace(/^[A-Z]+-/, '');
  
  // Remove duplicate counter (e.g., "(1)", "(2)")
  const withoutCounter = withoutMethod.replace(/\(\d+\)$/, '');
  
  return withoutCounter;
}

/**
 * Generates a folder name from a Postman folder name with index
 */
export function generateFolderName(folderName: string, index: number = 0): string {
  const sanitizedName = sanitizeFileName(folderName);
  const indexStr = index > 0 ? `${getSafeIndexString(index)}-` : '';
  return `${indexStr}${sanitizedName}`;
}

/**
 * Extracts the index from a folder name
 */
export function extractIndexFromFolderName(folderName: string): number {
  const match = folderName.match(/^(\d{3}[a-z]?)-/);
  return match && match[1] ? parseSafeIndexString(match[1]) : 0;
}

/**
 * Extracts the base name from a folder name (removes index)
 */
export function extractBaseNameFromFolderName(folderName: string): string {
  // Remove index prefix (e.g., "001-", "999a-", "999b-")
  return folderName.replace(/^\d{3}[a-z]?-/, '');
}

/**
 * Generates a collection directory name from collection info
 */
export function generateCollectionDirectoryName(collectionName: string): string {
  return sanitizeFileName(collectionName);
}

/**
 * Handles edge case where we have more than 999 items
 * Returns a safe index string that won't conflict
 */
export function getSafeIndexString(index: number): string {
  if (index <= 999) {
    return String(index).padStart(3, '0');
  }
  
  // For 1000+, use a different pattern: 999a, 999b, etc.
  const baseIndex = 999;
  const suffix = String.fromCharCode(97 + (index - 1000)); // a, b, c, etc.
  return `${baseIndex}${suffix}`;
}

/**
 * Parses a safe index string back to a number
 */
export function parseSafeIndexString(indexStr: string): number {
  const match = indexStr.match(/^(\d{3})([a-z]?)$/);
  if (!match || !match[1]) return 0;
  
  const baseIndex = parseInt(match[1], 10);
  const suffix = match[2];
  
  if (!suffix) return baseIndex;
  
  // Convert suffix back to offset
  const offset = suffix.charCodeAt(0) - 97; // a=0, b=1, etc.
  return baseIndex + offset + 1;
}
