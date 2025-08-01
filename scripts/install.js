#!/usr/bin/env node

/**
 * Installation script for aws-cloudscape-mcp-server
 *
 * This script will add the aws-cloudscape-mcp-server to the user's Cline MCP settings
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the path to the Cline MCP settings file
const getMcpSettingsPath = () => {
  const platform = process.platform;
  let basePath;

  if (platform === 'darwin' || platform === 'linux') {
    basePath = path.join(os.homedir(), '.vscode', 'User', 'globalStorage', 'asbx.amzn-cline', 'settings');
  } else if (platform === 'win32') {
    basePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'asbx.amzn-cline', 'settings');
  } else {
    console.error(`Unsupported platform: ${platform}`);
    process.exit(1);
  }

  // Check if basePath exists, if not try alternative paths for macOS
  if (platform === 'darwin' && !fs.existsSync(basePath)) {
    const alternativePaths = [
      path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'asbx.amzn-cline', 'settings')
    ];

    for (const altPath of alternativePaths) {
      if (fs.existsSync(altPath)) {
        basePath = altPath;
        break;
      }
    }
  }

  return path.join(basePath, 'cline_mcp_settings.json');
};

// Add the server to the MCP settings
const addServerToSettings = () => {
  const settingsPath = getMcpSettingsPath();

  // Check if the settings file exists
  if (!fs.existsSync(settingsPath)) {
    console.error(`MCP settings file not found at ${settingsPath}`);
    console.error('Please make sure Cline is installed correctly.');
    process.exit(1);
  }

  try {
    // Read the settings file
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);

    // Get the path to the installed package
    const packagePath = path.resolve(__dirname, '..');
    const serverPath = path.join(packagePath, 'build', 'index.js');

    // Add or update the server entry
    if (!settings.mcpServers) {
      settings.mcpServers = {};
    }

    settings.mcpServers['aws-cloudscape-mcp-server'] = {
      command: 'node',
      args: [serverPath],
      env: {
        FASTMCP_LOG_LEVEL: 'ERROR'
      },
      disabled: false,
      autoApprove: []
    };

    // Write the updated settings back to the file
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

    console.log('✅ AWS Cloudscape MCP Server has been added to Cline MCP settings');
    console.log(`   Server location: ${serverPath}`);
  } catch (error) {
    console.error('Error updating MCP settings:', error);
    process.exit(1);
  }
};

// Run the installation
console.log('📦 Installing AWS Cloudscape MCP Server...');
addServerToSettings();
console.log('🚀 Installation complete! You can now use aws-cloudscape-mcp-server with Cline.');
console.log('\nExample usage:');
console.log('  - Search for components: use aws-cloudscape-mcp-server tool search_components');
console.log('  - Get recommendations: use aws-cloudscape-mcp-server tool get_component_recommendation');
