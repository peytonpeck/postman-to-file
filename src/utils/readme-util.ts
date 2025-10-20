import fs from 'fs';
import path from 'path';
import { PostmanCollection } from '../types/PostmanCollection.js';

export class READMEUtil {
  private collection: PostmanCollection;
  private outputDir: string;

  constructor(collection: PostmanCollection, outputDir: string) {
    this.collection = collection;
    this.outputDir = outputDir;
  }

  async writeReadme(): Promise<void> {
    const readmeContent = `# ${this.collection.info.name}

${this.collection.info.description || 'Postman collection converted to file structure'}

## File Structure

- \`collection.json\` - Collection metadata and configuration
- \`variables.json\` - Collection-level variables
- \`environments/\` - Environment configurations
- \`requests/\` - API requests organized by folder
  - Each request has multiple files:
    - \`{name}.json\` - Request configuration
    - \`{name}.script.json\` - Pre-request and test scripts
    - \`{name}.response-example.json\` - Example responses
    - \`{name}.variables.json\` - Request-level variables

## Variable Syntax

Variables use Postman's \`{{variable_name}}\` syntax. Collection variables are defined in \`variables.json\` at the root level.

## 🤖 AI Instructions for Editing

### IMPORTANT: File Numbering System

**All files and folders use a numbering system to preserve order:**
- Files: \`001-METHOD-Name.json\`, \`002-METHOD-Name.json\`, etc.
- Folders: \`001-FolderName/\`, \`002-FolderName/\`, etc.

### When Adding New Items

**⚠️ CRITICAL: You MUST renumber existing items when inserting new ones!**

#### Example Scenario:
\`\`\`
Current structure:
001-GET-Users.json
002-POST-Create-User.json
003-DELETE-User.json
\`\`\`

**If you want to insert a new request between GET and POST:**

1. **Rename existing files:**
   - \`002-POST-Create-User.json\` → \`003-POST-Create-User.json\`
   - \`003-DELETE-User.json\` → \`004-DELETE-User.json\`

2. **Create your new file:**
   - \`002-PUT-Update-User.json\`

3. **Final structure:**
   \`\`\`
   001-GET-Users.json
   002-PUT-Update-User.json      ← Your new request
   003-POST-Create-User.json     ← Renumbered
   004-DELETE-User.json          ← Renumbered
   \`\`\`

### Rules for AI:
- **Always check existing numbers** before adding new items
- **Renumber ALL items** that come after your insertion point
- **Use sequential numbering**: 001, 002, 003, etc.
- **For large collections**: Use 999a, 999b, 999c for items beyond 999
- **Maintain consistency**: All items in the same directory must be numbered

### Folder Insertion Example:
\`\`\`
Before: 001-Auth/, 002-Users/, 003-Products/
Insert: New folder between Auth and Users
After:  001-Auth/, 002-Orders/, 003-Users/, 004-Products/
\`\`\`

**Remember: The numbering system ensures proper order when converting back to Postman format!**

## Usage

This structure is designed to be easily indexed by AI tools and maintained by development teams.
`;

    await fs.promises.writeFile(path.join(this.outputDir, 'README.md'), readmeContent);
  }

  async writeAiContext(): Promise<void> {
    const aiContext = {
      collection: {
        name: this.collection.info.name,
        description: this.collection.info.description,
        schema: this.collection.info.schema,
        id: this.collection.info._postman_id
      },
      structure: {
        type: "postman-collection",
        format: "file-based",
        numbering_system: "sequential",
        max_number: 999,
        overflow_format: "999a, 999b, 999c"
      },
      files: {
        collection_metadata: "collection.json",
        variables: "variables.json",
        environments: "environments/",
        requests: "requests/",
        documentation: "README.md"
      },
      rules: {
        critical: [
          "ALL files and folders MUST be numbered sequentially",
          "When inserting new items, renumber ALL existing items after insertion point",
          "Use format: 001-METHOD-Name.json for requests",
          "Use format: 001-FolderName/ for folders",
          "Maintain order consistency across all operations"
        ],
        numbering: {
          format: "001, 002, 003...",
          max_standard: 999,
          overflow: "999a, 999b, 999c, 999d...",
          padding: 3
        },
        operations: {
          insert: "1. Check existing numbers 2. Renumber items after insertion 3. Create new item with correct number",
          delete: "1. Remove item 2. Renumber remaining items to fill gaps",
          reorder: "1. Renumber all items to match new order"
        }
      },
      examples: {
        insert_request: {
          before: ["001-GET-Users.json", "002-POST-Create-User.json", "003-DELETE-User.json"],
          action: "Insert PUT-Update-User between GET and POST",
          after: ["001-GET-Users.json", "002-PUT-Update-User.json", "003-POST-Create-User.json", "004-DELETE-User.json"]
        },
        insert_folder: {
          before: ["001-Auth/", "002-Users/", "003-Products/"],
          action: "Insert Orders folder between Auth and Users",
          after: ["001-Auth/", "002-Orders/", "003-Users/", "004-Products/"]
        }
      }
    };

    await fs.promises.writeFile(
      path.join(this.outputDir, 'ai-context.json'), 
      JSON.stringify(aiContext, null, 2)
    );
  }

  async writeAiInstructions(): Promise<void> {
    const aiInstructions = `# AI Instructions for Postman Collection Editing

## CRITICAL: File Numbering System

This collection uses a **sequential numbering system** to preserve order when converting back to Postman format.

### Numbering Rules
- **Format**: 001, 002, 003, 004...
- **Files**: \`001-METHOD-Name.json\`
- **Folders**: \`001-FolderName/\`
- **Maximum**: 999 (then use 999a, 999b, 999c...)

### When Adding New Items

**⚠️ MANDATORY: You MUST renumber existing items when inserting new ones!**

#### Process:
1. **Identify insertion point**
2. **Renumber ALL items after insertion point** (+1 to each)
3. **Create new item with correct number**
4. **Verify sequential order**

#### Example:
\`\`\`
BEFORE: 001-GET-Users.json, 002-POST-Create-User.json, 003-DELETE-User.json
INSERT: PUT-Update-User between GET and POST
AFTER:  001-GET-Users.json, 002-PUT-Update-User.json, 003-POST-Create-User.json, 004-DELETE-User.json
\`\`\`

### When Deleting Items

1. **Remove the item**
2. **Renumber remaining items** to fill gaps
3. **Maintain sequential order**

### When Reordering Items

1. **Determine new order**
2. **Renumber ALL items** to match new sequence
3. **Verify no gaps or duplicates**

### File Types

- **Main request**: \`001-METHOD-Name.json\`
- **Scripts**: \`001-METHOD-Name.script.json\`
- **Response examples**: \`001-METHOD-Name.response-example.json\`
- **Variables**: \`001-METHOD-Name.variables.json\`
- **Folder metadata**: \`metadata.json\`

### Validation Checklist

Before completing any edit:
- [ ] All files are numbered sequentially
- [ ] No gaps in numbering sequence
- [ ] No duplicate numbers
- [ ] New items have correct numbers
- [ ] Existing items renumbered if needed

**Remember: The numbering system ensures proper order when converting back to Postman format!**
`;

    await fs.promises.writeFile(
      path.join(this.outputDir, 'ai-instructions.md'), 
      aiInstructions
    );
  }
}
