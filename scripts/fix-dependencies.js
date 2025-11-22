#!/usr/bin/env node

/**
 * Post-install script to fix nested dependencies that npm overrides might not handle
 * This ensures fork-ts-checker-webpack-plugin uses compatible ajv versions
 */

const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const forkTsCheckerPath = path.join(
  nodeModulesPath,
  'fork-ts-checker-webpack-plugin'
);

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

// Remove nested node_modules from fork-ts-checker-webpack-plugin
// This forces it to use the hoisted versions from the root
const nestedNodeModules = path.join(forkTsCheckerPath, 'node_modules');

if (fs.existsSync(nestedNodeModules)) {
  console.log('Removing nested node_modules from fork-ts-checker-webpack-plugin...');
  try {
    // Only remove schema-utils and ajv-related packages from nested node_modules
    const nestedSchemaUtils = path.join(nestedNodeModules, 'schema-utils');
    const nestedAjv = path.join(nestedNodeModules, 'ajv');
    const nestedAjvKeywords = path.join(nestedNodeModules, 'ajv-keywords');
    const nestedAjvFormats = path.join(nestedNodeModules, 'ajv-formats');

    [nestedSchemaUtils, nestedAjv, nestedAjvKeywords, nestedAjvFormats].forEach((dir) => {
      if (fs.existsSync(dir)) {
        try {
          removeDir(dir);
          console.log(`Removed nested ${path.basename(dir)}`);
        } catch (err) {
          console.warn(`Warning: Could not remove ${path.basename(dir)}:`, err.message);
        }
      }
    });
  } catch (error) {
    console.warn('Warning: Could not remove nested dependencies:', error.message);
    // Non-fatal, continue
  }
} else {
  console.log('No nested node_modules found in fork-ts-checker-webpack-plugin');
}

console.log('Dependency fix completed');

