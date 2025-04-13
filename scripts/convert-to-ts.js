#!/usr/bin/env node

/**
 * This script helps automate the process of migrating JavaScript files to TypeScript.
 * It renames .js files to .tsx for React components and .ts for other JS files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to scan for JS files
const directories = [
  path.join(__dirname, '..', 'src')
];

// File extensions to convert
const extensions = {
  '.js': { to: '.ts' },
  '.jsx': { to: '.tsx' }
};

// Special directories where files should be converted to .tsx instead of .ts
const reactComponentDirs = [
  'components',
  'pages',
  'app'
];

// Count for statistics
let stats = {
  renamed: 0,
  errors: 0
};

// Helper function to check if a path contains any of the special directories
function isReactComponentDir(filePath) {
  return reactComponentDirs.some(dir => filePath.includes('/' + dir + '/'));
}

// Function to determine if a file is a React component
function isReactComponent(filePath, content) {
  // Check path first
  if (isReactComponentDir(filePath)) {
    return true;
  }
  
  // Check content for React imports or JSX
  return (
    content.includes('import React') || 
    content.includes('from "react"') || 
    content.includes("from 'react'") ||
    content.includes('<') && content.includes('/>') ||
    content.includes('function') && content.includes('return (') ||
    content.includes('export default function') ||
    content.includes('const') && content.includes('=> {') && content.includes('return (')
  );
}

// Function to recursively scan directories
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      scanDirectory(filePath);
    } else {
      const ext = path.extname(filePath);
      
      if (extensions[ext]) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          let newExt = extensions[ext].to;
          
          // Check if this is a React component
          if (newExt === '.ts' && isReactComponent(filePath, content)) {
            newExt = '.tsx';
          }
          
          const newPath = filePath.replace(ext, newExt);
          
          // Check if a TypeScript version already exists
          if (!fs.existsSync(newPath)) {
            console.log(`Converting: ${filePath} -> ${newPath}`);
            fs.renameSync(filePath, newPath);
            stats.renamed++;
          } else {
            console.log(`Skipping: ${filePath} (TypeScript version exists)`);
          }
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          stats.errors++;
        }
      }
    }
  });
}

// Run conversion
console.log('Starting TypeScript conversion...');
directories.forEach(scanDirectory);
console.log(`Conversion complete: ${stats.renamed} files renamed, ${stats.errors} errors`);

// Remind to run type checking
console.log('\nNext steps:');
console.log('1. Run "npm run type-check" to find and fix TypeScript errors');
console.log('2. Fix any "any" types or other TypeScript warnings');
console.log('3. Consider adding more specific types to improve type safety'); 