# 🚀 postman-to-file

> **Transform your Postman collections into AI-friendly file structures!**

Ever tried to get an AI assistant to help you with a massive Postman collection JSON file? It's like asking someone to read a 10,000-page book in one sitting! 😵‍💫

**postman-to-file** solves this by breaking down your Postman collections into organized, readable file structures that AI tools (like Cursor, GitHub Copilot, or ChatGPT) can easily understand and help you edit.

## Quick Start

### Installation

```bash
npm install -g postman-to-file
```

### Usage

```
my_awesome_project % postman-to-file
    Usage:
    postman-to-file import <collection.json> <output-directory>
    postman-to-file export <directory> <output.json>

    Examples:
    postman-to-file import my-collection.json ./my-api/
    postman-to-file export ./my-api/ updated-collection.json

    To run collections, use Newman directly:
    newman run collection.json -e environment.json
```

## 🤔 Why Do I Need This?

### The Problem

- **Massive JSON files**: Postman exports are huge, monolithic JSON files
- **AI confusion**: AI tools struggle with complex nested structures
- **Hard to edit**: Finding and modifying specific requests is a nightmare
- **No version control**: Hard to track changes in a single JSON file
- **Git conflicts**: Multiple developers editing the same JSON = merge nightmare
- **Collaboration chaos**: "Who changed what?" becomes impossible to track

### The Solution

- **Organized structure**: Each request becomes its own file
- **AI-friendly**: Clean, readable files that AI can easily understand
- **Easy editing**: Find and modify requests quickly
- **Version control**: Track changes to individual requests
- **Team collaboration**: Multiple developers can work on different requests simultaneously
- **Git-friendly**: No more merge conflicts on massive JSON files
- **Round-trip safe**: Convert back to Postman format anytime

## 🎯 What Does It Do?

```
📁 Your Postman Collection
├── 📄 collection.json          # Main collection info
├── 📄 variables.json           # Collection variables
├── 📄 README.md               # Documentation for AI
└── 📁 requests/               # All your requests
    ├── 001-GET-Get-Users.json
    ├── 001-GET-Get-Users.event.json
    ├── 002-POST-Create-User.json
    ├── 002-POST-Create-User.event.json
    └── 📁 003-Authentication/  # Folders too!
        ├── metadata.json
        ├── 001-POST-Login.json
        └── 001-POST-Login.event.json
```

## 📖 Detailed Usage

### Import (JSON → File Structure)

```bash
postman-to-file import <collection.json> <output-directory>
```

**Example:**

```bash
postman-to-file import my-api-collection.json ./my-api-structure/
```

This creates a clean file structure where:

- Each request becomes a separate `.json` file
- Scripts are extracted to `.event.json` files
- Variables are organized in `variables.json`
- Folders maintain their hierarchy
- Everything is numbered for proper ordering

### Export (File Structure → JSON)

```bash
postman-to-file export <directory> <output.json>
```

**Example:**

```bash
postman-to-file export ./my-api-structure/ updated-collection.json
```

This converts your edited file structure back into a valid Postman collection JSON.

## Running Your Collections

Once you've converted your collection back to JSON, you can import the collection into Postman or use Postman's official tool [Newman](https://github.com/postmanlabs/newman) to run it:

```bash
# Install Newman
npm install -g newman

# Run your collection
newman run collection.json

# Run with environment
newman run collection.json -e environment.json

# Run with custom options
newman run collection.json --reporters cli,html --reporter-html-export report.html
```
