const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../'); // up to monorepo root

const config = getDefaultConfig(projectRoot);

// Watch all files in the workspace (monorepo) — especially libs/
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Important: allow symlinks (shared code)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
