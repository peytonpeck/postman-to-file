#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { PostmanExporter } from "./core/exporter.js";
import { PostmanImporter } from "./core/importer.js";
import { PostmanValidator } from "./core/validator.js";
import { directoryExists, fileExists } from "./utils/file-system.js";

async function main() {
  const command = process.argv[2];
  const inputPath = process.argv[3];
  const outputPath = process.argv[4];
  
  if (!command || !inputPath) {
    console.error("Usage:");
    console.error("  postman-to-file import <collection.json> <output-directory>");
    console.error("  postman-to-file export <directory> <output.json>");
    console.error("");
    console.error("Examples:");
    console.error("  postman-to-file import my-collection.json ./my-api/");
    console.error("  postman-to-file export ./my-api/ updated-collection.json");
    console.error("");
    console.error("To run collections, use Newman directly:");
    console.error("  newman run collection.json -e environment.json");
    process.exit(1);
  }
  
  try {
    if (command === "import") {
      if (!outputPath) {
        console.error("Import command requires output directory");
        process.exit(1);
      }
      await handleImport(inputPath, outputPath);
    } else if (command === "export") {
      if (!outputPath) {
        console.error("Export command requires output file");
        process.exit(1);
      }
      await handleExport(inputPath, outputPath);
    } else {
      console.error("Invalid command. Use 'import' or 'export'");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

async function handleImport(filePath: string, outputDir: string): Promise<void> {
  // Validate input file exists
  if (!fileExists(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  // Validate output directory doesn't exist
  if (directoryExists(outputDir)) {
    throw new Error(`Directory already exists: ${outputDir}`);
  }
  
  // Read and validate Postman collection
  const raw = fs.readFileSync(path.resolve(filePath), "utf8");
  const collectionData = JSON.parse(raw);
  const collection = PostmanValidator.validateCollection(collectionData);
  
  console.log("Valid Postman collection:", collection.info.name);
  
  // Import collection
  console.log("Converting collection to file structure...");
  const importer = new PostmanImporter(collection, outputDir);
  await importer.import();
  
  console.log("Collection converted successfully!");
  console.log(`Output directory: ${outputDir}`);
}

async function handleExport(dirPath: string, outputFile: string): Promise<void> {
  // Validate input directory exists
  if (!directoryExists(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }
  
  // Validate output file doesn't exist
  if (fileExists(outputFile)) {
    throw new Error(`File already exists: ${outputFile}`);
  }
  
  // Validate file system structure
  PostmanValidator.validateFileSystemStructure(dirPath);
  
  console.log("Converting file structure to Postman collection...");
  
  // Export collection
  const exporter = new PostmanExporter(dirPath);
  const collection = await exporter.export();
  
  // Write output file
  fs.writeFileSync(outputFile, JSON.stringify(collection, null, '\t'));
  
  console.log("Collection exported successfully!");
  console.log(`Output file: ${outputFile}`);
}



main();