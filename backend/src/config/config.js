import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from web.json
const configPath = path.join(__dirname, '..', 'web.json');
let config = {};

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error loading web.json config:', error.message);
  process.exit(1);
}

// Export configuration
export default config;

// Export individual config sections for convenience
export const serverConfig = config.server || {};
export const databaseConfig = config.database || {};
export const discordConfig = config.discord || {};
export const jwtConfig = config.jwt || {};
export const apiConfig = config.api || {};
export const staffConfig = config.staff || {};