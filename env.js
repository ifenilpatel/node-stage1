const path = require('path');

const dotenv = require('dotenv');

const env = process.env.BUILD || 'development';

const envFileMap = {
  development: '.env.development',
  client: '.env.client'
};

const envFile = envFileMap[env];

if (!envFile) {
  throw new Error(`No env file configured for BUILD=${env}`);
}

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
  override: true
});

console.log(`Loaded environment: ${envFile}`);
