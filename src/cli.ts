#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { PostmanCollection } from "./types/PostmanCollection";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: postman-to-file <collection.json>");
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(filePath), "utf8");
const collection = JSON.parse(raw) as PostmanCollection;

console.log("✅ Valid Postman collection:", collection.info.name);